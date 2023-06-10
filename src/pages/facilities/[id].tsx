import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import TextInformation from '@/components/TextInformation';
import Tile from '@/components/Tile';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import { getAddressFromFacility, is404 } from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { GetFacilityResponse } from '@/models/facility.model';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR, { SWRConfig } from 'swr';

function FacilitiesId({ fallback }: { fallback: any }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Content />
    </SWRConfig>
  );
}

function Content() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: facility,
    error,
    isLoading,
  } = useSWR<GetFacilityResponse>(`${BACKEND_ROUTES.FACILITIES}/${id}`);

  if (!facility && isLoading && !error) {
    return <Spinner />;
  }

  if (is404(error)) {
    return <NoResultsMessage message="Nie znaleziono obiektu." />;
  }

  if (!facility || error) {
    return <ErrorMessage error={error.message} />;
  }

  return (
    <MainLayout title={`Obiekt - ${facility?.name}`}>
      <Header value={facility?.name} />
      <section className="flex w-full flex-col flex-wrap gap-2 sm:flex-row">
        <TextInformation
          className="flex-grow"
          header="Adres"
          body={getAddressFromFacility(facility)}
        />
        <TextInformation
          className="flex-grow"
          header="Liczba boisk"
          body={facility?.fields?.length.toString() ?? 'Error'}
        />
        {facility?.open_time && facility?.close_time && (
          <TextInformation
            className="flex-grow"
            header="Godziny otwarcia"
            body={`${facility?.open_time} - ${facility?.close_time}`}
          />
        )}
        <TextInformation
          className="flex-grow"
          header="Jest zweryfikowany?"
          body={facility?.is_verified ? 'Tak' : 'Nie'}
        />
      </section>
      <section className="mt-14 flex w-full flex-col gap-4">
        {facility?.fields?.map((field) => (
          <Tile
            key={field.id}
            href={`${ROUTES.FIELDS}/${field.id}`}
            title={field.name}
            description={[
              `Długość: ${field.length}m`,
              `Szerokość: ${field.width}m`,
            ]}
          />
        ))}
      </section>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const facility = await fetcherBackend(
    `${BACKEND_ROUTES.FACILITIES}/${id}`,
    context
  );

  return {
    props: {
      fallback: {
        [`${BACKEND_ROUTES.FACILITIES}/${id}`]: facility ?? null,
      },
    },
  };
};

export default FacilitiesId;
