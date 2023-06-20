import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import TextField from '@/components/TextField';
import { DynamicCheckbox } from '@/components/dynamic/DynamicCheckbox';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import MainLayout from '@/layouts/MainLayout';
import {
  getErrorMessage,
  getFieldErrorText,
  is404,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetMatchResponse, PutRatePlayerType } from '@/models/match.model';
import { UserContext } from '@/providers/UserProvider';
import {
  putRatePlayers,
  updateMatchScore,
} from '@/repository/match.repository';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

/**
 * This page is used to rate players after the match.
 * It can be accessed by all players, however the server will check if the user is in the match.
 * @constructor
 */
export default function MatchesIdRate({ id }: any) {
  const {
    data: match,
    isLoading,
    error,
  } = useSWR<GetMatchResponse>(`${BACKEND_ROUTES.MATCHES}/${id}`);

  if (!match && isLoading && !error) {
    return <Spinner />;
  }

  if (error && !is404(error)) {
    return <ErrorMessage error={error?.message} />;
  }

  if (!match || is404(error)) {
    return <NoResultsMessage message="Nie znaleziono meczu." />;
  }

  return (
    <MainLayout title="Ocenianie zawodników/drużyny">
      <Header
        value={match.for_team_only ? 'Protokół meczu' : 'Formularz oceniania'}
      />
      <section className="m-auto max-w-[820px]">
        {match.for_team_only ? (
          <ScoreForm id={String(id)} />
        ) : (
          <UserForm id={String(id)} users={match.users} />
        )}
      </section>
    </MainLayout>
  );
}

function ScoreForm(props: { id: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    formState: { errors },
    watch,
    setError,
    setValue,
    control,
  } = useForm();

  const onSubmit = (data: any) => {
    const userGrades: PutRatePlayerType[] = [];
    Object.keys(data)?.forEach((key) => {
      const [name, userId] = key.split(' ');
      const userPayload = userGrades.find((user) => user.user_id === userId);

      if (name === 'is_mvp') {
        if (userPayload) {
          userPayload.is_mvp = data[key];
        } else {
          userGrades.push({
            user_id: userId,
            [name]: data[key] ?? false,
            rating: -1,
          });
        }
      }

      if (name === 'rating') {
        if (userPayload) {
          userPayload.rating = Number(data[key]);
        } else {
          userGrades.push({
            user_id: userId,
            [name]: Number(data[key]),
            is_mvp: false,
          });
        }
      }
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

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {props.users
          ?.filter((userMatch) => userMatch.user_id !== user.id)
          .map((user) => (
            <UserGrade
              key={user.user_id}
              userId={user.user_id.toString()}
              firstName={user.user_name}
              lastName={user.user_last_name}
              register={register}
              errors={errors}
              control={control}
              watch={watch}
              setValue={setValue}
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

function UserGrade(props: {
  userId: string;
  firstName: string;
  lastName: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}) {
  const [disabled, setDisabled] = useState(false);

  /**
   * Disable checkbox if user is not MVP and MVP is already selected.
   */
  useEffect(() => {
    props.watch((value, { name }) => {
      if (name && name.startsWith('is_mvp')) {
        if (!name.includes(props.userId) && value[name]) {
          setDisabled(true);
        }

        if (!name.includes(props.userId) && !value[name]) {
          setDisabled(false);
        }
      }
    });
  }, [props]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-grey-100 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <Avatar text={`${props.firstName} ${props.lastName}`} />
          <p className="text-label-medium">
            {props.firstName} {props.lastName}
          </p>
        </div>
        <DynamicCheckbox
          label="MVP"
          name={`is_mvp ${props.userId}`}
          control={props.control}
          disabled={disabled}
        />
      </div>
      <TextField
        placeholder="Ocena zawodnika"
        type="number"
        min={1}
        max={10}
        errorText={getFieldErrorText(`rating ${props.userId}`, props.errors)}
        {...props.register(`rating ${props.userId}`, {
          required: true,
          min: 1,
          max: 10,
        })}
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
