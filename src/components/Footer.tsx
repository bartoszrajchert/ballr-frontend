import FullWidthBackgroundColor from '@/components/FullWidthBackgroundColor';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '../../public/logo.svg';

function Footer() {
  return (
    <footer className="relative">
      <div className="flex flex-col gap-10 py-8 sm:flex-row sm:justify-between">
        <div>
          <p className="pb-4 text-label-medium">Dla Ciebie</p>
          <ul className="space-y-3">
            <li>
              <Link className="link --underline" href={'/'}>
                Polityka prywatności
              </Link>
            </li>
            <li>
              <Link className="link --underline" href={'/'}>
                Regulamin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="pb-4 text-label-medium">Kontakt</p>
          <ul>
            <li>
              <a className="link --underline" href="mailto:kontakt@ballr.com">
                E-mail: kontakt@ballr.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="flex flex-col justify-between gap-4 py-8 sm:flex-row">
        <div>
          <Image src={logo} alt="logo" height={22} />
        </div>
        <p className="text-label-medium">© 2023 BALLR, All rights reserved</p>
      </div>
      <FullWidthBackgroundColor color="bg-grey-100" />
    </footer>
  );
}

export default Footer;
