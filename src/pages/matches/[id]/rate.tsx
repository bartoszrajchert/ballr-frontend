import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import {
  getErrorMessage,
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetMatchResponse } from '@/models/match.model';
import { UserContext } from '@/providers/UserProvider';
import {
  putRatePlayers,
  PutRatePlayerType,
  updateMatchScore,
} from '@/repository/match.repository';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

// TODO Give access to this page only to players who are in the match
// TODO Add spinner when loading

/**
 * This page is used to rate players after the match.
 * It can be accessed by all players, however the server will check if the user is in the match.
 * @constructor
 */
export default function MatchesIdRate({ id }: any) {
  const { data: match, isLoading } = useSWR<GetMatchResponse>(
    `${BACKEND_ROUTES.MATCHES}/${id}`
  );

  return (
    <MainLayout>
      <>
        {isLoading && <p>Ładownie...</p>}
        {!isLoading && (
          <>
            <Header
              value={
                match?.for_team_only ? 'Protokół meczu' : 'Formularz oceniania'
              }
            />
            <section className="m-auto max-w-[820px]">
              {match?.for_team_only ? (
                <ScoreForm id={String(id)} />
              ) : (
                <UserForm id={String(id)} users={match?.users} />
              )}
            </section>
          </>
        )}
      </>
    </MainLayout>
  );
}

function ScoreForm(props: { id: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data: any) => {
    updateMatchScore(props.id, data)
      .then(async () => {
        toast.success('Wynik został zaktualizowany');
        await router.push(`${ROUTES.MATCHES}/${props.id}`);
      })
      .catch((err) => {
        toast.error(
          'Wystąpił błąd podczas aktualizacji wyniku: ' + getErrorMessage(err)
        );
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-2xl bg-grey-100 p-4">
        <TextField
          label="Wynik Twojej drużyny"
          placeholder="Ile bramek strzeliliście?"
          helperText="Bądź fair :)"
          type="number"
          min={0}
          max={99}
          errorText={getFieldErrorText('score', errors)}
          {...register('score')}
        />
      </div>
      <div className="mt-4 flex w-full gap-1">
        <Button value="Prześlij formularz" isSubmit fullWidth />
      </div>
      <div>
        {getFieldErrorText('root', errors) && (
          <p className="text-red">
            Formularz zawiera błędy: {getFieldErrorText('root', errors)}
          </p>
        )}
      </div>
    </form>
  );
}

function UserForm(props: { id: string; users?: GetMatchResponse['users'] }) {
  const { user } = useContext(UserContext);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
    setError,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log('data', data);

    const userGrades: PutRatePlayerType[] = [];
    Object.keys(data).forEach((key) => {
      userGrades.push({
        user_id: Number(key),
        rating: Number(data[key]),
        is_mvp: false,
      });
    });

    putRatePlayers(props.id, userGrades)
      .then(async () => {
        toast.success('Oceny zostały zapisane');
        await router.push(`/matches/${props.id}`);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {props.users
          ?.filter((userMatch) => userMatch.user_id !== user?.id)
          .map((user) => (
            <UserGrade
              key={user.user_id}
              userId={user.user_id.toString()}
              firstName={user.user_name}
              lastName={user.user_last_name}
              register={register}
              errors={errors}
            />
          ))}
      </div>
      <div className="mt-4 flex w-full gap-1">
        <Button
          value="Prześlij formularz"
          isSubmit
          fullWidth
          onClick={() => resetKeepValues(reset)}
        />
      </div>
      <div>
        {getFieldErrorText('root', errors) && (
          <p className="text-red">
            Formularz zawiera błędy: {getFieldErrorText('root', errors)}
          </p>
        )}
      </div>
    </form>
  );
}

// TODO add mvp checkbox
function UserGrade(props: {
  userId: string;
  firstName: string;
  lastName: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-grey-100 p-6">
      <div className="flex items-center gap-4">
        <Avatar text={`${props.firstName} ${props.lastName}`} />
        <p className="text-label-medium">
          {props.firstName} {props.lastName}
        </p>
      </div>
      <TextField
        placeholder="Ocena zawodnika"
        type="number"
        min={1}
        max={10}
        errorText={getFieldErrorText(props.userId, props.errors)}
        {...props.register(props.userId, { required: true, min: 1, max: 10 })}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    },
  };
};
