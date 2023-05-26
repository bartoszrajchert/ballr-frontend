import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import { fetcher, fetcherBackend } from '@/lib/fetchers';
import { getAddressFromFacility, getLocaleDateString } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { SWRConfig } from 'swr';
import footballImage1 from '../../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

type Props = {
  fallback: any;
};

/**
 * Matches page.
 * Matches tiles are NOT generated on the server side due to possible long loading times.
 * Instead, they are generated on the client side.
 *
 * @param fallback
 * @constructor
 */
function Matches({ fallback }: Props) {
  return (
    <SWRConfig value={{ fallback }}>
      <MainLayout>
        <Header value="Mecze" />
        <div className="flex flex-col gap-5 lg:flex-row">
          <aside>
            <p className="mb-8 text-heading-h3">Filtry</p>
            <Form />
          </aside>
          <div className="flex w-full flex-col gap-4">
            <MatchesContainer />
          </div>
        </div>
      </MainLayout>
    </SWRConfig>
  );
}

function MatchesContainer() {
  const router = useRouter();
  const { data: matches, isLoading } = useSWR<MatchesData[]>(
    `${ROUTES.MATCHES}?${queryString.stringify(router.query, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <>
      {matches?.map((match) => (
        <MatchTile key={match.match.id} {...match} />
      ))}

      {isLoading && <p>Ładowanie...</p>}
      {!isLoading && (!matches || matches.length <= 0) && <p>Brak meczy</p>}
    </>
  );
}

function Form() {
  const router = useRouter();
  const { register, handleSubmit, control, reset } = useForm();
  const onSubmit = (data: any) =>
    router.push({ query: data }, undefined, {
      shallow: true,
    });
  const rowInputClass = 'flex flex-col gap-2 sm:flex-row';

  const { data: cities } = useSWR<City[]>(BACKEND_ROUTES.CITIES, fetcher, {
    revalidateOnFocus: false,
  });

  const { data: facilities } = useSWR<Facility[]>(
    BACKEND_ROUTES.FACILITIES,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: benefits } = useSWR<Benefit[]>(
    BACKEND_ROUTES.BENEFITS,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    reset(router.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Dropdown
        label="Lokalizacja"
        name="city_id"
        control={control}
        data={
          cities?.map((city) => ({
            label: city.Name,
            value: city.id.toString(),
          })) || []
        }
      />
      <Dropdown
        label="Obiekt"
        name="facility_id"
        control={control}
        data={
          facilities?.map((facility) => ({
            label: facility.name,
            value: facility.id.toString(),
          })) || []
        }
      />
      <TextField
        label="Ilość graczy"
        type="number"
        {...register('number_of_players')}
      />
      <div className={rowInputClass}>
        <TextField label="Data od" type="date" {...register('date_from')} />
        <TextField label="Data do" type="date" {...register('date_to')} />
      </div>
      <div className={rowInputClass}>
        <TextField label="Godzina od" type="time" {...register('time_from')} />
        <TextField label="Godzina do" type="time" {...register('time_to')} />
      </div>
      <Dropdown
        label="Karta beneficyjna"
        name="benefit_id"
        control={control}
        data={
          benefits?.map((benefit) => ({
            label: benefit.name,
            value: benefit.id.toString(),
          })) || []
        }
      />
      <Checkbox
        label="Otwarte dla sędziów"
        name="open_for_referee"
        control={control}
      />
      <Checkbox
        label="Tylko dla drużyn"
        name="for_team_only"
        control={control}
      />
      <div className="mt-4 flex w-full gap-1">
        <Button value="Szukaj" isSubmit fullWidth />
      </div>
    </form>
  );
}

function MatchTile(props: MatchesData) {
  const match = props.match;
  const startDate = getLocaleDateString(match.reservation?.start_time);

  return (
    <Link href={`${ROUTES.MATCHES}/${match.id}`}>
      <div className="flex w-full cursor-pointer flex-col gap-5 rounded-2xl border border-gray-300 bg-grey-100 p-4 hover:bg-green-100 sm:flex-row">
        <div className="relative h-full w-full sm:w-[220px]">
          <Image
            className="aspect-video rounded-2xl bg-green-900 object-cover"
            src={footballImage1}
            quality={20}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between gap-3">
          <div>
            <h3 className="mb-1 text-label-medium">
              {getAddressFromFacility(match.reservation?.field?.facility)}
            </h3>
            <p>{startDate}</p>
          </div>
          <div className="flex gap-1">
            <Tag
              text={`${props.signed_users?.toString()}/${match.num_of_players?.toString()} Graczy`}
            />
            {match.open_for_referee && <Tag text="Otwarte dla sędziów" />}
            {match.for_team_only && <Tag text="Tylko dla drużyn" />}
            {props.benefits?.map((benefit) => (
              <Tag key={benefit} text={benefit} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <div className="w-fit rounded-full border border-grey-600 px-2 py-1">
      <p className="text-label-small text-green-900">{text}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cities = await fetcherBackend(BACKEND_ROUTES.CITIES, context);
  const facilities = await fetcherBackend(BACKEND_ROUTES.FACILITIES, context);
  const benefits = await fetcherBackend(BACKEND_ROUTES.BENEFITS, context);

  return {
    props: {
      fallback: {
        [BACKEND_ROUTES.CITIES]: cities || null,
        [BACKEND_ROUTES.FACILITIES]: facilities || null,
        [BACKEND_ROUTES.BENEFITS]: benefits || null,
      },
    },
  };
};

export default Matches;
