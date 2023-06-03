import Button from '@/components/Button';
import Header from '@/components/Header';
import Tile from '@/components/Tile';
import CityDropdown from '@/components/dropdowns/CityDropdown';
import { DynamicListWithPagination } from '@/components/dynamic/DynamicListWithPagination';
import MainLayout from '@/layouts/MainLayout';
import { getAddressFromFacility } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function Facilities() {
  return (
    <MainLayout>
      <Header value="Obiekty" />
      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="lg:w-2/5">
          <p className="mb-8 text-heading-h3">Filtry</p>
          <Form />
        </aside>
        <div className="w-full">
          <FacilitiesContainer />
        </div>
      </div>
    </MainLayout>
  );
}

function FacilitiesContainer() {
  const router = useRouter();

  return (
    <DynamicListWithPagination
      listClassName="flex w-full flex-col gap-4"
      child={(data: Facility) => (
        <Tile
          key={data.id}
          href={`${ROUTES.FACILITIES}/${data.id}`}
          title={data.name}
          description={[
            getAddressFromFacility(data),
            `Godziny otwarcia: ${data.open_time} - ${data.close_time}`,
            // TODO: Liczba boisk
          ]}
        />
      )}
      apiURL={BACKEND_ROUTES.FACILITIES}
      queryParams={queryString.stringify(router.query, {
        skipEmptyString: true,
        skipNull: true,
      })}
    />
  );
}

function Form() {
  const router = useRouter();
  const { handleSubmit, control, reset } = useForm();

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
      <CityDropdown control={control} />
      <div className="mt-4 flex w-full gap-1">
        <Button value="Szukaj" isSubmit fullWidth />
      </div>
    </form>
  );
}

export default Facilities;
