import SkeletonNavigation from '@/components/skeletons/SkeletonNavigation';
import initAxios from '@/lib/axios';
import { globalFetcher } from '@/lib/fetchers';
import '@/lib/firebase';
import { ROUTES } from '@/lib/routes';
import '@/styles/globals.css';
import '@/styles/page-loader.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SWRConfig } from 'swr';

initAxios();

const focusModePaths = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.CREATE_PROFILE,
];

const Navigation = dynamic(() => import('@/components/Navigation'), {
  loading: () => <SkeletonNavigation />,
});
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <Skeleton height={140} />,
});
const UserProvider = dynamic(() => import('@/providers/UserProvider'));
const AxiosAuthInterceptor = dynamic(
  () => import('@/components/AxiosAuthInterceptor')
);
const NProgressProvider = dynamic(
  () => import('@/providers/NProgressProvider')
);

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const focusMode = focusModePaths.includes(router.pathname as ROUTES);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NProgressProvider>
        <UserProvider>
          <AxiosAuthInterceptor>
            <SWRConfig
              value={{
                fetcher: globalFetcher,
              }}
            >
              <main>
                <div>
                  <Navigation focusMode={focusMode} />
                  <Component {...pageProps} />
                </div>
                {!focusMode && <Footer />}
              </main>
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
            </SWRConfig>
          </AxiosAuthInterceptor>
        </UserProvider>
      </NProgressProvider>
    </>
  );
}

export default App;
