import Checkbox from '@/components/Checkbox';
import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetMatchResponse } from '@/models/match.model';
import { UserContext } from '@/providers/UserProvider';
import { updateMatch, UpdateMatchPayload } from '@/repository/match.repository';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

const MatchesIdEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const { data: match } = useSWR<GetMatchResponse>(
    `${BACKEND_ROUTES.MATCHES}/${id}`
  );

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateMatchPayload>();

  useEffect(() => {
    reset({
      for_team_only: match?.for_team_only,
      description: match?.description,
      num_of_players: match?.num_of_players,
      open_for_referee: match?.open_for_referee,
    });
  }, [
    match?.description,
    match?.for_team_only,
    match?.num_of_players,
    match?.open_for_referee,
    reset,
  ]);

  const onSubmit = (data: UpdateMatchPayload) => {
    if (!match) return;

    if (data.for_team_only) {
      delete data.num_of_players;
    }

    updateMatch(match?.id, data)
      .then(async () => {
        await router.push(`${ROUTES.MATCHES}/${match?.id}`);
        toast.success('Pomyślnie zaktualizowano dane!');
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  // TODO: implement delete match
  const deleteMatch = useCallback(() => {
    if (!match) return;

    console.log('delete');
  }, [match]);

  return (
    <AuthFormLayout
      header="Edytuj mecz"
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
            errorText={getFieldErrorText('num_of_players', errors)}
            {...register('num_of_players', { required: true })}
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
      cancelButtonValue="Usuń mecz"
      cancelButtonOnClick={deleteMatch}
      errorMessage={
        getFieldErrorText('root', errors) &&
        `Formularz zawiera błędy: ${getFieldErrorText('root', errors)}`
      }
      centered={false}
    />
  );
};

export default MatchesIdEdit;
