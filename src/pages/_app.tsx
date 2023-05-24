import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';
import '@/i18n/config';
import initAxios from '@/lib/axios';
import '@/lib/firebase';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const focusModePaths = ['/login', '/register', '/forgot-password'];

initAxios();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const focusMode = focusModePaths.includes(router.pathname);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${font.variable} font-sans`}>
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
      </div>
    </>
  );
}
