import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import useGetAuth from '@/lib/useGetAuth';
import useSendEmailVerificationWithToast from '@/lib/useSendEmailVerificationWithToast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const auth = useGetAuth();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const sendEmailVerificationWithToast =
    useSendEmailVerificationWithToast(auth);

  return (
    <AuthFormLayout
      header="Stwórz konto Ballerze"
      subheader={
        <>
          Masz już konto?{' '}
          <Link className="link --underline" href="/login">
            Zaloguj się
          </Link>
        </>
      }
      onSubmit={(event) => {
        event.preventDefault();

        // TODO: Handle it in a better way
        if (password !== repeatPassword)
          return alert('Hasła nie są takie same');

        createUserWithEmailAndPassword(email, password).then(async (res) => {
          if (res?.user) {
            await router.push('/');
            toast.info('Konto zostało utworzone');
            await sendEmailVerificationWithToast();
          }
        });
      }}
      inputChildren={
        <>
          <TextField
            label="Podaj swój adres email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Podaj swoje hasło"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            label="Powtórz swoje hasło"
            type="password"
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
          />
        </>
      }
      buttonValue="Zarejestruj się"
      footerChildren={
        <>
          Rejestrując się akceptujesz nasz{' '}
          <Link className="link --underline" href="/">
            Regulamin
          </Link>{' '}
          oraz{' '}
          <Link className="link --underline" href="/">
            Politykę prywatności
          </Link>
        </>
      }
      infoChildren={
        <>
          {error && <p className="error">{error.message}</p>}
          {user && <p className="error">User {user.user.uid} is logged in</p>}
          {loading && <p className="error">Loading...</p>}
        </>
      }
    />
  );
}
