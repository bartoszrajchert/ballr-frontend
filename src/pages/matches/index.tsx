import Button from '@/components/Button';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import Tile from '@/components/Tile';
import { DynamicCheckbox } from '@/components/dynamic/DynamicCheckbox';
import { DynamicDropdown } from '@/components/dynamic/DynamicDropdown';
import { DynamicListWithPagination } from '@/components/dynamic/DynamicListWithPagination';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { getAddressFromFacility, getLocaleDateString } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { Benefit, City } from '@/models/base.model';
import { GetFacilitiesResponse } from '@/models/facility.model';
import { GetMatchesResponse } from '@/models/match.model';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SWRConfig } from 'swr';

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
      <MainLayout title="Mecze">
        <Header value="Mecze" />
        <div className="flex flex-col gap-5 lg:flex-row">
          <aside className="lg:w-2/5">
            <p className="mb-8 text-heading-h3">Filtry</p>
            <Form />
          </aside>
          <div className="w-full">
            <MatchesContainer />
          </div>
        </div>
      </MainLayout>
    </SWRConfig>
  );
}

function MatchesContainer() {
  const router = useRouter();

  const tags = ({ match, signed_users }: GetMatchesResponse) => {
    const tags = [];
    if (match.open_for_referee) {
      tags.push('Otwarte dla sędziów');
    }
    if (match.for_team_only) {
      tags.push('Tylko dla drużyn');
    }
    if (!match.for_team_only) {
      tags.push(`${signed_users}/${match.num_of_players}`);
    }
    return tags;
  };

  return (
    <DynamicListWithPagination
      listClassName="flex w-full flex-col gap-4"
      child={({ match, benefits, signed_users }: GetMatchesResponse) => (
        <Tile
          key={match.id}
          href={`${ROUTES.MATCHES}/${match.id}`}
          title={getAddressFromFacility(match.reservation?.field?.facility)}
          description={[getLocaleDateString(match.reservation?.start_time)]}
          tags={[...tags({ match, signed_users, benefits }), ...benefits]}
        />
      )}
      apiURL={BACKEND_ROUTES.MATCHES}
      queryParams={queryString.stringify(router.query, {
        skipEmptyString: true,
        skipNull: true,
      })}
    />
  );
}

function Form() {
  const router = useRouter();
  const { register, handleSubmit, control, reset } = useForm();
  const [cityId, setCityId] = React.useState<string>('');

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
      <DynamicDropdown
        label="Miasto"
        name="city_id"
        control={control}
        dataType="pagination"
        apiURL={BACKEND_ROUTES.CITIES}
        mapper={({ name, id }: City) => ({ label: name, value: id.toString() })}
        onValueChange={(value) => {
          setCityId(value);
        }}
      />
      <DynamicDropdown
        label="Obiekt"
        name="facility_id"
        control={control}
        dataType="pagination"
        apiURL={BACKEND_ROUTES.FACILITIES}
        queryParams={`${cityId && `city_id=${cityId}`}`}
        mapper={({ name, id }: GetFacilitiesResponse) => ({
          label: name,
          value: id.toString(),
        })}
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
      <DynamicDropdown
        label="Karta beneficyjna"
        name="benefit_id"
        control={control}
        dataType="pagination"
        apiURL={BACKEND_ROUTES.BENEFITS}
        mapper={({ name, id }: Benefit) => ({
          label: name,
          value: id.toString(),
        })}
      />
      <DynamicCheckbox
        label="Otwarte dla sędziów"
        name="open_for_referee"
        control={control}
      />
      <DynamicCheckbox
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
