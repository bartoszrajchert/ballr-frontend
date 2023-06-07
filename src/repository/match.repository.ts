import { ROUTES } from '@/lib/routes';
import {
  CreateMatchPayload,
  GetMatchResponse,
  PutRatePlayerType,
  UpdateMatchPayload,
} from '@/models/match.model';
import axios from 'axios';

export async function addUserToMatch(
  matchId: string | number,
  isReferee: boolean
) {
  return axios.post(`${ROUTES.MATCHES}/${matchId}/users`, {
    is_referee: isReferee,
  });
}

export async function deleteMyselfFromMatch(matchId: string | number) {
  return axios.delete(`${ROUTES.MATCHES}/${matchId}/users`);
}

export async function deleteUserFromMatch(
  matchId: string | number,
  userId: string | number
) {
  return axios.delete(`${ROUTES.MATCHES}/${matchId}/users/${userId}`);
}

export async function deleteTeamFromMatch(
  matchId: string | number,
  teamId: string | number
) {
  return axios.delete(`${ROUTES.MATCHES}/${matchId}/teams/${teamId}`);
}

export async function addTeamToMatch(
  matchId: string | number,
  teamId: string | number
) {
  return axios.post(`${ROUTES.MATCHES}/${matchId}/teams/${teamId}`);
}

export async function putRatePlayers(
  matchId: string | number,
  players: PutRatePlayerType[]
) {
  return axios.put(`${ROUTES.MATCHES}/${matchId}/users`, {
    user_matches: players,
  });
}

export async function updateMatchScore(
  matchId: string | number,
  data: { score: number }
) {
  return axios.put(`${ROUTES.MATCHES}/${matchId}/score`, data);
}

export async function createMatch(data: CreateMatchPayload) {
  data.num_of_players = data.num_of_players || undefined;

  return axios.post<GetMatchResponse>(ROUTES.MATCHES, data);
}

export async function deleteMatch(matchId: string | number) {
  return axios.delete(`${ROUTES.MATCHES}/${matchId}`);
}

export async function updateMatch(
  matchId: string | number,
  data: UpdateMatchPayload
) {
  return axios.put<GetMatchResponse>(`${ROUTES.MATCHES}/${matchId}`, data);
}
