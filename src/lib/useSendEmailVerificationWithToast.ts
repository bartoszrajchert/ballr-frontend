import { Auth } from 'firebase/auth';
import { useEffect } from 'react';
import { useSendEmailVerification } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

export default function useSendEmailVerificationWithToast(auth: Auth) {
  const [sendEmailVerification, , errorEmailVerification] =
    useSendEmailVerification(auth);

  useEffect(() => {
    if (errorEmailVerification) {
      console.error(errorEmailVerification);
      toast.error(
        `Nie udało się wysłać emaila weryfikacyjnego ${errorEmailVerification?.message}`
      );
    }
  }, [errorEmailVerification]);

  return () =>
    sendEmailVerification().then((done) => {
      if (done) toast.info('Wysłano email weryfikacyjny');
    });
}
