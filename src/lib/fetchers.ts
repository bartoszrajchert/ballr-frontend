import { BACKEND_ROUTES } from '@/lib/routes';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

const globalFetcher = (url: string) => axios.get(url).then((res) => res.data);

const fetcherBackend = <T>(
  url: BACKEND_ROUTES | string,
  context: GetServerSidePropsContext
): Promise<T> => {
  const token = nookies.get(context).token;

  return axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};

export { globalFetcher, fetcherBackend };
