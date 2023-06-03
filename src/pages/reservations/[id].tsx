import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import ImageHeader from '@/components/ImageHeader';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import {
  getAddressFromFacility,
  getFieldErrorText,
  getLocaleDateString,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { ROUTES } from '@/lib/routes';
import { GetReservationResponse } from '@/models/reservation.model';
import { createMatch, CreateMatchPayload } from '@/repository/match.repository';
import { IconInfoCircle } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function ReservationsId() {
  const router = useRouter();
  const { id } = router.query;
  const { data: reservation } = useSWR<GetReservationResponse>(
    `${ROUTES.RESERVATIONS}/${id}`
  );

  const onSubmit = useCallback(() => {
    // TODO: Delete reservation
    console.log('Delete reservation');
  }, []);

  return (
    <MainLayout>
      <div className="mt-10 space-y-16">
        <ImageHeader
          href={`${ROUTES.FACILITIES}/${reservation?.field?.facility?.id}`}
          hrefText={reservation?.field?.facility?.name ?? 'Error'}
          title={getAddressFromFacility(reservation?.field?.facility)}
          iconDetails={[
            {
              icon: <IconInfoCircle />,
              text: `Nazwa boiska: ${reservation?.field?.name}`,
            },
            {
              icon: <IconInfoCircle />,
              text: `Data rezerwacji: ${getLocaleDateString(
                reservation?.start_time
              )} - ${getLocaleDateString(reservation?.end_time)}`,
            },
          ]}
        >
          <Button
            type="cancel"
            value="Usuń rezerwację"
            onClick={onSubmit}
            fullWidth
          />
        </ImageHeader>
        <section className="m-auto w-full lg:w-2/5">
          <div className="mb-7 space-y-4">
            <h3 className="text-heading-h3">Stwórz mecz</h3>
            <p>
              Mecz zostanie dostępny dla każdego zarejestrowanego użytkownika w
              serwisie.
            </p>
          </div>
          <Form />
        </section>
      </div>
    </MainLayout>
  );
}

function Form() {
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isSubmitted },
    setError,
  } = useForm<CreateMatchPayload>();

  const onSubmit = (data: CreateMatchPayload) => {
    data.reservation_id = Number(id);

    createMatch(data)
      .then(async (data) => {
        toast.success('Rezerwacja została utworzona');
        await router.push(`${ROUTES.MATCHES}/${data.data.id}`);
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Opis"
        errorText={getFieldErrorText('description', errors)}
        {...register('description', { required: true })}
      />
      <TextField
        label="Ilość graczy"
        type="number"
        errorText={getFieldErrorText('num_of_players', errors)}
        {...register('num_of_players', { required: true })}
      />
      <Checkbox
        label="Tylko dla drużyn"
        name="for_team_only"
        control={control}
      />
      <Checkbox
        label="Otwarty dla sędziego"
        name="open_for_referee"
        control={control}
      />
      <div className="mt-4 flex w-full gap-1">
        <Button
          value="Rezerwuj"
          isSubmit
          fullWidth
          disabled={isSubmitting || isSubmitted}
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

export default ReservationsId;
