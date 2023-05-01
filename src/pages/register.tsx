import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import useGetAuth from '@/lib/useGetAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useGetAuth();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  return (
    <MainLayout>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createUserWithEmailAndPassword(email, password).then((res) => {
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
        <button type="submit">Register</button>
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
