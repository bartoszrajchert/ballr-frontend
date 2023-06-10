import AvatarHeader from '@/components/AvatarHeader';
import Button from '@/components/Button';
import EntityCard from '@/components/EntityCard';
import Section from '@/components/Section';
import Spinner from '@/components/Spinner';
import TextInformation from '@/components/TextInformation';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { is404 } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetTeamResponse } from '@/models/team.model';
import { UserContext } from '@/providers/UserProvider';
import {
  addUserToTeam,
  banUserFromTeam,
  removeMeFromTeam,
  removeUserFromTeam,
} from '@/repository/team.repository';
import { IconCrown, IconPencil, IconTrash } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';

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

  const amICaptain = useMemo(() => {
    if (!team || !user) return false;
    return team.users.find((team) => team.user_id === user.id)?.is_captain;
  }, [team, user]);

  const amIBanned = useMemo(() => {
    if (!team || !user) return false;
    return team.banned_users.some(
      (bannedUser) => bannedUser.user_id === user.id
    );
  }, [team, user]);

  if (!team && isLoading && !error) {
    return <Spinner />;
  }

  if (is404(error)) {
    return <NoResultsMessage message="Drużyna nie istnieje" />;
  }

  if (!team || error) {
    return <ErrorMessage error={error.message} />;
  }

  return (
    <MainLayout title={`${team.name} (${team.short_name})`}>
      <>
        {amIBanned && (
          <div className="mt-4 flex w-full items-center justify-center rounded-xl bg-red bg-opacity-10 px-4 py-4 text-center">
            <p className="text-label-medium text-red">
              Nie możesz dołączyć do tej drużyny. Zostałeś zablokowany przez
              kapitana.
            </p>
          </div>
        )}
      </>
      <AvatarHeader
        avatarText={`${team.short_name}`}
        title={`${team.name}`}
        subtitle="Drużyna"
      >
        <>{!amIBanned && <ButtonContainer team={team} />}</>
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
                actionChildren={
                  amICaptain && !teamUser.is_captain ? (
                    <DeleteUserDialog teamUser={teamUser} />
                  ) : undefined
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

    removeMeFromTeam(id.toString())
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

function DeleteUserDialog({
  teamUser,
}: {
  teamUser: GetTeamResponse['users'][0];
}) {
  const router = useRouter();
  const { id } = router.query;
  const { mutate } = useSWRConfig();

  const handleDelete = useCallback(() => {
    if (!id) return null;

    removeUserFromTeam(String(id), teamUser.user_id.toString())
      .then(() => {
        toast.success(`Usunięto gracza!`);
      })
      .catch((err) => {
        toast.error(`Nie udało się usunąć gracza: ${err}`);
      })
      .finally(async () => {
        await mutate(`${BACKEND_ROUTES.TEAMS}/${id}`);
      });
  }, [id, mutate, teamUser.user_id]);

  const handleBan = useCallback(() => {
    banUserFromTeam(String(id), teamUser.user_id.toString(), true)
      .then(() => {
        toast.success(`Zbanowano gracza!`);
      })
      .catch((err) => {
        toast.error(`Nie udało się zbanować gracza: ${err}`);
      })
      .finally(async () => {
        await mutate(`${BACKEND_ROUTES.TEAMS}/${id}`);
      });
  }, [id, mutate, teamUser.user_id]);

  return (
    <ConfirmDialog
      trigger={<Button type="tertiary" icon={<IconTrash />} />}
      title={`Czy na pewno chcesz usunąć ${teamUser.user_first_name} ${teamUser.user_last_name}?`}
      description="Możesz również zablokować tę osobę aby nie mogła znów dołączyć."
      confirmValue="Usuń gracza"
      onConfirm={handleDelete}
      altConfirmValue="Zablokuj gracza"
      onAltConfirm={handleBan}
    />
  );
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
