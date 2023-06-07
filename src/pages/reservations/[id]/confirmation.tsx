import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import MainLayout from '@/layouts/MainLayout';
import { ROUTES } from '@/lib/routes';
import { acceptReservation } from '@/repository/reservation.repository';
import { IconCircleCheck } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reqDone) return;

    acceptReservation(id, token, accept === 'true')
      .then((res) => {})
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setReqDone(true);
      });
  }, [accept, id, reqDone, token]);

  if (!reqDone) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <ErrorMessage error={error} />
        <Button
          className="m-auto"
          value="Kliknij aby spróbować ponownie"
          onClick={() => {
            setReqDone(false);
            setError(null);
          }}
        />
      </div>
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
