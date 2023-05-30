import Button, { ButtonProps } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import EntityCard from '@/components/EntityCard';
import ImageHeader from '@/components/ImageHeader';
import Section from '@/components/Section';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import {
  getAddressFromFacility,
  getErrorMessage,
  getFieldErrorText,
  getLocaleDateString,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import {
  addTeamToMatch,
  addUserToMatch,
  deleteTeamFromMatch,
} from '@/repository/match.repository';
import { IconCalendarEvent, IconInfoCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';

enum MatchStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export default function MatchId({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Content />
    </SWRConfig>
  );
}

const Content = () => {
  const auth = useGetAuth();
  const [firebaseUser, authLoading] = useAuthState(auth);

  const router = useRouter();
  const { id } = router.query;
  const { data: match } = useSWR<Match>(`${BACKEND_ROUTES.MATCHES}/${id}`);
  const [matchStatus, setMatchStatus] = React.useState<MatchStatus | null>(
    null
  );

  useEffect(() => {
    if (match?.reservation?.start_time) {
      const startTime = new Date('2023-05-25T14:41:24');
      const currentTime = new Date();

      if (startTime < currentTime) {
        setMatchStatus(MatchStatus.COMPLETED);
      } else if (startTime > currentTime) {
        setMatchStatus(MatchStatus.IN_PROGRESS);
      } else {
        setMatchStatus(MatchStatus.UPCOMING);
      }
    }
  }, [match]);

  const { user_name: refereeName, user_last_name: refereeLastName } =
    match?.users?.find((user) => user.is_referee) ?? {};

  const {
    user_name: mvpName,
    user_last_name: mvpLastName,
    user_score: mvpScore,
  } = match?.users?.find((user) => user.is_mvp) ?? {};

  // TODO: adjust when user will have uid
  const me: Partial<UserMatch> = { voted: false };

  const getNumberOfTeams = () => {
    if (match?.opponent_team && match?.team) {
      return 2;
    } else if (match?.opponent_team || match?.team) {
      return 1;
    }
    return 0;
  };

  // TODO: sprawdź czy jestem zapisany na mecz jako sędzia
  const amISignedAsReferee = false;
  // TODO: sprawdź czy jestem zapisany na mecz jako gracz
  const amISignedAsPlayer = false;
  // TODO: sprawdź czy jestem kapitanem drużyny i czy mecz jest drużynowy
  const amICaptainAndIsTeamMatch = true && match?.for_team_only;

  return (
    <MainLayout>
      <div className="mt-10 space-y-16">
        <ImageHeader
          href={`${ROUTES.FACILITIES}/${match?.reservation?.field?.facility_id}`}
          hrefText={match?.reservation?.field?.facility?.name ?? 'Error'}
          title={getAddressFromFacility(match?.reservation?.field?.facility)}
          iconDetails={[
            {
              icon: <IconInfoCircle />,
              text: `Zapisani: ${match?.users?.length} / ${match?.num_of_players}`,
            },
            {
              icon: <IconCalendarEvent />,
              text: getLocaleDateString(match?.reservation?.start_time),
            },
          ]}
        >
          <div
            className={clsx('flex gap-2 lg:flex-row', {
              'lg:flex-row': !match?.for_team_only,
              'flex-col lg:flex-col': match?.for_team_only,
            })}
          >
            {/* User form */}
            {matchStatus === MatchStatus.UPCOMING &&
              match &&
              !match?.for_team_only && (
                <ButtonForm
                  id={String(id)}
                  signUpButtonType="primary"
                  amISigned={amISignedAsPlayer}
                  signUpText="Zapisz się jako zawodnik"
                  signOutText="Wypisz się z meczu"
                  isReferee={false}
                  disabled={
                    !amISignedAsPlayer &&
                    match?.users?.length === match?.num_of_players
                  }
                />
              )}

            {/* Team form */}
            {matchStatus === MatchStatus.UPCOMING && match?.for_team_only && (
              <TeamForm match={match} />
            )}

            {/* Referee form */}
            {match &&
              match.open_for_referee &&
              matchStatus === MatchStatus.UPCOMING && (
                <ButtonForm
                  id={String(id)}
                  signUpButtonType="secondary"
                  amISigned={amISignedAsReferee}
                  signUpText="Zapisz się jako sędzia"
                  signOutText="Wypisz się z meczu"
                  isReferee={true}
                  disabled={
                    !amISignedAsReferee &&
                    !!match?.users?.some((user) => user.is_referee)
                  }
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

                {amICaptainAndIsTeamMatch && (
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
              <TextInformation
                header="MVP"
                body={
                  mvpName ? `${mvpName} ${mvpLastName} - ${mvpScore}` : 'Brak'
                }
              />
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
              body={refereeName ? `${refereeName} ${refereeLastName}` : 'Brak'}
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
            title={`Uczestnicy ${match?.users?.length} / ${match?.num_of_players}`}
          >
            <div className="flex flex-wrap gap-4">
              {match?.users?.map((user) => (
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

  const submitAddUser = async () => {
    addUserToMatch(props.id, props.isReferee)
      .then(() => {
        toast.success('Zapisano na mecz');
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.id}`);
      })
      .catch((err) => {
        toast.error(`Nie udało się zapisać na mecz: ${getErrorMessage(err)}`);
        console.error(err);
      });
  };

  // TODO: submitDeleteUser
  const submitDeleteUser = async () => {
    console.log('submitDeleteUser');
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

function TeamForm(props: { match: Match }) {
  const { mutate } = useSWRConfig();
  const {
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm();

  // TODO: get teams from API
  const myTeam = { team_id: 1 };
  const isMyTeamSigned =
    props.match?.opponent_team?.id === myTeam.team_id ||
    props.match?.team?.id === myTeam.team_id;

  const submitAddTeam = async (data: any) => {
    if (!props.match.id) return;

    addTeamToMatch(String(props.match.id), data.team_id)
      .then(() => {
        toast.success('Zapisano na mecz');
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.match.id}`); // Refresh match data
      })
      .catch((err) => {
        toast.error(`Nie udało się zapisać na mecz: ${getErrorMessage(err)}`);
      });
  };

  const submitDeleteTeam = async () => {
    if (!props.match.id) return;

    deleteTeamFromMatch(String(props.match.id), myTeam.team_id)
      .then(() => {
        toast.success('Wypisano z meczu');
        mutate(`${BACKEND_ROUTES.MATCHES}/${props.match.id}`); // Refresh match data
      })
      .catch((err) => {
        toast.error(`Nie udało się wypisać z meczu: ${getErrorMessage(err)}`);
      });
  };

  return (
    <form
      className="space-y-1"
      onSubmit={handleSubmit(isMyTeamSigned ? submitDeleteTeam : submitAddTeam)}
    >
      <div className="flex flex-col gap-2 lg:flex-row">
        {!isMyTeamSigned && (
          <Dropdown
            name="team_id"
            placeholder="Wybierz drużynę"
            control={control}
            rules={{ required: true }}
            errorText={getFieldErrorText('team_id', errors)}
            data={[
              // TODO: get teams (where user is captain) from API
              { label: '1', value: '1' },
              { label: '2', value: '2' },
            ]}
          />
        )}
        <Button
          value={isMyTeamSigned ? 'Wypisz drużynę' : 'Zapisz drużynę'}
          type={isMyTeamSigned ? 'cancel' : 'primary'}
          fullWidth
          disabled={
            !isMyTeamSigned &&
            !!props.match?.team &&
            !!props.match?.opponent_team
          }
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
