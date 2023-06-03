import Button, { ButtonProps } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import EntityCard from '@/components/EntityCard';
import ImageHeader from '@/components/ImageHeader';
import Section from '@/components/Section';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import { MAX_NUMBER_OF_TEAMS } from '@/lib/constants';
import { fetcherBackend } from '@/lib/fetchers';
import {
  getAddressFromFacility,
  getErrorMessage,
  getFieldErrorText,
  getLocaleDateString,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetMatchResponse } from '@/models/match.model';
import { UserContext } from '@/providers/UserProvider';
import {
  addTeamToMatch,
  addUserToMatch,
  deleteTeamFromMatch,
  deleteUserFromMatch,
} from '@/repository/match.repository';
import {
  IconCalendarEvent,
  IconEdit,
  IconInfoCircle,
} from '@tabler/icons-react';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';

enum MatchStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * This page is used to display match details.
 * It can be accessed by all players, however the server will check if the user is in the match.
 *
 * This page has a refresh interval of 5 seconds. It is used to update the match status.
 *
 * TODO: Koordynator can delete users and referees from the match.
 *
 * @param fallback - Fallback data for SWR.
 * @constructor
 */
export default function MatchId({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Content />
    </SWRConfig>
  );
}

const Content = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: match } = useSWR<GetMatchResponse>(
    `${BACKEND_ROUTES.MATCHES}/${id}`,
    { refreshInterval: 5000, revalidateOnMount: true }
  );

  const { user } = useContext(UserContext);
  const [matchStatus, setMatchStatus] = React.useState<MatchStatus | null>(
    null
  );

  useEffect(() => {
    if (match?.reservation?.start_time) {
      const startTime = new Date(match.reservation.start_time);
      const endTime = new Date(match.reservation.end_time);
      const currentTime = new Date();

      if (startTime > currentTime) {
        setMatchStatus(MatchStatus.UPCOMING);
      } else if (startTime < currentTime && endTime > currentTime) {
        setMatchStatus(MatchStatus.IN_PROGRESS);
      } else if (endTime < currentTime) {
        setMatchStatus(MatchStatus.COMPLETED);
      } else {
        setMatchStatus(null);
      }
    }
  }, [match]);

  const referee = useMemo(
    () => match?.users?.find((user) => user.is_referee),
    [match]
  );

  const mvpUser = useMemo(
    () => match?.users?.find((user) => user.is_mvp),
    [match]
  );

  const getNumberOfTeams = useCallback(() => {
    if (match?.opponent_team && match?.team) {
      return 2;
    } else if (match?.opponent_team || match?.team) {
      return 1;
    }
    return 0;
  }, [match]);

  const me = useMemo(
    () => match?.users.find((matchUser) => matchUser.user_id === user?.id),
    [match?.users, user?.id]
  );

  const teamWhereIAmCaptain = useMemo(
    () =>
      user?.teams?.find(
        (team) =>
          (team.team_id === match?.opponent_team?.id ||
            team.team_id === match?.team?.id) &&
          team.is_captain
      ),
    [match?.opponent_team?.id, match?.team?.id, user?.teams]
  );

  const myTeamScore = useMemo(() => {
    if (match?.opponent_team?.id === teamWhereIAmCaptain?.team_id) {
      return match?.opponent_score;
    } else if (match?.team?.id === teamWhereIAmCaptain?.team_id) {
      return match?.score;
    }
    return null;
  }, [
    match?.opponent_score,
    match?.opponent_team?.id,
    match?.score,
    match?.team?.id,
    teamWhereIAmCaptain?.team_id,
  ]);

  return (
    <MainLayout>
      <div className="mt-10 space-y-16">
        <ImageHeader
          href={`${ROUTES.FACILITIES}/${match?.reservation?.field?.facility.id}`}
          hrefText={match?.reservation?.field?.facility?.name ?? 'Error'}
          title={getAddressFromFacility(match?.reservation?.field?.facility)}
          iconDetails={[
            {
              icon: <IconInfoCircle />,
              text: match?.for_team_only
                ? `Drużyny: ${getNumberOfTeams()} / ${MAX_NUMBER_OF_TEAMS}`
                : `Zapisani: ${match?.signed_users} / ${match?.num_of_players}`,
            },
            {
              icon: <IconCalendarEvent />,
              text: getLocaleDateString(match?.reservation?.start_time),
            },
          ]}
        >
          <div
            className={clsx('flex flex-col gap-2', {
              hidden: !user,
            })}
          >
            {/* User form */}
            {matchStatus === MatchStatus.UPCOMING &&
              match &&
              !match?.for_team_only && (
                <ButtonForm
                  id={String(id)}
                  signUpButtonType="primary"
                  amISigned={!!me && !me?.is_referee}
                  signUpText="Zapisz się jako zawodnik"
                  signOutText="Wypisz się z meczu"
                  isReferee={false}
                  disabled={
                    (!me && match?.signed_users === match?.num_of_players) ||
                    (!!me && me?.is_referee)
                  }
                />
              )}

            {/* Team form */}
            {matchStatus === MatchStatus.UPCOMING && match?.for_team_only && (
              <TeamForm match={match} numberOfTeams={getNumberOfTeams()} />
            )}

            {/* Referee form */}
            {match &&
              match.open_for_referee &&
              matchStatus === MatchStatus.UPCOMING && (
                <ButtonForm
                  id={String(id)}
                  signUpButtonType="secondary"
                  amISigned={!!me?.is_referee}
                  signUpText="Zapisz się jako sędzia"
                  signOutText="Wypisz się z meczu"
                  isReferee={true}
                  disabled={
                    (me && !me?.is_referee) ||
                    !!match?.users?.some((user) => user.is_referee)
                  }
                />
              )}

            {match &&
              matchStatus === MatchStatus.UPCOMING &&
              match.reservation.user.id === user?.id && (
                <Button
                  value="Edytuj mecz"
                  fullWidth
                  type="secondary"
                  icon={<IconEdit />}
                  onClick={() => router.push(`${ROUTES.MATCHES}/${id}/edit`)}
                />
              )}

            {matchStatus === MatchStatus.IN_PROGRESS && (
              <p className="text-heading-h3 text-green-800">Mecz w trakcie</p>
            )}

            {matchStatus === MatchStatus.COMPLETED && (
              <div className="flex w-full flex-col gap-4">
                <p className="text-heading-h3 text-green-700">
                  Mecz zakończony
                </p>

                {me && !me.voted && !match?.for_team_only && (
                  <NextLink href={`${ROUTES.MATCHES}/${id}/rate`}>
                    <Button value="Oceń graczy" fullWidth />
                  </NextLink>
                )}

                {teamWhereIAmCaptain &&
                  (myTeamScore === null || myTeamScore === undefined) &&
                  match?.for_team_only && (
                    <NextLink href={`${ROUTES.MATCHES}/${id}/rate`}>
                      <Button value="Wpisz wynik" fullWidth />
                    </NextLink>
                  )}
              </div>
            )}
          </div>
        </ImageHeader>

        {matchStatus === MatchStatus.COMPLETED && (
          <Section title="Wynik">
            <div className="flex w-full flex-col flex-wrap gap-2 sm:flex-row">
              {match?.for_team_only && (
                <>
                  <TextInformation
                    header={`Wynik drużyny ${match?.team?.name}`}
                    body={match?.score?.toString() ?? 'Pending'}
                  />
                  <TextInformation
                    header={`Wynik drużyny ${match?.opponent_team?.name}`}
                    body={match?.opponent_score?.toString() ?? 'Pending'}
                  />
                </>
              )}
              {!match?.for_team_only && (
                <TextInformation
                  header="MVP"
                  body={
                    mvpUser
                      ? `${mvpUser.user_name} ${mvpUser.user_last_name} - ${mvpUser.user_score}`
                      : 'Brak'
                  }
                />
              )}
            </div>
          </Section>
        )}

        <Section title="Informacje">
          <div className="flex w-full flex-col flex-wrap gap-2 sm:flex-row">
            <TextInformation
              header="Nazwa boiska"
              body={match?.reservation?.field?.name ?? 'Error'}
              className="flex-grow"
            />
            <TextInformation
              header="Długość boiska"
              body={match?.reservation?.field?.length?.toString() ?? 'Error'}
              className="flex-grow"
            />
            <TextInformation
              header="Szerokość boiska"
              body={match?.reservation?.field?.width?.toString() ?? 'Error'}
              className="flex-grow"
            />
            <TextInformation
              header="Koordynator"
              body={
                `${match?.reservation?.user?.first_name} ${match?.reservation?.user?.last_name}` ??
                'Error'
              }
              className="flex-grow"
            />
            <TextInformation
              header="Sędzia"
              body={
                referee
                  ? `${referee.user_name} ${referee.user_last_name}`
                  : 'Brak'
              }
              className="flex-grow"
            />
            <TextInformation
              header="Pogoda"
              body={
                match?.weather
                  ? `${match?.weather?.temp} °C ${match?.weather?.description}`
                  : 'Brak informacji'
              }
              className="flex-grow"
            />
          </div>
        </Section>

        <Section title="Opis">
          <p>{match?.description}</p>
        </Section>

        {!match?.for_team_only && (
          <Section
            title={`Uczestnicy ${match?.signed_users} / ${match?.num_of_players}`}
          >
            <div className="flex flex-wrap gap-4">
              {match?.users
                ?.filter((user) => !user.is_referee)
                .map((user) => (
                  <EntityCard
                    key={user.user_id}
                    href={`${ROUTES.PROFILE}/${user.user_id}`}
                    avatar={{
                      firstName: user.user_name,
                      lastName: user.user_last_name,
                    }}
                    title={`${user.user_name} ${user.user_last_name}`}
                    paragraph={`Ocena: ${user.user_score}`}
                  />
                ))}
            </div>
          </Section>
        )}
        {match?.for_team_only && (
          <Section title={`Drużyny ${getNumberOfTeams()} / 2`}>
            <div className="flex flex-wrap gap-4">
              {match?.team && (
                <EntityCard
                  key={match?.team?.id}
                  href={`${ROUTES.TEAMS}/${match?.team?.id}`}
                  title={match?.team?.name}
                />
              )}
              {match?.opponent_team && (
                <EntityCard
                  key={match?.opponent_team?.id}
                  href={`${ROUTES.TEAMS}/${match?.opponent_team?.id}`}
                  title={match?.opponent_team?.name}
                />
              )}
            </div>
          </Section>
        )}
      </div>
    </MainLayout>
  );
};

function ButtonForm(props: {
  amISigned: boolean;
  id: string;
  isReferee: boolean;
  signUpText: string;
  signOutText: string;
  signUpButtonType: ButtonProps['type'];
  disabled: boolean;
}) {
  const { mutate } = useSWRConfig();
  const { user } = useContext(UserContext); // TODO: remove this

  const submitAddUser = async () => {
    if (!user) return toast.error('Musisz być zalogowany'); // TODO: remove this

    addUserToMatch(props.id, user.id, props.isReferee)
      .then(() => {
        toast.success('Zapisano na mecz');
      })
      .catch((err) => {
        toast.error(`Nie udało się zapisać na mecz: ${getErrorMessage(err)}`);
        console.error(err);
      })
      .finally(() => {
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.id}`);
      });
  };

  const submitDeleteUser = async () => {
    deleteUserFromMatch(props.id)
      .then(() => {
        toast.success('Wypisano z meczu');
      })
      .catch((err) => {
        toast.error(`Nie udało się wypisać z meczu: ${getErrorMessage(err)}`);
        console.error(err);
      })
      .finally(() => {
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.id}`);
      });
  };

  return (
    <Button
      value={props.amISigned ? props.signOutText : props.signUpText}
      type={props.amISigned ? 'cancel' : props.signUpButtonType}
      disabled={props.disabled}
      fullWidth
      onClick={props.amISigned ? submitDeleteUser : submitAddUser}
    />
  );
}

function TeamForm(props: { match: GetMatchResponse; numberOfTeams: number }) {
  const { user } = useContext(UserContext);
  const { mutate } = useSWRConfig();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const mySignedTeam = useMemo(
    () =>
      user?.teams?.find(
        (team) =>
          team.team_id === props.match?.opponent_team?.id ||
          team.team_id === props.match?.team?.id
      ) ?? null,
    [props.match?.opponent_team?.id, props.match?.team?.id, user?.teams]
  );

  const submitAddTeam = async (data: any) => {
    if (!props.match.id) return;

    addTeamToMatch(String(props.match.id), data.team_id)
      .then(() => {
        toast.success('Zapisano na mecz');
      })
      .catch((err) => {
        toast.error(`Nie udało się zapisać na mecz: ${getErrorMessage(err)}`);
      })
      .finally(() => {
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.match.id}`);
      });
  };

  const submitDeleteTeam = async () => {
    if (!props.match.id) return;

    if (!mySignedTeam) {
      toast.error('Nie jesteś kapitanem tej drużyny.');
      return;
    }

    deleteTeamFromMatch(String(props.match.id), mySignedTeam.team_id)
      .then(() => {
        toast.success('Wypisano z meczu');
      })
      .catch((err) => {
        toast.error(`Nie udało się wypisać z meczu: ${getErrorMessage(err)}`);
      })
      .finally(() => {
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.match.id}`); // Refresh match data
      });
  };

  return (
    <form
      className="space-y-1"
      onSubmit={handleSubmit(mySignedTeam ? submitDeleteTeam : submitAddTeam)}
    >
      <div className="flex flex-col gap-2 lg:flex-row">
        {!mySignedTeam && (
          <Dropdown
            name="team_id"
            placeholder="Wybierz drużynę"
            control={control}
            rules={{ required: true }}
            errorText={getFieldErrorText('team_id', errors)}
            data={
              user?.teams?.map((team) => ({
                label: team.team_name,
                value: team.team_id.toString(),
              })) ?? []
            }
          />
        )}
        <Button
          value={mySignedTeam ? 'Wypisz drużynę' : 'Zapisz drużynę'}
          type={mySignedTeam ? 'cancel' : 'primary'}
          fullWidth
          disabled={!mySignedTeam && props.numberOfTeams >= MAX_NUMBER_OF_TEAMS}
          isSubmit
        />
      </div>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const match = await fetcherBackend(
    `${BACKEND_ROUTES.MATCHES}/${id}`,
    context
  );

  return {
    props: {
      fallback: {
        [`${BACKEND_ROUTES.MATCHES}/${id}`]: match ?? null,
      },
    },
  };
};
