import Avatar from '@/components/Avatar';
import Header from '@/components/Header';
import TextInformation from '@/components/TextInformation';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';

export default function ProfileId() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout>
      <Header>
        <div className="flex items-center justify-center gap-4">
          <Avatar firstName="Jan" lastName="Kowalski" size={59} />
          <h1 className="text-heading-h2">Jan Kowalski</h1>
        </div>
      </Header>
      <section>
        <h2 className="mb-7 text-heading-h3">Informacje</h2>
        <div className="flex w-full gap-5">
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
