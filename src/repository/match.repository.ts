import { ROUTES } from '@/lib/routes';
import axios from 'axios';

export async function addUserToMatch(
  matchId: string | number,
  isReferee: boolean
) {
  return axios
    .post(`${ROUTES.MATCHES}/${matchId}/users`, {
      is_referee: isReferee,
    })
    .then((res) => res);
}
