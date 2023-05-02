import Button from '@/components/Button';
import FullWidthBackgroundColor from '@/components/FullWidthBackgroundColor';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import medivocerSport from '../../public/medicover-sport.png';
import multisport from '../../public/multisport.png';
import footballImage1 from '../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Ballr - Strona główna</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <MainLayout>
        <div className="mb-10 mt-12 space-y-5">
          <h1 className="m-auto max-w-[530px] text-center text-heading-title-desktop text-green-900">
            {t('home-page.title')}
          </h1>
          <p className="text-center">{t('home-page.subtitle')}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-green-900 p-8 sm:h-[190px]">
          <p className="text-center text-heading-h4 text-white sm:text-left">
            Wyszukaj zajęcia po lokalizacji
          </p>
          <div className="flex w-full flex-col gap-2 rounded-2xl bg-white px-8 py-4 sm:w-fit sm:flex-row sm:rounded-full">
            <TextField placeholder="Lokalizacja" />
            <Button value="Szukaj" onClick={() => console.log('Szukaj')} />
          </div>
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
              organizacji meczów. Aplikacja celuje w grupy amatorskich
              miłośników tego sportu, którzy chcieliby z łatwością móc tworzyć
              grupy zawodników, umawiać terminy rozgrywek, wynajmować obiekty
              oraz tworzyć wydarzenia wraz ze społecznością.
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
              <Button
                value="Zarejestruj się"
                type="primary-dark"
                onClick={() => console.log('Zarejestruj się')}
              />
            </div>
          </div>
          <FullWidthBackgroundColor color="bg-green-200" />
        </section>
      </MainLayout>
    </>
  );
}
