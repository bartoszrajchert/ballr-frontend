import Button from '@/components/Button';
import ImageHeader from '@/components/ImageHeader';
import Spinner from '@/components/Spinner';
import TextField from '@/components/TextField';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import MainLayout from '@/layouts/MainLayout';
import { fetcherBackend } from '@/lib/fetchers';
import {
  concatenateDateAndTime,
  getAddressFromFacility,
  getFieldErrorText,
  is404,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { ROUTES } from '@/lib/routes';
import { UserContext } from '@/providers/UserProvider';
import { createReservation } from '@/repository/reservation.repository';
import { IconInfoCircle } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR, { SWRConfig } from 'swr';

function FieldsId({ fallback }: { fallback: any }) {
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
    data: field,
    isLoading,
    error,
  } = useSWR<Field>(`${ROUTES.FIELDS}/${id}`);

  if (isLoading) return <Spinner />;

  if (!field || is404(error))
    return <NoResultsMessage message="Nie udało się znaleźć boiska." />;

  if (error) return <ErrorMessage error={error.message} />;

  return (
    <MainLayout>
      <div className="mt-10 space-y-16">
        <ImageHeader
          href={`${ROUTES.FACILITIES}/${field?.facility?.id}`}
          hrefText={field?.facility?.name ?? 'Error'}
          title={getAddressFromFacility(field?.facility)}
          iconDetails={[
            {
              icon: <IconInfoCircle />,
              text: `Nazwa boiska: ${field?.name}`,
            },
            {
              icon: <IconInfoCircle />,
              text: `Wymiary boiska: ${field?.length}m x ${field?.width}m`,
            },
            {
              icon: <IconInfoCircle />,
              text: `Zadaszone: ${field?.roof ? 'Tak' : 'Nie'}`,
            },
          ]}
        />
        <section className="m-auto w-full lg:w-2/5">
          <div className="mb-7 space-y-4">
            <h3 className="text-heading-h3">Rezerwacja</h3>
            <p>
              Po dokonaniu rezerwacji administracja obiektu postara się jak
              najszybciej ją potwierdzić
            </p>
          </div>
          <Form />
        </section>
      </div>
    </MainLayout>
  );
}

function Form() {
  const { user } = useContext(UserContext); // TODO: remove this
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
    setError,
  } = useForm();

  const onSubmit = (data: any) => {
    const { date, start_time, end_time } = data;
    const start = concatenateDateAndTime(new Date(date), start_time);
    const end = concatenateDateAndTime(new Date(date), end_time);

    createReservation(String(id), start, end, user?.id ?? '') // TODO: remove user.id
      .then(async (data) => {
        toast.success('Rezerwacja została utworzona');
        await router.push(`${ROUTES.RESERVATIONS}/${data.data.id}`);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Data od"
        type="date"
        errorText={getFieldErrorText('date', errors)}
        {...register('date', { required: true })}
      />
      <div className="row-input">
        <TextField
          label="Godzina od"
          type="time"
          errorText={getFieldErrorText('start_time', errors)}
          {...register('start_time', { required: true })}
        />
        <TextField
          label="Godzina do"
          type="time"
          errorText={getFieldErrorText('end_time', errors)}
          {...register('end_time', { required: true })}
        />
      </div>
      <div className="mt-4 flex w-full gap-1">
        <Button
          value="Rezerwuj"
          // disabled={isSubmitting || isSubmitted} TODO: uncomment this
          isSubmit
          fullWidth
          onClick={() => resetKeepValues(reset)}
        />
      </div>
      <div>
        {getFieldErrorText('root', errors) && (
          <p className="text-red">
            Formularz zawiera błędy: {getFieldErrorText('root', errors)}
          </p>
        )}
      </div>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const field = await fetcherBackend(`${ROUTES.FIELDS}/${id}`, context);

  return {
    props: {
      fallback: {
        [`${ROUTES.FIELDS}/${id}`]: field ?? null,
      },
    },
  };
};

export default FieldsId;
