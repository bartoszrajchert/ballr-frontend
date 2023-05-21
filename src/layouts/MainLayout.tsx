import clsx from 'clsx';
import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
  footerMargin?: boolean;
};

function MainLayout({ footerMargin = true, ...props }: Props) {
  return (
    <main className={clsx({ 'mb-14': footerMargin })}>{props.children}</main>
  );
}

export default MainLayout;
