import MainLayout from '@/layouts/MainLayout';
import useGetAuth from '@/lib/useGetAuth';
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
    <MainLayout>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          signInWithEmailAndPassword(email, password).then((res) => {
            if (res?.user) router.push('/');
          });
        }}
      >
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <br />
      <hr />
      <br />
      <>
        {error && <p className="error">{error.message}</p>}
        {user && <p className="error">User {user.user.uid} is logged in</p>}
        {loading && <p className="error">Loading...</p>}
      </>
    </MainLayout>
  );
}
