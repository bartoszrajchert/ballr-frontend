import { BACKEND_ROUTES } from '@/lib/routes';
import { CreateUpdateUserData } from '@/models/user.model';
import axios from 'axios';

export async function createUser(user: CreateUpdateUserData) {
  return axios.post(`${BACKEND_ROUTES.USERS}`, user);
}

export async function updateUser(user: CreateUpdateUserData) {
  return axios.put(`${BACKEND_ROUTES.USERS}/me`, user);
}
