import MainLayout from '@/layouts/MainLayout';
import useGetAuth from '@/lib/useGetAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * This is a HOC that will redirect to /login if the user is not logged in.
 */
export function withAuth(WrappedComponent: any) {
  const WithAuth = (props: {}) => {
    const router = useRouter();
    const auth = useGetAuth();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push('/login');
        }
      });

      return () => unsubscribe();
    }, []);

    if (error)
      return (
        <MainLayout>
          <p>Error: {JSON.stringify(error)}</p>
        </MainLayout>
      );

    return user ? (
      <WrappedComponent {...props} />
    ) : (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    );
  };

  WithAuth.displayName = `withAuth`;

  return WithAuth;
}
