import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import React from 'react';

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
