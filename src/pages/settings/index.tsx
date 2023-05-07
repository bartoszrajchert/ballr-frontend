import BigButton from '@/components/BigButton';
import Header from '@/components/Header';
import MainLayout from '@/layouts/MainLayout';
import { withAuth } from '@/lib/withAuth';
import { useRouter } from 'next/router';
import React from 'react';

const Settings = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <Header value="Ustawienia" />
      <div className="mb-14">
        <SectionDescription
          title="Zajęcia"
          description="Ustawienia związane z meczami, turniejami oraz płatnościami"
        />
        <div className="flex flex-wrap gap-5">
          <BigButton
            title="Zapisy"
            description="Przeglądaj dotychczasowe oraz przyszłe zajęcia"
            onClick={() => console.log('test')}
          />
          <BigButton
            title="Moje zajęcia"
            description="Przeglądaj swoje zajęcia"
            onClick={() => console.log('test')}
          />
        </div>
      </div>
      <div className="mb-14">
        <SectionDescription
          title="Twój profil"
          description="Zmień ustawienia profilu"
        />
        <div className="flex flex-wrap gap-5">
          <BigButton
            title="Dane osobowe"
            description="Dodawaj i zmieniaj dane osobowe, pakiety benefitowe"
            onClick={() => console.log('test')}
          />
          <BigButton
            title="Bezpieczeństwo"
            description="Ustawienia hasła i prywatności"
            onClick={() => router.push('/settings/security')}
          />
        </div>
      </div>
    </MainLayout>
  );
};

const SectionDescription = (props: { title: string; description: string }) => {
  return (
    <div className="mb-6 space-y-2">
      <h2 className="text-heading-h3">{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
};

export default withAuth(Settings);
