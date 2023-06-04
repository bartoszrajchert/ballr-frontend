import { Router } from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';

function NProgressProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    Router.events.on('routeChangeStart', () => {
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
      NProgress.done(false);
    });

    Router.events.on('routeChangeError', () => {
      NProgress.done(false);
    });
  }, []);

  return <>{children}</>;
}

export default NProgressProvider;
