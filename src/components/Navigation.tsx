import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

function Navigation() {
  const itemLinkStyle = 'relative flex h-full items-center justify-center';
  const beforeStyle =
    'before:absolute before:bottom-0 before:left-0 before:right-0 before:block before:h-0.5 before:translate-y-1 before:bg-transparent before:transition-all hover:before:translate-y-0 hover:before:bg-green-900';

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
          <li className={itemLinkStyle}>
            <Link className={beforeStyle} href="/">
              Zaloguj się
            </Link>
          </li>
          <li>
            <Link href="/">
              <Button
                value="Rejestracja"
                type="primary"
                onClick={() => console.log('test')}
              />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
