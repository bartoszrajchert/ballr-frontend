import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import useGetAuth from '@/lib/useGetAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormData = {
  email: string;
};

function ForgotPassword() {
  const auth = useGetAuth();
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    const success = await sendPasswordResetEmail(
      data.email,
      actionCodeSettings
    );
    if (success) {
      toast.info('Wysłano email z linkiem do zmiany hasła');
      const redirect = (router.query.redirect as string) ?? '';
      await router.push(`/${redirect}`);
    }
  };

  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
  };

  return (
    <AuthFormLayout
      header="Przywróć hasło"
      subheader={
        <>Po wysłaniu formularza otrzymasz email z linkiem do zmiany hasła.</>
      }
      onSubmit={handleSubmit(onSubmit)}
      inputChildren={
        <>
          <TextField
            label="Podaj swój adres email"
            type="email"
            errorText={errors.email && 'Email jest wymagany'}
            {...register('email', { required: true })}
          />
        </>
      }
      buttonValue="Wyślij email ze zmianą hasła"
      buttonDisabled={sending}
      footerChildren={
        <>
          Przypomniałeś sobie hasło?{' '}
          <Link
            className="link --underline"
            href={{
              pathname: '/login',
              query: { redirect: router.query.redirect },
            }}
          >
            Zaloguj się
          </Link>
        </>
      }
      errorMessage={error?.message}
    />
  );
}

export default ForgotPassword;
