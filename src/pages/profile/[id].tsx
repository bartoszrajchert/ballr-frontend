import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Section from '@/components/Section';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import { ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import { IconPencil } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ProfileId() {
  const router = useRouter();
  const auth = useGetAuth();
  const [firebaseUser, authLoading] = useAuthState(auth);
  const { id } = router.query;

  return (
    <MainLayout>
      <Header>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Avatar firstName="Jan" lastName="Kowalski" size={60} />
          <div>
            <p>Użytkownik</p>
            <h1 className="text-heading-h2">Jan Kowalski</h1>
          </div>
          {id === firebaseUser?.uid && !authLoading && (
            <Link href={ROUTES.SETTINGS}>
              <Button icon={<IconPencil />} type="tertiary" />
            </Link>
          )}
        </div>
      </Header>
      <Section title="Informacje">
        <div className="flex w-full flex-col flex-wrap gap-5 sm:flex-row">
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
      </Section>
    </MainLayout>
  );
}
