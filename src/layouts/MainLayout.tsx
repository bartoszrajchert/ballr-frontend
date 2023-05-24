import clsx from 'clsx';
import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
  footerMargin?: boolean;
};

function MainLayout({ footerMargin = true, ...props }: Props) {
  return (
    <div className={clsx({ 'mb-14': footerMargin })}>{props.children}</div>
  );
}

export default MainLayout;
