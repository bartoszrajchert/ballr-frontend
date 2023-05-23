import { fetcher } from '@/lib/fetchers';
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
  } = useSWR('/matches', fetcher);

  const {
    data: dataGenders,
    isLoading: isLoadingGenders,
    error: errorGenders,
  } = useSWR('/genders', fetcher);

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useSWR('/users', fetcher);

  return (
    <div className="space-y-3">
      <div>
        <strong>Matches: </strong>
        {JSON.stringify(dataMatches)}
        {isLoadingMatches}
        {errorMatches}
      </div>
      <div>
        <strong>Genders: </strong>
        {JSON.stringify(dataGenders)}
        {isLoadingGenders}
        {errorGenders}
      </div>
      <div>
        <strong>Users: </strong>
        {JSON.stringify(dataUsers)}
        {isLoadingUsers}
        {errorUsers}
      </div>
    </div>
  );
}
