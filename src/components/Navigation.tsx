import Button from '@/components/Button';
import useGetAuth from '@/lib/useGetAuth';
import { IconMenu2, IconX } from '@tabler/icons-react';
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

  const [width, setWidth] = useState(0);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    // component is mounted and window is available
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // @ts-ignore
  const isHamburger = fullConfig.theme.screens.sm <= width + 'px';

  const menu = focusMode ? (
    <div>
      <IconX onClick={() => router.push('/')} />
    </div>
  ) : (
    <div>
      <ul className="flex items-center gap-6 text-green-900 ">
        <li>
          <Link className="link" href="/">
            Strona główna
          </Link>
        </li>
        <li>
          <Link className="link" href="/">
            Zajęcia
          </Link>
        </li>
        <li>
          <Link className="link" href="/">
            Dodaj obiekt
          </Link>
        </li>

        {loading && <p>Loading...</p>}

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
          <li>
            <a className="link" onClick={signOut}>
              Wyloguj się
            </a>
          </li>
        )}
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
            <ul className="flex flex-col gap-4">
              <li>
                <Link className="link" href="/">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link className="link" href="/">
                  Zajęcia
                </Link>
              </li>
              <li>
                <Link className="link" href="/">
                  Dodaj obiekt
                </Link>
              </li>

              {loading && <p>Loading...</p>}

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
                <li>
                  <a className="link" onClick={signOut}>
                    Wyloguj się
                  </a>
                </li>
              )}
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
