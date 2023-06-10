import Button from '@/components/Button';
import { ROUTES } from '@/lib/routes';
import { UserContext } from '@/providers/UserProvider';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

export function withCreatedProfile(Component: any) {
  return function WithCreatedProfile(props: any) {
    const { error } = useContext(UserContext);
    const [timout, setTimout] = useState<boolean>(false);
    const router = useRouter();

    const is404 = useMemo(
      () => error && error.response && error.response.status === 404,
      [error]
    );

    useEffect(() => {
      if (is404 && !timout && router.pathname !== ROUTES.CREATE_PROFILE) {
        setTimeout(() => {
          setTimout(true);
        }, 5000);
      }
    }, [error, is404, router.pathname, timout]);

    if (is404 && !timout && router.pathname !== ROUTES.CREATE_PROFILE) {
      return (
        <div className="mt-14 flex w-full flex-col items-center justify-center gap-4">
          <p className="text-grey-700">Przekierowanie...</p>
        </div>
      );
    }

    if (is404 && router.pathname !== ROUTES.CREATE_PROFILE && timout) {
      return (
        <div className="mt-14 flex w-full flex-col items-center justify-center gap-4">
          <div className="space-y-1 text-center">
            <h3 className="text-heading-h3">
              Prosimy o uzupełnienie danych o profilu.
            </h3>
            <p>
              Bez tego nie będziesz mógł korzystać z funkcjonalności aplikacji.
            </p>
          </div>
          <Link href={ROUTES.CREATE_PROFILE}>
            <Button value="Uzupełnij profil" />
          </Link>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
