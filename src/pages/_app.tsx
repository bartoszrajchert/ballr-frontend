import AxiosAuthInterceptor from '@/components/AxiosAuthInterceptor';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';
import '@/i18n/config';
import initAxios from '@/lib/axios';
import { globalFetcher } from '@/lib/fetchers';
import '@/lib/firebase';
import { ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import UserProvider from '@/providers/UserProvider';
import '@/styles/globals.css';
import '@/styles/page-loader.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SWRConfig } from 'swr';

const focusModePaths = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.CREATE_PROFILE,
];

initAxios();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const focusMode = focusModePaths.includes(router.pathname as ROUTES);

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

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserProvider>
        <AxiosAuthInterceptor>
          <SWRConfig
            value={{
              fetcher: globalFetcher,
              revalidateOnFocus: false,
            }}
          >
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
          </SWRConfig>
        </AxiosAuthInterceptor>
      </UserProvider>
    </>
  );
}
