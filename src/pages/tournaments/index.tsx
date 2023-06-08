import Button from '@/components/Button';
import MainLayout from '@/layouts/MainLayout';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';

export default function Tournaments() {
  return (
    <MainLayout title="Potwierdzenie rezerwacji">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-grey-100 p-4 text-gray-500">
          <h3 className="text-center text-heading-h5 sm:text-heading-h3">
            Turnieje są w trakcie tworzenia! Zapraszamy wkrótce!
          </h3>
        </div>
        <Link href={ROUTES.HOME}>
          <Button value="Powrót na stronę główną" />
        </Link>
      </div>
    </MainLayout>
  );
}
