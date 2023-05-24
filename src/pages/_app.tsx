import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';
import '@/i18n/config';
import initAxios from '@/lib/axios';
import '@/lib/firebase';
import useGetAuth from '@/lib/useGetAuth';
import '@/styles/globals.css';
import '@/styles/page-loader.css';
import { onIdTokenChanged } from '@firebase/auth';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import nookies from 'nookies';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const focusModePaths = ['/login', '/register', '/forgot-password'];

initAxios();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const focusMode = focusModePaths.includes(router.pathname);
  const auth = useGetAuth();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        nookies.set(undefined, 'token', await user.getIdToken(), { path: '/' });
      } else {
        nookies.set(undefined, 'token', '', { path: '/' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    Router.events.on('routeChangeStart', () => {
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
      NProgress.done(false);
    });

    return () => {};
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <VerifyEmailBanner />
        <Navigation focusMode={focusMode} />
        <Component {...pageProps} />
        {!focusMode && <Footer />}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </>
  );
}
