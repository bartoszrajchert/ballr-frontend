import Spinner from '@/components/Spinner';
import TextField from '@/components/TextField';
import { DynamicCheckbox } from '@/components/dynamic/DynamicCheckbox';
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
import { GetMatchResponse, UpdateMatchPayload } from '@/models/match.model';
import { deleteMatch, updateMatch } from '@/repository/match.repository';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

const MatchesIdEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: match,
    error,
    isLoading,
  } = useSWR<GetMatchResponse>(`${BACKEND_ROUTES.MATCHES}/${id}`, {
    revalidateOnFocus: false,
  });

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

  const deleteMatchSubmit = useCallback(() => {
    if (!match) return;

    deleteMatch(match?.id)
      .then(async () => {
        toast.success('Pomyślnie usunięto mecz!');
        await router.push(ROUTES.MATCHES);
      })
      .catch((err) => {
        toast.error(`Nie udało się usunąć meczu: ${err}`);
      });
  }, [match, router]);

  if (!match && isLoading && !error) {
    return <Spinner />;
  }

  if (error && !is404(error)) {
    return <ErrorMessage error={error.message} />;
  }

  if (!match || is404(error)) {
    return <NoResultsMessage message="Nie udało się znaleźć użytkownika." />;
  }

  return (
    <AuthFormLayout
      title="Edytuj mecz"
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
            {...register('num_of_players', {
              required: !watch('for_team_only'),
            })}
          />
          <DynamicCheckbox
            label="Tylko dla drużyn"
            name="for_team_only"
            control={control}
          />
          <DynamicCheckbox
            label="Otwarte dla sędziego"
            name="open_for_referee"
            control={control}
          />
        </>
      }
      buttonValue="Zapisz"
      buttonOnClick={() => resetKeepValues(reset)}
      cancelButtonValue="Usuń mecz"
      cancelButtonOnClick={deleteMatchSubmit}
      confirmDialog={{
        title: 'Czy na pewno chcesz usunąć mecz?',
        description: 'Ta operacja jest nieodwracalna.',
        confirmValue: 'Usuń mecz',
      }}
      errorMessage={
        getFieldErrorText('root', errors) &&
        `Formularz zawiera błędy: ${getFieldErrorText('root', errors)}`
      }
      centered={false}
    />
  );
};

export default MatchesIdEdit;
