import '@/styles/globals.css';
import '@/i18n/config';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/lib/firebase';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
