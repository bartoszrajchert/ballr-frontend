import useGetAuth from '@/lib/useGetAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function withAuth(WrappedComponent: any) {
  const WithAuth = (props: {}) => {
    const router = useRouter();
    const auth = useGetAuth();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push('/login');
        }
      });

      return () => unsubscribe();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}
