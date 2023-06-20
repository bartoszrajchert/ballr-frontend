import Button from '@/components/Button';
import EntityCard from '@/components/EntityCard';
import Section from '@/components/Section';
import Spinner from '@/components/Spinner';
import TextField from '@/components/TextField';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import {
  DynamicDropdown,
  DynamicStaticDropdown,
} from '@/components/dynamic/DynamicDropdown';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  is404,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { City } from '@/models/base.model';
import { EditTeamPayload, GetTeamResponse } from '@/models/team.model';
import { UserContext } from '@/providers/UserProvider';
import {
  banUserFromTeam,
  deleteTeam,
  editTeam,
} from '@/repository/team.repository';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';

function TeamsIdEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const {
    data: team,
    isLoading,
    error,
  } = useSWR<GetTeamResponse>(`${BACKEND_ROUTES.TEAMS}/${id}`, {
    revalidateOnFocus: false,
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<EditTeamPayload>();

  useEffect(() => {
    reset({
      name: team?.name,
      short_name: team?.short_name,
      city_id: team?.city.id,
      new_captain: team?.users.find((u) => u.is_captain)?.user_id,
    });
  }, [reset, team?.city.id, team?.name, team?.short_name, team?.users]);

  const onSubmit = (data: EditTeamPayload) => {
    if (!team) return;

    if (data.new_captain === team?.users.find((u) => u.is_captain)?.user_id) {
      delete data.new_captain;
    }

    editTeam(team?.id.toString(), data)
      .then(async () => {
        toast.success('Dane zostały zaktualizowane');
        await router.push(`${ROUTES.TEAMS}/${team?.id}`);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
        toast.error('Wystąpił błąd');
      });
  };

  const deleteTeamSubmit = useCallback(() => {
    if (!team) return;

    deleteTeam(team?.id.toString())
      .then(async () => {
        toast.success('Drużyna została usunięta');
        await router.push(ROUTES.TEAMS);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
        toast.error(`Wystąpił błąd: ${err?.message}`);
      });
  }, [router, setError, team]);

  if (!team && isLoading && !error) {
    return <Spinner />;
  }

  if (error && !is404(error)) {
    return <ErrorMessage error={error.message} />;
  }

  if (!team || is404(error)) {
    return <NoResultsMessage message="Nie udało się znaleźć użytkownika." />;
  }

  return (
    <>
      <AuthFormLayout
        title={`Edycja ${team?.name}`}
        header="Edytuj drużynę"
        onSubmit={handleSubmit(onSubmit)}
        inputChildren={
          <>
            <TextField
              label="Nazwa"
              errorText={getFieldErrorText('name', errors)}
              {...register('name', { required: true })}
            />
            <TextField
              label="Skrócona nazwa"
              errorText={getFieldErrorText('short_name', errors)}
              {...register('short_name', { required: true, maxLength: 5 })}
            />
            <DynamicStaticDropdown
              label="Kapitan"
              name="new_captain"
              control={control}
              fieldErrors={errors}
              data={
                team?.users.map((u) => {
                  return {
                    label: `${u.user_first_name} ${u.user_last_name}${
                      u.user_id === user?.id ? ' (Ty)' : ''
                    }`,
                    value: u.user_id,
                  };
                }) || []
              }
            />
            <DynamicDropdown
              label="Miasto"
              name="city_id"
              control={control}
              fieldErrors={errors}
              dataType="pagination"
              apiURL={BACKEND_ROUTES.CITIES}
              mapper={({ name, id }: City) => ({
                label: name,
                value: id.toString(),
              })}
              rules={{ required: true }}
            />
          </>
        }
        buttonValue="Zapisz"
        buttonOnClick={() => resetKeepValues(reset)}
        cancelButtonValue="Usuń drużynę"
        cancelButtonOnClick={deleteTeamSubmit}
        confirmDialog={{
          title: 'Czy na pewno chcesz usunąć drużynę?',
          description: 'Ta operacja jest nieodwracalna.',
          confirmValue: 'Usuń drużynę',
        }}
        errorMessage={
          getFieldErrorText('root', errors) &&
          `Formularz zawiera błędy: ${getFieldErrorText('root', errors)}`
        }
        centered={false}
      />
      <UnbanSection data={team} />
    </>
  );
}

function UnbanSection(props: { data: GetTeamResponse }) {
  const { data } = props;

  return (
    <Section title="Zablokowani gracze" className="mb-14 text-center">
      <div className="flex flex-wrap gap-4">
        {data.banned_users.length === 0 && (
          <p className="m-auto text-gray-500">Brak zablokowanych graczy</p>
        )}
        {data.banned_users.map((bannedUser) => (
          <EntityCard
            key={bannedUser.user_id}
            href={`${ROUTES.PROFILE}/${bannedUser.user_id}`}
            title={`${bannedUser.user_first_name} ${bannedUser.user_last_name}`}
            avatar={{
              text: `${bannedUser.user_first_name} ${bannedUser.user_last_name}`,
            }}
            actionChildren={<UnbanUserDialog bannedUser={bannedUser} />}
          />
        ))}
      </div>
    </Section>
  );
}

function UnbanUserDialog({
  bannedUser,
}: {
  bannedUser: GetTeamResponse['banned_users'][0];
}) {
  const router = useRouter();
  const { id } = router.query;
  const { mutate } = useSWRConfig();

  const handleDelete = useCallback(() => {
    if (!id) return null;

    banUserFromTeam(String(id), bannedUser.user_id.toString(), false)
      .then(() => {
        toast.success(`Odblokowano gracza!`);
      })
      .catch((err) => {
        toast.error(`Nie udało się odblokować gracza: ${err}`);
      })
      .finally(async () => {
        await mutate(`${BACKEND_ROUTES.TEAMS}/${id}`);
      });
  }, [id, mutate, bannedUser.user_id]);

  return (
    <ConfirmDialog
      trigger={<Button type="tertiary" icon={<IconX />} />}
      title={`Czy na pewno chcesz odblokować gracza ${bannedUser.user_first_name} ${bannedUser.user_last_name}?`}
      description="Po odblokowaniu gracz będzie mógł dołączyć do drużyny."
      confirmValue="Odblokuj gracza"
      onConfirm={handleDelete}
    />
  );
}

export default TeamsIdEdit;
