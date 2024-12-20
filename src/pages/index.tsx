import Button from '@/components/Button';
import FullWidthBackgroundColor from '@/components/FullWidthBackgroundColor';
import { DynamicDropdown } from '@/components/dynamic/DynamicDropdown';
import MainLayout from '@/layouts/MainLayout';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import { City } from '@/models/base.model';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import medivocerSport from '../../public/medicover-sport.png';
import multisport from '../../public/multisport.png';
import footballImage1 from '../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

export default function Home() {
  const auth = useGetAuth();
  const [user] = useAuthState(auth);

  return (
    <MainLayout title="Strona główna" footerMargin={false}>
      <div className="mb-10 mt-12 space-y-5">
        <h1 className="m-auto max-w-[530px] text-center text-heading-title-desktop text-green-900">
          Weź udział w prawdziwej rozgrywce
        </h1>
        <p className="text-center">Zagraj najlepszy mecz swojego życia.</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-green-900 p-8 sm:h-[190px]">
        <p className="text-center text-heading-h4 text-white sm:text-left">
          Wyszukaj mecze po lokalizacji
        </p>
        <MatchForm />
      </div>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <p className="text-heading-h5">Honorujemy</p>
        <div className="flex items-center justify-center gap-4">
          <Image src={medivocerSport} alt="Medicover sport" />
          <Image src={multisport} alt="Multisport sport" />
        </div>
      </div>
      <section className="my-16 flex flex-col gap-10 sm:grid sm:grid-cols-2">
        <div className="flex flex-col justify-center gap-3 text-center sm:text-left">
          <h2 className="text-heading-h2">Czym jest Ballr?</h2>
          <p>
            Celem stworzenia aplikacji Ballr jest udostępnienie użytkownikom,
            zainteresowanym grą w piłkę nożną, możliwości łatwej i efektywnej
            organizacji meczów. Aplikacja celuje w grupy amatorskich miłośników
            tego sportu, którzy chcieliby z łatwością móc tworzyć grupy
            zawodników, umawiać terminy rozgrywek, wynajmować obiekty oraz
            tworzyć wydarzenia wraz ze społecznością.
          </p>
        </div>
        <div className="relative h-[350px]">
          <Image
            className="absolute right-0 top-0 aspect-video rounded-2xl bg-green-900 object-cover"
            src={footballImage1}
            fill={true}
            quality={20}
            alt=""
          />
        </div>
      </section>
      <section className="relative py-10">
        <div className="space-y-8">
          <div className="m-auto max-w-[465px] space-y-3 text-center">
            <h2 className="text-heading-h2">
              Stwórz drużynę marzeń i wygrywaj mecze
            </h2>
            <p>Rezerwuj i graj ze swoją drużyną za pomocą kilku kliknięć!</p>
          </div>
          <div className="flex justify-center">
            {user ? (
              <Link href={ROUTES.TEAMS_NEW}>
                <Button value="Stwórz drużynę" type="primary-dark" />
              </Link>
            ) : (
              <Link href={ROUTES.REGISTER}>
                <Button value="Zarejestruj się" type="primary-dark" />
              </Link>
            )}
          </div>
        </div>
        <FullWidthBackgroundColor color="bg-green-200" />
      </section>
    </MainLayout>
  );
}

const MatchForm = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await router.push(
      `${ROUTES.MATCHES}?${queryString.stringify(data, {
        skipEmptyString: true,
        skipNull: true,
      })}`
    );
  };

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 sm:w-fit sm:flex-row sm:rounded-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="min-w-[200px]">
        <DynamicDropdown
          placeholder="Wybierz miasto"
          name="city_id"
          control={control}
          dataType="pagination"
          apiURL={BACKEND_ROUTES.CITIES}
          mapper={({ name, id }: City) => ({
            label: name,
            value: id.toString(),
          })}
        />
      </div>
      <Button value="Szukaj" isSubmit />
    </form>
  );
};
