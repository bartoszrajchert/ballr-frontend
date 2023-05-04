import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import useGetAuth from '@/lib/useGetAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

function RecoverPassword() {
  const auth = useGetAuth();
  const [email, setEmail] = useState('');
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const router = useRouter();

  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
  };

  return (
    <AuthFormLayout
      header="Przywróć hasło"
      subheader={
        <>Po wysłaniu formularza otrzymasz email z linkiem do zmiany hasła.</>
      }
      onSubmit={async (event) => {
        event.preventDefault();
        const success = await sendPasswordResetEmail(email, actionCodeSettings);
        if (success) {
          // TODO: add toast notification later
          await router.push('/login');
        }
      }}
      inputChildren={
        <>
          <TextField
            label="Podaj swój adres email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </>
      }
      buttonValue="Wyślij email ze zmianą hasła"
      footerChildren={
        <>
          Przypomniałeś sobie hasło?{' '}
          <Link className="link --underline" href="/login">
            Zaloguj się
          </Link>
        </>
      }
      infoChildren={
        <>
          {error && <p className="error">{error.message}</p>}
          {sending && <p className="error">Sending...</p>}
        </>
      }
    />
  );
}

export default RecoverPassword;
