import { BACKEND_ROUTES } from '@/lib/routes';
import axios from 'axios';

export async function createReservation(
  fieldId: string,
  startTime: string,
  endTime: string
) {
  return axios.post(BACKEND_ROUTES.RESERVATIONS, {
    field_id: fieldId,
    start_time: startTime,
    end_time: endTime,
  });
}
