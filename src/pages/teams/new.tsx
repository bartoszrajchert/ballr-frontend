import Dropdown from '@/components/Dropdown';
import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { Pagination } from '@/models/base.model';
import { createTeam, CreateTeamPayload } from '@/repository/team.repository';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function TeamsNew() {
  const router = useRouter();
  const { data: cities } = useSWR<Pagination<City>>(BACKEND_ROUTES.CITIES);

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
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
          <Dropdown
            label="Miasto"
            name="city_id"
            control={control}
            errorText={getFieldErrorText('city_id', errors)}
            rules={{ required: true }}
            data={
              (cities &&
                cities.items.map((city) => ({
                  label: city.name,
                  value: city.id.toString(),
                }))) ||
              []
            }
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
