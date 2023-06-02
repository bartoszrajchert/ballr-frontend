import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import { getFieldErrorText } from '@/lib/helpers';
import { ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import { useRouter } from 'next/router';
import React from 'react';
import { useUpdatePassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormData = { password: string; repeatPassword: string };

const Security = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const auth = useGetAuth();
  const [updatePassword, updating, error] = useUpdatePassword(auth);

  const onSubmit = (data: FormData) => {
    updatePassword(data.password).then(async (success) => {
      if (!success) return;

      toast.success('Hasło zostało zmienione');
      await router.push(ROUTES.SETTINGS);
    });
  };

  return (
    <AuthFormLayout
      header="Bezpieczeństwo"
      onSubmit={handleSubmit(onSubmit)}
      inputChildren={
        <>
          <TextField
            label="Podaj swoje hasło"
            type="password"
            errorText={getFieldErrorText('password', errors)}
            {...register('password', { required: true })}
          />
          <TextField
            label="Powtórz swoje hasło"
            type="password"
            errorText={getFieldErrorText('repeatPassword', errors)}
            {...register('repeatPassword', {
              required: true,
              validate: (value) => {
                const { password } = getValues();
                return password === value || 'repeatPassword';
              },
            })}
          />
        </>
      }
      buttonValue="Zapisz"
      errorMessage={error?.message}
      centered={false}
    />
  );
};

export default Security;
