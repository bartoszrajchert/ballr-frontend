import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Header from '@/components/Header';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import useGetAuth from '@/lib/useGetAuth';
import { IconPencil } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ProfileId() {
  const router = useRouter();
  const auth = useGetAuth();
  const [user, authLoading] = useAuthState(auth);
  const { id } = router.query;

  return (
    <MainLayout>
      <Header>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Avatar firstName="Jan" lastName="Kowalski" size={60} />
          <h1 className="text-heading-h2">Jan Kowalski</h1>
          {id === user?.uid && !authLoading && (
            <Link href="/settings">
              <Button icon={<IconPencil />} type="tertiary" />
            </Link>
          )}
        </div>
      </Header>
      <section>
        <h2 className="mb-7 text-heading-h3">Informacje</h2>
        <div className="flex w-full flex-col gap-5 sm:flex-row">
          <TextInformation
            header="Data urodzenia"
            body="20 styczeń 1999"
            className="flex-grow"
          />
          <TextInformation
            header="Data urodzenia"
            body="20 styczeń 1999"
            className="flex-grow"
          />
          <TextInformation
            header="Data urodzenia"
            body="20 styczeń 1999"
            className="flex-grow"
          />
          <TextInformation
            header="Data urodzenia"
            body="20 styczeń 1999"
            className="flex-grow"
          />
        </div>
      </section>
    </MainLayout>
  );
}
