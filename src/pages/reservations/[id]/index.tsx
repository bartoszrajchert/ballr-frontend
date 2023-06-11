import Button from '@/components/Button';
import ImageHeader from '@/components/ImageHeader';
import Spinner from '@/components/Spinner';
import TextField from '@/components/TextField';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { DynamicCheckbox } from '@/components/dynamic/DynamicCheckbox';
import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import MainLayout from '@/layouts/MainLayout';
import {
  getAddressFromFacility,
  getFieldErrorText,
  getLocaleDateString,
  is404,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { CreateMatchPayload } from '@/models/match.model';
import { GetReservationResponse } from '@/models/reservation.model';
import { createMatch } from '@/repository/match.repository';
import { deleteReservation } from '@/repository/reservation.repository';
import { IconInfoCircle } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function ReservationsId({ id }: { id: string }) {
  const router = useRouter();
  const {
    data: reservation,
    isLoading,
    error,
  } = useSWR<GetReservationResponse>(`${BACKEND_ROUTES.RESERVATIONS}/${id}`);

  const onSubmit = useCallback(() => {
    if (!id) return;

    deleteReservation(String(id))
      .then(async () => {
        toast.success('Rezerwacja została usunięta');
        await router.push(ROUTES.SETTINGS_RESERVATIONS);
      })
      .catch((err) => {
        toast.error(`Nie udało się usunąć rezerwacji: ${err}`);
      });
  }, [id, router]);

  if (!reservation && isLoading && !error) {
    return <Spinner />;
  }

  if (is404(error))
    return <NoResultsMessage message="Nie udało się znaleźć rezerwacji." />;

  if (!reservation || error) return <ErrorMessage error={error.message} />;

  return (
    <MainLayout
      title={`Rezerwacja - ${getAddressFromFacility(
        reservation.field.facility
      )}`}
    >
      <div className="mt-10 space-y-16">
        <ImageHeader
          href={`${ROUTES.FACILITIES}/${reservation.field?.facility?.id}`}
          hrefText={reservation.field?.facility?.name ?? 'Error'}
          title={getAddressFromFacility(reservation.field?.facility)}
          iconDetails={[
            {
              icon: <IconInfoCircle />,
              text: `Nazwa boiska: ${reservation.field?.name}`,
            },
            {
              icon: <IconInfoCircle />,
              text: `Data rezerwacji: ${getLocaleDateString(
                reservation.start_time
              )} - ${getLocaleDateString(reservation.end_time)}`,
            },
          ]}
        >
          <div className="space-y-2">
            {reservation.match_id && (
              <Button
                value="Przejdź do meczu"
                onClick={() => {
                  router.push(`${ROUTES.MATCHES}/${reservation.match_id}`);
                }}
                fullWidth
              />
            )}
            <ConfirmDialog
              title="Czy na pewno chcesz usunąć rezerwację?"
              description="Jeśli jest przypisany mecz do tej rezerwacji to też zostanie usunięty. Ta operacja jest nieodwracalna."
              trigger={
                <Button type="cancel" value="Usuń rezerwację" fullWidth />
              }
              confirmValue="Usuń rezerwacje"
              onConfirm={onSubmit}
            />
          </div>
        </ImageHeader>

        {!reservation.match_id &&
          reservation.is_confirmed &&
          reservation.is_approved && (
            <section className="m-auto w-full lg:w-2/5">
              <div className="mb-7 space-y-4">
                <h3 className="text-heading-h3">Stwórz mecz</h3>
                <p>
                  Mecz zostanie dostępny dla każdego zarejestrowanego
                  użytkownika w serwisie.
                </p>
              </div>
              <Form />
            </section>
          )}

        {!reservation.is_confirmed && (
          <section className="m-auto w-full space-y-2 rounded-xl bg-grey-100 p-6 text-center">
            <h3 className="text-heading-h4">
              Rezerwacja nie została jeszcze potwierdzona. Prosimy czekać.
            </h3>
            <p>Po potwierdzeniu rezerwacji będzie można stworzyć mecz.</p>
          </section>
        )}

        {reservation.is_confirmed && !reservation.is_approved && (
          <section className="m-auto w-full space-y-2 rounded-xl bg-grey-100 p-6 text-center">
            <h3 className="text-heading-h4 text-red">
              Rezerwacja została odrzucona przez właściciela obiektu.
            </h3>
            <p>
              Nie można stworzyć meczu. Prosimy o kontakt z właścicielem
              obiektu.
            </p>
          </section>
        )}
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
    formState: { errors },
    setError,
    watch,
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
        disabled={watch('for_team_only')}
        label="Ilość graczy"
        type="number"
        errorText={getFieldErrorText('num_of_players', errors)}
        {...register('num_of_players', { required: !watch('for_team_only') })}
      />
      <DynamicCheckbox
        label="Tylko dla drużyn"
        name="for_team_only"
        control={control}
      />
      <DynamicCheckbox
        label="Otwarty dla sędziego"
        name="open_for_referee"
        control={control}
      />
      <div className="mt-4 flex w-full gap-1">
        <Button
          value="Rezerwuj"
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

  return {
    props: {
      id,
    },
  };
};

export default ReservationsId;
