import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import useGetAuth from '@/lib/useGetAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useGetAuth();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  return (
    <AuthFormLayout
      header="Zaloguj się Ballerze"
      subheader={
        <>
          Nie masz konta?{' '}
          <Link className="link --underline" href={'/register'}>
            Zarejestruj się
          </Link>
        </>
      }
      onSubmit={(event) => {
        event.preventDefault();
        signInWithEmailAndPassword(email, password).then((res) => {
          if (res?.user) router.push('/');
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
        </>
      }
      footerChildren={
        <>
          Problem z logowaniem?{' '}
          <Link className="link --underline" href="/recoverPassword">
            Przypomnij hasło
          </Link>{' '}
        </>
      }
      infoChildren={
        <>
          {error && <p className="error">{error.message}</p>}
          {user && <p className="error">User {user.user.uid} is logged in</p>}
          {loading && <p className="error">Loading...</p>}
        </>
      }
      buttonValue="Zaloguj się"
    />
  );
}
