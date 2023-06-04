import { BACKEND_ROUTES } from '@/lib/routes';
import { GetReservationResponse } from '@/models/reservation.model';
import axios from 'axios';

export async function createReservation(
  fieldId: string,
  startTime: string,
  endTime: string,
  user_id: string // TODO: Remove this
) {
  return axios.post<GetReservationResponse>(BACKEND_ROUTES.RESERVATIONS, {
    field_id: fieldId,
    start_time: startTime,
    end_time: endTime,
    user_id: user_id,
  });
}

export async function deleteReservation(reservationId: string) {
  return axios.delete(`${BACKEND_ROUTES.RESERVATIONS}/${reservationId}`);
}
