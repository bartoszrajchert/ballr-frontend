import Footer from '@/components/Footer';
import FullWidthBackgroundColor from '@/components/FullWidthBackgroundColor';
import Navigation from '@/components/Navigation';
import useGetAuth from '@/lib/useGetAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  useAuthState,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';

type Props = {
  children: JSX.Element | JSX.Element[];
  focusMode?: boolean;
  footerMargin?: boolean;
};

function MainLayout(props: Props) {
  return (
    <main>
      <VerifyEmailBanner />
      <Navigation focusMode={props.focusMode} />
      {props.children}
      {!props.focusMode && <Footer margin={props.footerMargin} />}
    </main>
  );
}

function VerifyEmailBanner() {
  const auth = useGetAuth();
  const [user, loading, error] = useAuthState(auth);
  const [
    sendEmailVerification,
    sendingEmailVerification,
    errorEmailVerification,
  ] = useSendEmailVerification(auth);
  const router = useRouter();
  const isEmailNotVerified = !loading && user && !user?.emailVerified;

  // TODO: Optimize this, works after second route change
  useEffect(() => {
    const listenForEmailVerification = () => {
      user?.reload().then();
    };

    if (isEmailNotVerified) {
      router.events.on('routeChangeStart', listenForEmailVerification);
    }

    return () => {
      router.events.off('routeChangeStart', listenForEmailVerification);
    };
  }, [isEmailNotVerified]);

  return (
    <>
      {isEmailNotVerified && (
        <div className="relative flex h-[48px] w-full items-center justify-center text-center text-white">
          <p
            className="link --underline before:!bg-white"
            onClick={sendEmailVerification}
          >
            Kliknij tutaj aby zweryfikować swój email.
          </p>
          <FullWidthBackgroundColor color="bg-red" />
        </div>
      )}
    </>
  );
}

export default MainLayout;
