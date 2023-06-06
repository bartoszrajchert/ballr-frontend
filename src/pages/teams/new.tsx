import TextField from '@/components/TextField';
import { DynamicDropdown } from '@/components/dynamic/DynamicDropdown';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { City } from '@/models/base.model';
import { createTeam, CreateTeamPayload } from '@/repository/team.repository';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function TeamsNew() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTeamPayload>();

  const onSubmit = (data: CreateTeamPayload) => {
    createTeam(data)
      .then(async (data) => {
        toast.success('Pomyślnie dodano drużynę!');
        await router.push(`${ROUTES.TEAMS}/${data.data.id}`);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <AuthFormLayout
      header="Stwórz nową drużynę"
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
            helperText="Maksymalnie 5 znaków"
            {...register('short_name', { required: true, maxLength: 5 })}
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
      buttonValue="Stwórz drużynę"
      buttonOnClick={() => resetKeepValues(reset)}
      errorMessage={
        getFieldErrorText('root', errors) &&
        `Formularz zawiera błędy: ${getFieldErrorText('root', errors)}`
      }
      centered={false}
    />
  );
}

export default TeamsNew;
