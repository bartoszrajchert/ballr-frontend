import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Section from '@/components/Section';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { getAddressFromFacility, getLocaleDateString } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { addUserToMatch } from '@/repository/match.repository';
import { IconCalendarEvent, IconInfoCircle } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import useSWR, { SWRConfig } from 'swr';
import footballImage1 from '../../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

enum MatchStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * TODO: mock data
 * TODO: team add
 * @param fallback
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

  const submitAddUser = async (isReferee: boolean) => {
    if (!id) return;

    addUserToMatch(String(id), isReferee)
      .then(() => {
        toast.success('Zapisano na mecz');
      })
      .catch((err) => {
        toast.error('Nie udało się zapisać na mecz');
        console.error(err);
      });
  };

  const { user_name: refereeName, user_last_name: refereeLastName } =
    match?.users?.find((user) => user.is_referee) ?? {};

  const {
    user_name: mvpName,
    user_last_name: mvpLastName,
    user_score: mvpScore,
  } = match?.users?.find((user) => user.is_mvp) ?? {};

  return (
    <MainLayout>
      <div className="mt-10 space-y-16">
        <section className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-2">
          <Image
            className="aspect-video rounded-2xl bg-green-900 object-cover"
            src={footballImage1}
            quality={20}
            alt=""
          />
          <div className="my-auto space-y-6 lg:px-10">
            <div className="flex flex-col gap-2">
              <div>
                <Link
                  className="link --underline"
                  href={`${ROUTES.FACILITIES}/${match?.reservation?.field?.facility_id}`}
                >
                  {match?.reservation?.field?.facility?.name ?? 'Error'}
                </Link>
              </div>
              <h1 className="text-heading-h3">
                {getAddressFromFacility(match?.reservation?.field?.facility)}
              </h1>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-3">
                <IconInfoCircle />
                <p>
                  Zapisani: {match?.users?.length} / {match?.num_of_players}
                </p>
              </div>
              <div className="flex gap-3">
                <IconCalendarEvent />
                <p>{getLocaleDateString(match?.reservation?.start_time)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              {matchStatus === MatchStatus.UPCOMING && (
                <>
                  <Button
                    value="Zapisz się jako zawodnik"
                    fullWidth
                    onClick={() => submitAddUser(false)}
                    disabled={match?.users?.length === match?.num_of_players}
                  />
                  <Button
                    value="Zapisz się jako sędzia"
                    type="secondary"
                    onClick={() => submitAddUser(false)}
                    disabled={match?.users?.some((user) => user.is_referee)}
                    fullWidth
                  />
                </>
              )}
              {matchStatus === MatchStatus.IN_PROGRESS && (
                <p className="text-heading-h3">Mecz w trakcie</p>
              )}
              {matchStatus === MatchStatus.COMPLETED && (
                <p className="text-heading-h3 text-green-700">
                  Mecz zakończony
                </p>
              )}
            </div>
          </div>
        </section>
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
        <Section
          title={`Uczestnicy ${match?.users?.length} / ${match?.num_of_players}`}
        >
          <div className="flex flex-wrap gap-4">
            {match?.users?.map((user) => (
              <Link
                href={`${ROUTES.PROFILE}/${user.user_id}`}
                key={user.user_id}
              >
                <div className="flex flex-col items-center justify-center rounded-2xl bg-grey-100 p-7 shadow-border-1px shadow-grey-300 hover:bg-green-100">
                  <Avatar
                    firstName={user.user_name}
                    lastName={user.user_last_name}
                    className="mb-4"
                  />
                  <p className="text-label-medium">
                    {user.user_name} {user.user_last_name}
                  </p>
                  <p>Ocena: {user.user_score}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </MainLayout>
  );
};

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
