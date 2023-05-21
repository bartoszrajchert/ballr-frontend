import FullWidthBackgroundColor from '@/components/FullWidthBackgroundColor';
import useGetAuth from '@/lib/useGetAuth';
import useSendEmailVerificationWithToast from '@/lib/useSendEmailVerificationWithToast';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

export default function VerifyEmailBanner() {
  const auth = useGetAuth();
  const [user, loading, error] = useIdToken(auth);
  const router = useRouter();
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);
  const sendEmailVerificationWithToast =
    useSendEmailVerificationWithToast(auth);

  useEffect(() => {
    if (error) {
      console.error(error);
      toast.error('Wystąpił błąd podczas weryfikacji użytkownika');
    }
  }, [error]);

  useEffect(() => {
    setIsEmailNotVerified(Boolean(!loading && user && !user?.emailVerified));
  }, [loading, user, user?.emailVerified]);

  useEffect(() => {
    const listenForEmailVerification = async () => {
      await user?.reload();
    };

    if (isEmailNotVerified) {
      router.events.on('routeChangeStart', listenForEmailVerification);
    }

    return () => {
      router.events.off('routeChangeStart', listenForEmailVerification);
    };
  }, [isEmailNotVerified, router.events, user]);

  return (
    <>
      {isEmailNotVerified && (
        <div className="relative flex h-[48px] w-full items-center justify-center text-center text-white">
          <p
            className="link --underline before:!bg-white"
            onClick={sendEmailVerificationWithToast}
          >
            Kliknij tutaj aby zweryfikować swój email.
          </p>
          <FullWidthBackgroundColor color="bg-red" />
        </div>
      )}
    </>
  );
}
