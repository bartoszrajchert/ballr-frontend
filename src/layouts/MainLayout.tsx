import { pageTitle } from '@/lib/helpers';
import clsx from 'clsx';
import Head from 'next/head';
import React from 'react';

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[];
  footerMargin?: boolean;
};

function MainLayout({ footerMargin = true, ...props }: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle(props.title)}</title>
      </Head>
      <div className={clsx({ 'mb-14': footerMargin })}>{props.children}</div>
    </>
  );
}

export default MainLayout;
