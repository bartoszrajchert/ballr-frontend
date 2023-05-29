import BigButton from '@/components/BigButton';
import Header from '@/components/Header';
import Section from '@/components/Section';
import MainLayout from '@/layouts/MainLayout';
import { ROUTES } from '@/lib/routes';
import { withAuth } from '@/lib/withAuth';
import { useRouter } from 'next/router';
import React from 'react';

const Settings = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <Header value="Ustawienia" />
      <Section title="Zajęcia" subtitle="Twoje zajęcia" className="mb-14">
        <div className="flex flex-wrap gap-5">
          <BigButton
            title="Zapisy"
            className="w-full md:w-fit"
            description="Przeglądaj dotychczasowe oraz przyszłe zajęcia"
            onClick={() => console.log('test')}
          />
          <BigButton
            title="Moje zajęcia"
            className="w-full md:w-fit"
            description="Przeglądaj swoje zajęcia"
            onClick={() => console.log('test')}
          />
        </div>
      </Section>
      <Section title="Twój profil" subtitle="Zmień ustawienia profilu">
        <div className="flex flex-wrap gap-5">
          <BigButton
            title="Dane osobowe"
            className="w-full md:w-fit"
            description="Dodawaj i zmieniaj dane osobowe, pakiety benefitowe"
            onClick={() => console.log('test')}
          />
          <BigButton
            title="Bezpieczeństwo"
            className="w-full md:w-fit"
            description="Ustawienia hasła i prywatności"
            onClick={() => router.push(ROUTES.SETTINGS_SECURITY)}
          />
        </div>
      </Section>
    </MainLayout>
  );
};

export default withAuth(Settings);
