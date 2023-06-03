import { ROUTES } from '@/lib/routes';
import { GetMatchResponse } from '@/models/match.model';
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

export async function updateMatchScore(
  matchId: string | number,
  data: { score: number }
) {
  return axios.put(`${ROUTES.MATCHES}/${matchId}/score`, data);
}

// TODO: clear comments
export type CreateMatchPayload = {
  // start_date: string;
  for_team_only: boolean;
  description: string;
  num_of_players: number;
  open_for_referee: boolean;
  // "score": 0,
  // "opponent_score": 0,
  reservation_id: number;
  // "tournament_id": 0,
  // "tournament_phase_id": 0,
  // "team_id": 0,
  // "opponent_team_id": 0,
  // "winner_team_id": 0
};

export async function createMatch(data: CreateMatchPayload) {
  return axios.post<GetMatchResponse>(ROUTES.MATCHES, data);
}

export type UpdateMatchPayload = Partial<
  Omit<CreateMatchPayload, 'reservation_id'>
>;

export async function updateMatch(
  matchId: string | number,
  data: UpdateMatchPayload
) {
  return axios.put<GetMatchResponse>(`${ROUTES.MATCHES}/${matchId}`, data);
}
