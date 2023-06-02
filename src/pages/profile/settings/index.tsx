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
      <Section
        title="Zajęcia"
        subtitle="Ustawienia związane z meczami oraz rezerwacjami."
        className="mb-14"
      >
        <div className="flex flex-wrap gap-5">
          <BigButton
            title="Mecze"
            className="w-full md:w-fit"
            description="Przeglądaj dotychczasowe oraz przyszłe mecze"
            onClick={() => console.log('test')}
          />
          <BigButton
            title="Moje rezerwacje"
            className="w-full md:w-fit"
            description="Przeglądaj swoje rezerwacje"
            onClick={() => router.push(ROUTES.SETTINGS_RESERVATIONS)}
          />
        </div>
      </Section>
      <Section title="Twój profil" subtitle="Zmień ustawienia profilu">
        <div className="flex flex-wrap gap-5">
          <BigButton
            title="Dane osobowe"
            className="w-full md:w-fit"
            description="Dodawaj i zmieniaj dane osobowe"
            onClick={() => router.push(ROUTES.SETTINGS_EDIT)}
          />
          <BigButton
            title="Bezpieczeństwo"
            className="w-full md:w-fit"
            description="Ustawienia hasła"
            onClick={() => router.push(ROUTES.SETTINGS_SECURITY)}
          />
        </div>
      </Section>
    </MainLayout>
  );
};

export default withAuth(Settings);
