import { ROUTES } from '@/lib/routes';
import axios from 'axios';

export async function addUserToMatch(
  matchId: string | number,
  isReferee: boolean
) {
  return axios.post(`${ROUTES.MATCHES}/${matchId}/users`, {
    is_referee: isReferee,
  });
}

export async function addTeamToMatch(
  matchId: string | number,
  teamId: string | number
) {
  return axios.post(`${ROUTES.MATCHES}/${matchId}/teams/${teamId}`);
}

export async function deleteTeamFromMatch(
  matchId: string | number,
  teamId: string | number
) {
  return axios.delete(`${ROUTES.MATCHES}/${matchId}/teams/${teamId}`);
}

export type PutRatePlayerType = {
  user_id: number;
  rating: number;
  is_mvp: boolean;
};

export async function putRatePlayers(
  matchId: string | number,
  players: PutRatePlayerType[]
) {
  return axios.put(`${ROUTES.MATCHES}/${matchId}/users`, {
    user_matches: players,
  });
}
