import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import { getFieldErrorText } from '@/lib/helpers';
import { BACKEND_ROUTES } from '@/lib/routes';
import { useRouter } from 'next/router';
import React from 'react';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import useSWR from 'swr';

// TODO Give access to this page only to players who are in the match
// TODO Add spinner when loading
export default function MatchesIdRate() {
  const router = useRouter();
  const { id } = router.query;
  const { data: match, isLoading } = useSWR<Match>(
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
                <ScoreForm />
              ) : (
                <UserForm users={match?.users} />
              )}
            </section>
          </>
        )}
      </>
    </MainLayout>
  );
}

function ScoreForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data: any) => {
    // TODO: send data to backend
    console.log(data);
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

function UserForm(props: { users?: UserMatch[] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data: any) => {
    // TODO: send data to backend
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {props.users?.map((user) => (
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
        <Avatar firstName={props.firstName} lastName={props.lastName} />
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
