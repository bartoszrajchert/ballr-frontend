import { useSignOut } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useGetAuth from '@/lib/useGetAuth';

export default async function Logout() {
  const auth = useGetAuth();
  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter();

  useEffect(() => {
    signOut().then(() => {
      router.push('/');
    });
  }, []);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  return <p>Logout...</p>;
}
