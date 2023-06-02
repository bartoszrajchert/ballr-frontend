import { BACKEND_ROUTES } from '@/lib/routes';
import axios from 'axios';

export type CreateUpdateUserData = {
  first_name: string;
  last_name: string;
  birth_date: string; // Backend doesn't have update for this field
  notification_preference: boolean;
  gender_id: number;
  city_id: number;
};

export async function createUser(user: CreateUpdateUserData) {
  return axios.post(`${BACKEND_ROUTES.USERS}`, user);
}

export async function updateUser(user: CreateUpdateUserData, id: string) {
  return axios.put(`${BACKEND_ROUTES.USERS}/${id}`, user);
}
