import React, { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import useGetAuth from '@/lib/useGetAuth';

function Navigation() {
  const auth = useGetAuth();
  const [user, loading, error] = useAuthState(auth);
  const [signOut, loadingSignOut, errorSignOut] = useSignOut(auth);

  const itemLinkStyle =
    'relative flex h-full items-center justify-center cursor-pointer';
  const beforeStyle =
    'before:absolute before:bottom-0 before:left-0 before:right-0 before:block before:h-0.5 before:translate-y-1 before:bg-transparent before:transition-all hover:before:translate-y-0 hover:before:bg-green-900';

  useEffect(() => {
    console.log('user', user);
  }, []);

  return (
    <nav className="flex w-full items-center justify-between">
      <div>
        <p>Logo</p>
      </div>
      <div>
        <ul className="flex items-center space-x-6 font-bold text-green-900 ">
          <li className={itemLinkStyle}>
            <Link className={beforeStyle} href="/">
              Strona główna
            </Link>
          </li>
          <li className={itemLinkStyle}>
            <Link className={beforeStyle} href="/">
              Zajęcia
            </Link>
          </li>
          <li className={itemLinkStyle}>
            <Link className={beforeStyle} href="/">
              Dodaj obiekt
            </Link>
          </li>

          {loading && <p>Loading...</p>}

          {!loading && !user && (
            <>
              <li className={itemLinkStyle}>
                <Link className={beforeStyle} href="/login">
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
            <li className={itemLinkStyle}>
              <a className={beforeStyle} onClick={signOut}>
                Wyloguj się
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
