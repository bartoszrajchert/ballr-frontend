import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
  focusMode?: boolean;
};

function MainLayout(props: Props) {
  return (
    <main>
      <Navigation focusMode={props.focusMode} />
      {props.children}
      {!props.focusMode && <Footer />}
    </main>
  );
}

export default MainLayout;
