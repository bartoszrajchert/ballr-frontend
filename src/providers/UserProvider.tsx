import { COOKIES } from '@/lib/cookies';
import { globalFetcher } from '@/lib/fetchers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import { GetUserResponse } from '@/models/user.model';
import { onIdTokenChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import React, { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

export const UserContext = React.createContext<{
  user: GetUserResponse | null;
  error: Error | null;
  firebaseUser: FirebaseUser | null | undefined;
  firebaseLoading: boolean;
  firebaseError: Error | undefined;
}>({
  user: null,
  error: null,
  firebaseUser: null,
  firebaseLoading: false,
  firebaseError: undefined,
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

function UserProvider(props: Props) {
  const auth = useGetAuth();
  const router = useRouter();
  const [firebaseUser, firebaseLoading, firebaseError] = useIdToken(auth);
  const [user, setUser] = useState<GetUserResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        nookies.set(undefined, COOKIES.TOKEN, await user.getIdToken(), {
          path: '/',
        });
      } else {
        nookies.set(undefined, COOKIES.TOKEN, '', { path: '/' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (firebaseUser) {
      globalFetcher(`${BACKEND_ROUTES.USERS}/${firebaseUser?.uid}`)
        .then((res: GetUserResponse) => {
          setUser(res);
          setError(null);
        })
        .catch(async (err) => {
          if (
            err.response &&
            err.response.status === 404 &&
            router.pathname !== ROUTES.CREATE_PROFILE
          ) {
            toast.info('Prosimy o uzupełnienie danych o profilu.');
            await router.push(ROUTES.CREATE_PROFILE);
          }

          setError(err);
        });
    } else {
      setUser(null);
      setError(null);
    }
  }, [firebaseUser, router]);

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        firebaseUser,
        firebaseLoading,
        firebaseError,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default UserProvider;
