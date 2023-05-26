import { fetcher } from '@/lib/fetchers';
import { BACKEND_ROUTES } from '@/lib/routes';
import React from 'react';
import useSWR from 'swr';

/**
 * TODO: This page is only for test purposes. Delete it.
 */
export default function RequestsTestPage() {
  const {
    data: dataMatches,
    isLoading: isLoadingMatches,
    error: errorMatches,
  } = useSWR(BACKEND_ROUTES.MATCHES, fetcher);

  const {
    data: dataGenders,
    isLoading: isLoadingGenders,
    error: errorGenders,
  } = useSWR(BACKEND_ROUTES.GENDERS, fetcher);

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useSWR(BACKEND_ROUTES.USERS, fetcher);

  return (
    <div className="space-y-3">
      <div>
        <strong>Matches: </strong>
        {JSON.stringify(dataMatches)}
        {isLoadingMatches}
        {JSON.stringify(errorMatches)}
      </div>
      <div>
        <strong>Genders: </strong>
        {JSON.stringify(dataGenders)}
        {isLoadingGenders}
        {JSON.stringify(errorGenders)}
      </div>
      <div>
        <strong>Users: </strong>
        {JSON.stringify(dataUsers)}
        {isLoadingUsers}
        {JSON.stringify(errorUsers)}
      </div>
    </div>
  );
}
