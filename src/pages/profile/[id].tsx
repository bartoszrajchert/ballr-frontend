import AvatarHeader from '@/components/AvatarHeader';
import Button from '@/components/Button';
import EntityCard from '@/components/EntityCard';
import Section from '@/components/Section';
import Spinner from '@/components/Spinner';
import TextInformation from '@/components/TextInformation';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { getLocaleDateString, is404 } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetUserResponse } from '@/models/user.model';
import { UserContext } from '@/providers/UserProvider';
import { IconPencil } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import useSWR, { SWRConfig } from 'swr';

export default function ProfileId({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Content />
    </SWRConfig>
  );
}

function Content() {
  const { user } = useContext(UserContext);

  const router = useRouter();
  const { id } = router.query;
  const {
    data: profile,
    isLoading,
    error,
  } = useSWR<GetUserResponse>(`${BACKEND_ROUTES.USERS}/${id}`);

  const rating = useMemo(() => {
    if (!profile) return 0;

    return (
      profile.matches.reduce((acc, curr) => curr.combined_rating + acc, 0) /
      profile.matches.length
    );
  }, [profile]);

  const teamsWithoutBanned = useMemo(() => {
    if (!profile) return [];

    return profile.teams.filter((team) => !team.is_banned);
  }, [profile]);

  if (!profile && isLoading) {
    return <Spinner />;
  }

  if (!profile || is404(error)) {
    return <NoResultsMessage message="Nie udało się znaleźć użytkownika." />;
  }

  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  return (
    <MainLayout>
      <AvatarHeader
        avatarText={`${profile.first_name} ${profile.last_name}`}
        title={`${profile.first_name} ${profile.last_name}`}
        subtitle="Użytkownik"
      >
        <>
          {id === user?.id && (
            <Link href={ROUTES.SETTINGS}>
              <Button icon={<IconPencil />} type="tertiary" />
            </Link>
          )}
        </>
      </AvatarHeader>
      <div className="space-y-16">
        <Section title="Informacje">
          <div className="flex w-full flex-col flex-wrap gap-5 sm:flex-row">
            <TextInformation
              header="Data urodzenia"
              body={getLocaleDateString(profile.birth_date, true)}
              className="flex-grow"
            />
            <TextInformation
              header="Płeć"
              body={profile.gender.type}
              className="flex-grow"
            />
            <TextInformation
              header="Miasto"
              body={profile.city.name}
              className="flex-grow"
            />
            <TextInformation
              header="Ocena"
              body={isNaN(rating) ? 'Brak' : rating.toString()}
              className="flex-grow"
            />
          </div>
        </Section>
        <Section title={`Drużyny (${teamsWithoutBanned.length})`}>
          <div className="flex w-full flex-col flex-wrap gap-5 sm:flex-row">
            {teamsWithoutBanned.map((team) => (
              <EntityCard
                key={team.team_id}
                href={`${ROUTES.TEAMS}/${team.team_id}`}
                avatar={{
                  text: team.team_short_name,
                  size: 68,
                }}
                title={team.team_name}
                paragraph={team.is_captain ? 'Kapitan' : undefined}
              />
            ))}
          </div>
        </Section>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const profile = await fetcherBackend(
    `${BACKEND_ROUTES.USERS}/${id}`,
    context
  );

  return {
    props: {
      fallback: {
        [`${BACKEND_ROUTES.USERS}/${id}`]: profile ?? null,
      },
    },
  };
};
