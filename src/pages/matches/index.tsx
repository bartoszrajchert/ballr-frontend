import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import ListWithPagination from '@/components/ListWithPagination';
import TextField from '@/components/TextField';
import Tile from '@/components/Tile';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { getAddressFromFacility, getLocaleDateString } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { Pagination } from '@/models/base.model';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { SWRConfig } from 'swr';

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
          <aside className="lg:w-2/5">
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

  const tags = (match: Match) => {
    const tags = [];
    if (match.open_for_referee) {
      tags.push('Otwarte dla sędziów');
    }
    if (match.for_team_only) {
      tags.push('Tylko dla drużyn');
    }
    return tags;
  };

  return (
    <>
      <ListWithPagination
        child={({ match, benefits, signed_users }: MatchesData) => (
          <Tile
            key={match.id}
            href={`${ROUTES.MATCHES}/${match.id}`}
            title={getAddressFromFacility(match.reservation?.field?.facility)}
            description={[getLocaleDateString(match.reservation?.start_time)]}
            tags={[
              `${signed_users}/${match.num_of_players}`,
              ...tags(match),
              ...benefits,
            ]}
          />
        )}
        apiURL={BACKEND_ROUTES.MATCHES}
        queryParams={queryString.stringify(router.query, {
          skipEmptyString: true,
          skipNull: true,
        })}
      />
    </>
  );
}

function Form() {
  const router = useRouter();
  const { register, handleSubmit, control, reset } = useForm();
  const [cityId, setCityId] = React.useState<string>('');

  const { data: cities } = useSWR<Pagination<City>>(BACKEND_ROUTES.CITIES);
  const { data: facilities } = useSWR<Pagination<Facility>>(
    `${BACKEND_ROUTES.FACILITIES}?${cityId && `city_id=${cityId}`}`
  );
  const { data: benefits } = useSWR<Pagination<Benefit>>(
    BACKEND_ROUTES.BENEFITS
  );

  useEffect(() => {
    reset(router.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: any) => {
    await router.push(
      {
        query: queryString.stringify(data, {
          skipEmptyString: true,
          skipNull: true,
        }),
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Dropdown
        label="Lokalizacja"
        name="city_id"
        control={control}
        onValueChange={(value) => {
          setCityId(value);
        }}
        data={
          (cities &&
            cities.items.map((city) => ({
              label: city.name,
              value: city.id.toString(),
            }))) ||
          []
        }
      />
      <Dropdown
        label="Obiekt"
        name="facility_id"
        control={control}
        data={
          (facilities &&
            facilities.items.map((facility) => ({
              label: facility.name,
              value: facility.id.toString(),
            }))) ||
          []
        }
      />
      <TextField
        label="Ilość graczy"
        type="number"
        {...register('number_of_players')}
      />
      <div className="row-input">
        <TextField label="Data od" type="date" {...register('date_from')} />
        <TextField label="Data do" type="date" {...register('date_to')} />
      </div>
      <div className="row-input">
        <TextField label="Godzina od" type="time" {...register('time_from')} />
        <TextField label="Godzina do" type="time" {...register('time_to')} />
      </div>
      <Dropdown
        label="Karta beneficyjna"
        name="benefit_id"
        control={control}
        data={
          (benefits &&
            benefits.items.map((benefit) => ({
              label: benefit.name,
              value: benefit.id.toString(),
            }))) ||
          []
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
