import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import MainLayout from '@/layouts/MainLayout';
import { ROUTES } from '@/lib/routes';
import { acceptReservation } from '@/repository/reservation.repository';
import { IconCircleCheck } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

enum Errors400 {
  TOKEN_NOT_VALID = 'Confirmation token is not valid',
  ALREADY_CONFIRMED = 'Reservation confirmation has already been recorded',
}

export default function ReservationConfirmation({
  accept,
  token,
  id,
}: {
  accept: string;
  token: string;
  id: string;
}) {
  const [reqDone, setReqDone] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const error400 = useMemo(() => {
    if (!error) return null;
    // @ts-ignore
    return error.response?.data?.detail;
  }, [error]);

  useEffect(() => {
    if (reqDone) return;

    acceptReservation(id, token, accept === 'true')
      .then((res) => {})
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setReqDone(true);
      });
  }, [accept, id, reqDone, token]);

  if (!reqDone) {
    return <Spinner />;
  }

  if (
    error &&
    error.response?.status === 400 &&
    Object.values(Errors400).includes(error400)
  ) {
    return (
      <MainLayout title="Potwierdzenie rezerwacji">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-grey-100 p-4 text-gray-500">
            <h3 className="text-center text-heading-h5 sm:text-heading-h3">
              {error400 === Errors400.ALREADY_CONFIRMED &&
                'Przepraszamy, już zanotowaliśmy Twoją odpowiedź.'}
              {error400 === Errors400.TOKEN_NOT_VALID &&
                'Token jest nieprawidłowy.'}
            </h3>
            <p>
              W razie problemów skontaktuj się z{' '}
              <a href="mailto:kontakt@ballr.pl" className="link --underline">
                kontakt@ballr.pl
              </a>
            </p>
          </div>
          <Link href={ROUTES.HOME}>
            <Button value="Powrót na stronę główną" />
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Potwierdzenie rezerwacji">
        <div className="space-y-3">
          <ErrorMessage error={error?.message} />
          <Button
            className="m-auto"
            value="Kliknij aby spróbować ponownie"
            onClick={() => {
              setReqDone(false);
              setError(null);
            }}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Potwierdzenie rezerwacji">
      <div className="mt-12 flex w-full flex-col items-center justify-center gap-4">
        <IconCircleCheck
          size={64}
          strokeWidth={1}
          className="mx-auto text-green-700"
        />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-heading-h2 text-green-700">
            {accept === 'true'
              ? 'Dziękujemy za potwierdzenie rezerwacji.'
              : 'Dziękujemy za odrzucenie rezerwacji.'}
          </h1>
          <p>
            Już nic więcej nie musisz robić. Serdecznie dziękujemy za
            korzystanie z naszego serwisu!
          </p>
        </div>
        <Link href={ROUTES.HOME}>
          <Button value="Powrót na stronę główną" />
        </Link>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { accept, token, id } = context.query;

  if (!id || !token || !accept) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      accept,
      token,
      id,
    },
  };
};
