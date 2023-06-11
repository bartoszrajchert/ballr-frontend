import { BACKEND_ROUTES } from '@/lib/routes';
import { CreateTeamPayload, EditTeamPayload } from '@/models/team.model';
import axios from 'axios';

export async function createTeam(data: CreateTeamPayload) {
  return axios.post(`${BACKEND_ROUTES.TEAMS}`, {
    ...data,
    is_active: true,
  });
}

export async function addUserToTeam(teamId: string) {
  return axios.post(`${BACKEND_ROUTES.TEAMS}/${teamId}/users`, {});
}

export async function editTeam(teamId: string, data: EditTeamPayload) {
  return axios.put(`${BACKEND_ROUTES.TEAMS}/${teamId}`, data);
}

export async function deleteTeam(teamId: string) {
  return axios.delete(`${BACKEND_ROUTES.TEAMS}/${teamId}`);
}

export async function removeMeFromTeam(teamId: string) {
  return axios.delete(`${BACKEND_ROUTES.TEAMS}/${teamId}/users`);
}

export async function removeUserFromTeam(teamId: string, userId: string) {
  return axios.delete(`${BACKEND_ROUTES.TEAMS}/${teamId}/users/${userId}`);
}

export async function banUserFromTeam(
  teamId: string,
  userId: string,
  isBanned: boolean
) {
  return axios.put(`${BACKEND_ROUTES.TEAMS}/${teamId}/users/${userId}`, {
    is_banned: isBanned,
  });
}
