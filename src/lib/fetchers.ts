import { User } from '@firebase/auth';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

async function fetchWithToken(url: string, user: User | null | undefined) {
  const token = await user?.getIdToken();

  if (!token) return null;

  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(
    (res) => res.json()
  );
}

export { fetcher, fetchWithToken };
