import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import Tile from '@/components/Tile';
import MainLayout from '@/layouts/MainLayout';
import { getAddressFromFacility } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

function Facilities() {
  return (
    <MainLayout>
      <Header value="Obiekty" />
      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="lg:w-2/5">
          <p className="mb-8 text-heading-h3">Filtry</p>
          <Form />
        </aside>
        <div className="flex w-full flex-col gap-4">
          <FacilitiesContainer />
        </div>
      </div>
    </MainLayout>
  );
}

function FacilitiesContainer() {
  const router = useRouter();
  const {
    data: facilities,
    isLoading,
    error,
  } = useSWR<Facility[]>(
    `${BACKEND_ROUTES.FACILITIES}?${queryString.stringify(router.query, {
      skipEmptyString: true,
      skipNull: true,
    })}`
  );

  return (
    <>
      {facilities?.map((facility) => (
        <Tile
          key={facility.id}
          href={`${ROUTES.FACILITIES}/${facility.id}`}
          title={facility.name}
          description={[
            getAddressFromFacility(facility),
            `Godziny otwarcia: ${facility.open_time} - ${facility.close_time}`,
            // TODO: Liczba boisk
          ]}
        />
      ))}
      {isLoading && <div>Loading...</div>}
      {!isLoading && (!facilities || facilities.length <= 0) && !error && (
        <p>Brak meczy</p>
      )}
      {error && <div>Error</div>}
    </>
  );
}

function Form() {
  const router = useRouter();
  const { register, handleSubmit, control, reset, getValues } = useForm();

  const { data: cities } = useSWR<City[]>(BACKEND_ROUTES.CITIES);

  useEffect(() => {
    reset(router.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) =>
    router.push({ query: data }, undefined, {
      shallow: true,
    });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Dropdown
        label="Lokalizacja"
        name="city_id"
        control={control}
        data={
          cities?.map((city) => ({
            label: city.name,
            value: city.id.toString(),
          })) || []
        }
      />
      <div className="mt-4 flex w-full gap-1">
        <Button value="Szukaj" isSubmit fullWidth />
      </div>
    </form>
  );
}

export default Facilities;