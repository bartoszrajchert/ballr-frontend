import Checkbox from '@/components/Checkbox';
import Dropdown from '@/components/Dropdown';
import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  getLocaleDateString,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { ROUTES } from '@/lib/routes';
import { UserContext } from '@/providers/UserProvider';
import { createMatch, CreateMatchPayload } from '@/repository/match.repository';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function MatchesNew() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateMatchPayload>();

  const onSubmit = (data: CreateMatchPayload) => {
    createMatch(data)
      .then(async (data) => {
        toast.success('Pomyślnie dodano mecz!');
        await router.push(`${ROUTES.MATCHES}/${data.data.id}`);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <AuthFormLayout
      header="Stwórz nowy mecz"
      onSubmit={handleSubmit(onSubmit)}
      inputChildren={
        <>
          <TextField
            label="Opis"
            errorText={getFieldErrorText('description', errors)}
            {...register('description', { required: true })}
          />
          <TextField
            disabled={watch('for_team_only')}
            label="Ilość graczy"
            type="number"
            errorText={getFieldErrorText('num_of_players', errors)}
            {...register('num_of_players', { required: true })}
          />
          <Dropdown
            name="reservation_id"
            label="Identyfikator rezerwacji"
            control={control}
            data={
              // TODO: filter out reservations that are already taken
              user?.reservations.map((res) => {
                return {
                  label: `${res.reservation_id}. ${getLocaleDateString(
                    res.start_time,
                    true
                  )}`,
                  value: res.reservation_id.toString(),
                };
              }) ?? []
            }
          />
          <Checkbox
            label="Tylko dla drużyn"
            name="for_team_only"
            control={control}
          />
          <Checkbox
            label="Otwarte dla sędziego"
            name="open_for_referee"
            control={control}
          />
        </>
      }
      buttonValue="Zapisz"
      buttonOnClick={() => resetKeepValues(reset)}
      errorMessage={
        getFieldErrorText('root', errors) &&
        `Formularz zawiera błędy: ${getFieldErrorText('root', errors)}`
      }
      centered={false}
    />
  );
}

export default MatchesNew;
