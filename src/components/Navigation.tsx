import Button from '@/components/Button';
import useGetAuth from '@/lib/useGetAuth';
import { IconMenu2, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import resolveConfig from 'tailwindcss/resolveConfig';
import logo from '../../public/logo.svg';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

type Props = {
  focusMode?: boolean;
};

function Navigation({ focusMode }: Props) {
  const auth = useGetAuth();
  const [user, loading, error] = useAuthState(auth);
  const [signOut, loadingSignOut, errorSignOut] = useSignOut(auth);
  // TODO: check - is from our website
  const router = useRouter();

  const calculateIsHamburger = () => {
    if (typeof window === 'undefined') return null;

    // @ts-ignore
    return Number(fullConfig.theme.screens.md.slice(0, -2)) > window.innerWidth;
  };

  const [isHamburger, setIsHamburger] = useState<boolean | null>(
    calculateIsHamburger()
  );
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  const handleWindowResize = () => {
    setIsHamburger(calculateIsHamburger());
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

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
        <Link className="link" href="/protectedPage">
          Protected Page
        </Link>
      </li>
    </>
  );

  const userLinks = (
    <>
      {!loading && !user && (
        <>
          <li>
            <Link className="link" href="/login">
              Zaloguj się
            </Link>
          </li>
          <li>
            <Link href="/register">
              <Button
                value="Rejestracja"
                type="primary"
                onClick={() => console.log('test')}
              />
            </Link>
          </li>
        </>
      )}

      {!loading && user && (
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
            <a className="link" onClick={signOut}>
              Wyloguj się
            </a>
          </li>
        </>
      )}
    </>
  );

  const menu = focusMode ? (
    <div className="cursor-pointer">
      <IconX onClick={() => router.push('/')} />
    </div>
  ) : (
    <div>
      <ul className="flex items-center gap-6 text-green-900 ">
        {mainLinks}
        {loading && <p>Loading...</p>}
        {userLinks}
      </ul>
    </div>
  );

  const hamburgerMenu = (
    <div className="relative">
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
              {loading && <p>Loading...</p>}
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
      {isHamburger ? hamburgerMenu : menu}
    </nav>
  );
}

export default Navigation;
