import AvatarHeader from '@/components/AvatarHeader';
import Button from '@/components/Button';
import EntityCard from '@/components/EntityCard';
import Section from '@/components/Section';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { UserContext } from '@/providers/UserProvider';
import {
  addUserToTeam,
  GetTeamResponse,
  removeUserFromTeam,
} from '@/repository/team.repository';
import { IconCrown, IconPencil } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';

// TODO: Ban user by captain
// TODO: Remove user from team by captain
// TODO: Modal
// TODO: Show you are banned

export default function TeamsId({ fallback }: { fallback: any }) {
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
    data: team,
    isLoading,
    error,
  } = useSWR<GetTeamResponse>(`${BACKEND_ROUTES.TEAMS}/${id}`);

  if (!team && isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <MainLayout>
      <AvatarHeader
        avatarText={`${team.short_name}`}
        title={`${team.name}`}
        subtitle="Drużyna"
      >
        <ButtonContainer team={team} />
      </AvatarHeader>
      <div className="space-y-16">
        <Section title="Informacje">
          <div className="flex flex-wrap gap-4">
            <TextInformation
              header="Nazwa skrócona"
              body={team.short_name}
              className="flex-grow"
            />
            <TextInformation
              header="Miasto"
              body={team.city.name}
              className="flex-grow"
            />
          </div>
        </Section>
        <Section title={`Członkowie (${team.users.length})`}>
          <div className="flex flex-wrap gap-4">
            {team.users.map((teamUser) => (
              <EntityCard
                key={teamUser.user_id}
                href={`${ROUTES.PROFILE}/${teamUser.user_id}`}
                title={`${teamUser.user_first_name} ${teamUser.user_last_name}${
                  teamUser.user_id === user?.id ? ' (Ty)' : ''
                }`}
                avatar={{
                  text: `${teamUser.user_first_name} ${teamUser.user_last_name}`,
                }}
                leadingIcon={
                  teamUser.is_captain ? <IconCrown size={16} /> : undefined
                }
              />
            ))}
          </div>
        </Section>
      </div>
    </MainLayout>
  );
}

function ButtonContainer({ team }: { team: GetTeamResponse }) {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const { mutate } = useSWRConfig();

  const me = useMemo(() => {
    if (!user) return false;
    return team.users.find((team) => team.user_id === user.id);
  }, [team.users, user]);

  const joinToTeam = useCallback(() => {
    if (!id) return null;

    addUserToTeam(id.toString())
      .then(() => {
        toast.success(`Dołączono do drużyny!`);
      })
      .catch((err) => {
        toast.error(`Nie udało się dołączyć do drużyny: ${err}`);
      })
      .finally(async () => {
        await mutate(`${BACKEND_ROUTES.TEAMS}/${id}`);
      });
  }, [id, mutate]);

  const leaveTeam = useCallback(() => {
    if (!id) return null;

    removeUserFromTeam(id.toString())
      .then(() => {
        toast.success(`Opuściłeś drużynę!`);
      })
      .catch((err) => {
        toast.error(`Nie udało się opuścić drużyny: ${err}`);
      })
      .finally(async () => {
        await mutate(`${BACKEND_ROUTES.TEAMS}/${id}`);
      });
  }, [id, mutate]);

  // Not logged in
  if (!user) return null;

  // Not in team
  if (!me)
    return (
      <Button type="primary" value="Dołącz do drużyny" onClick={joinToTeam} />
    );

  // In team
  if (me && !me.is_captain)
    return (
      <Button type="secondary" value="Opuść drużynę" onClick={leaveTeam} />
    );

  // Captain
  if (me.is_captain)
    return (
      <Link href={`${ROUTES.TEAMS}/${id}/edit`}>
        <Button icon={<IconPencil />} type="tertiary" />
      </Link>
    );

  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const teams = await fetcherBackend(`${BACKEND_ROUTES.TEAMS}/${id}`, context);

  return {
    props: {
      fallback: {
        [`${BACKEND_ROUTES.TEAMS}/${id}`]: teams ?? null,
      },
    },
  };
};
