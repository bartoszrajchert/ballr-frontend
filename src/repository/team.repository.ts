import { BACKEND_ROUTES } from '@/lib/routes';
import axios from 'axios';

export type CreateTeamPayload = {
  name: string;
  short_name: string; // Max 5 chars
  city_id: number;
};

export async function createTeam(data: CreateTeamPayload) {
  // TODO: Remove this
  // @ts-ignore
  data.is_active = true;

  return axios.post(`${BACKEND_ROUTES.TEAMS}`, data);
}
