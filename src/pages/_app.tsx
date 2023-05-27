import AxiosAuthInterceptor from '@/components/AxiosAuthInterceptor';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';
import '@/i18n/config';
import initAxios from '@/lib/axios';
import { COOKIES } from '@/lib/cookies';
import '@/lib/firebase';
import { ROUTES } from '@/lib/routes';
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

const focusModePaths = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD];

initAxios();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const focusMode = focusModePaths.includes(router.pathname as ROUTES);
  const auth = useGetAuth();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        nookies.set(undefined, COOKIES.TOKEN, await user.getIdToken(), {
          path: '/',
        });
      } else {
        nookies.set(undefined, COOKIES.TOKEN, '', { path: '/' });
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
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AxiosAuthInterceptor>
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
      </AxiosAuthInterceptor>
    </>
  );
}
