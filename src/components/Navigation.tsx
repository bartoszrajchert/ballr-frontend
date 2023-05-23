import Button from '@/components/Button';
import useGetAuth from '@/lib/useGetAuth';
import { IconMenu2, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import logo from '../../public/logo.svg';

type Props = {
  focusMode?: boolean;
};

function Navigation({ focusMode }: Props) {
  const auth = useGetAuth();
  const [user, authLoading, authError] = useAuthState(auth);
  const [signOut, _, errorSignOut] = useSignOut(auth);
  // TODO: check - is from our website
  const router = useRouter();

  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  useEffect(() => {
    if (authError) {
      toast.error(`Wystąpił błąd: ${authError.message}`);
    }
    if (errorSignOut) {
      toast.error(`Wystąpił błąd: ${errorSignOut.message}`);
    }
  }, [authError, errorSignOut]);

  useEffect(() => {
    const closeHamburgerMenu = () => setIsHamburgerMenuOpen(false);

    router.events.on('routeChangeComplete', closeHamburgerMenu);

    return () => {
      router.events.off('routeChangeComplete', closeHamburgerMenu);
    };
  }, [router.events]);

  const signOutHandler = async () => {
    await signOut();
    await router.push('/');
    toast.success('Wylogowano pomyślnie');
  };

  const isActive = (href: string) => router.pathname === href;

  const mainLinks = (
    <>
      <li>
        <Link
          className={clsx('link', {
            'before:bg-green-900': isActive('/'),
          })}
          href="/"
        >
          Strona główna
        </Link>
      </li>
      <li>
        <Link
          className={clsx('link', {
            'before:bg-green-900': isActive('/activities'),
          })}
          href="/activities"
        >
          Zajęcia
        </Link>
      </li>
      <li>
        <Link
          className={clsx('link', {
            'before:bg-green-900': isActive('/add-facility'),
          })}
          href="/"
        >
          Dodaj obiekt
        </Link>
      </li>
      {/* TODO: Only for test purposes. Delete it */}
      <li>
        <Link className="link" href="/protected-page">
          Protected Page
        </Link>
      </li>
      {/* TODO: Only for test purposes. Delete it */}
      <li>
        <Link className="link" href="/requests-test-page">
          Request test page
        </Link>
      </li>
    </>
  );

  const userLinks = (
    <>
      {!authLoading && !user && (
        <>
          <li>
            <Link className="link" href="/login">
              Zaloguj się
            </Link>
          </li>
          <li>
            <Link href="/register">
              <Button value="Rejestracja" type="primary" />
            </Link>
          </li>
        </>
      )}

      {!authLoading && user && (
        <>
          <li>
            <Link
              className={clsx('link', {
                'before:bg-green-900': isActive('/settings'),
              })}
              href="/settings"
            >
              Profil
            </Link>
          </li>
          <li>
            <a className="link" onClick={signOutHandler}>
              Wyloguj się
            </a>
          </li>
        </>
      )}
    </>
  );

  const menu = focusMode ? (
    <div className="hidden cursor-pointer lg:block">
      <Button
        icon={<IconX />}
        onClick={() => router.push('/')}
        type="tertiary"
      />
    </div>
  ) : (
    <div className="hidden lg:block">
      <ul className="flex items-center gap-6 text-green-900 ">
        {mainLinks}
        {authLoading && <p>Loading...</p>}
        {userLinks}
      </ul>
    </div>
  );

  const hamburgerMenu = (
    <div className="relative lg:hidden">
      <IconMenu2 onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)} />
      {isHamburgerMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-10 bg-white">
          <IconX
            className="fixed right-8 top-8"
            onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
          />
          <div className="centered">
            <ul className="flex flex-col items-center gap-6">
              {mainLinks}
              {authLoading && <p>Loading...</p>}
              {userLinks}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="flex w-full items-center justify-between py-4">
      <div className="flex h-[48px] items-center justify-center">
        <Link href="/">
          <Image src={logo} alt="logo" height={22} />
        </Link>
      </div>
      {hamburgerMenu}
      {menu}
    </nav>
  );
}

export default Navigation;
