import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

type Props = {
  children: JSX.Element | JSX.Element[];
};

function MainLayout(props: Props) {
  return (
    <main>
      <Navigation />
      {props.children}
      <Footer />
    </main>
  );
}

export default MainLayout;
