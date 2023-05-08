import { fetchWithToken } from '@/lib/fetchers';
import useGetAuth from '@/lib/useGetAuth';
import { useIdToken } from 'react-firebase-hooks/auth';
import useSWR from 'swr';

export default function useSWRWithToken(url: string) {
  const auth = useGetAuth();
  const [user, tokenLoading, tokenError] = useIdToken(auth);

  const swr = useSWR([url, user], ([url, user]) => fetchWithToken(url, user));

  return {
    ...swr,
    tokenLoading,
    tokenError,
  };
}
