import TextField from '@/components/TextField';
import CityDropdown from '@/components/dropdowns/CityDropdown';
import { DynamicDropdown } from '@/components/dynamic/DynamicDropdown';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { UserContext } from '@/providers/UserProvider';
import {
  deleteTeam,
  editTeam,
  EditTeamPayload,
  GetTeamResponse,
} from '@/repository/team.repository';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function TeamsIdEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const { data: team } = useSWR<GetTeamResponse>(
    `${BACKEND_ROUTES.TEAMS}/${id}`,
    {
      revalidateOnFocus: false,
    }
  );

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

    editTeam(team?.id.toString(), data)
      .then(() => {
        toast.success('Dane zostały zaktualizowane');
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
        toast.error(`Wystąpił błąd: ${err.message}`);
      });
  }, [router, setError, team]);

  return (
    <AuthFormLayout
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
          <DynamicDropdown
            label="Kapitan"
            name="new_captain"
            control={control}
            errorText={getFieldErrorText('new_captain', errors)}
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
          <CityDropdown
            control={control}
            errors={errors}
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
  );
}

export default TeamsIdEdit;
