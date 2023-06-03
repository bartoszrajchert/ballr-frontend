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

export async function addUserToTeam(teamId: string) {
  return axios.post(`${BACKEND_ROUTES.TEAMS}/${teamId}/users`, {});
}

export async function removeUserFromTeam(teamId: string) {
  return axios.delete(`${BACKEND_ROUTES.TEAMS}/${teamId}/users`);
}

export type GetTeamsResponse = {
  name: string;
  short_name: string;
  is_active: boolean;
  city: {
    name: string;
    id: number;
  };
  id: number;
  creation_date: string;
};

export type GetTeamResponse = {
  name: string;
  short_name: string;
  is_active: boolean;
  city: {
    name: string;
    id: number;
  };
  id: number;
  creation_date: string;
  users: {
    is_captain: boolean;
    start_date: string;
    end_date?: string;
    user_first_name: string;
    user_last_name: string;
    user_id: string;
    user_email: string;
  }[];
  banned_users: [];
  // tournaments: [
  //   {
  //     place: null;
  //     tournament_id: 1;
  //     tournament_name: 'Tournament 1';
  //     tournament_start_date: '2023-06-13T16:19:53';
  //     tournament_registry_end_date: '2023-06-08T16:19:53';
  //   }
  // ];
};
