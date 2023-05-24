import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const fetcherBackend = (url: string, context: GetServerSidePropsContext) => {
  const token = nookies.get(context).token;

  return axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};

export { fetcher, fetcherBackend };
