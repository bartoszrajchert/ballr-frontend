import { BACKEND_ROUTES } from '@/lib/routes';
import axios from 'axios';

export type CreateUserData = {
  first_name: string;
  last_name: string;
  birth_date: string;
  notification_preference: boolean;
  gender_id: number;
  city_id: number;
};

export async function createUser(user: CreateUserData) {
  return axios.post(`${BACKEND_ROUTES.USERS}`, user);
}
