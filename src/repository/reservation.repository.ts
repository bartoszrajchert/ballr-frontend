import { BACKEND_ROUTES } from '@/lib/routes';
import { GetReservationResponse } from '@/models/reservation.model';
import axios from 'axios';

export async function createReservation(
  fieldId: string,
  startTime: string,
  endTime: string
) {
  return axios.post<GetReservationResponse>(BACKEND_ROUTES.RESERVATIONS, {
    field_id: fieldId,
    start_time: startTime,
    end_time: endTime,
  });
}

export async function deleteReservation(reservationId: string) {
  return axios.delete(`${BACKEND_ROUTES.RESERVATIONS}/${reservationId}`);
}

export async function acceptReservation(
  reservationId: string,
  confirmationToken: string,
  accept: boolean
) {
  return axios.put(
    `${BACKEND_ROUTES.RESERVATIONS}/${reservationId}/confirmation`,
    {
      is_approved: accept,
      confirmation_token: confirmationToken,
    }
  );
}
