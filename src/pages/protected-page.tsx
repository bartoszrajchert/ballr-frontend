import MainLayout from '@/layouts/MainLayout';
import { fetcher } from '@/lib/fetchers';
import useSWR from 'swr';

/**
 * This is a protected page. It will redirect to /login if the user is not logged in.
 * TODO: Delete this page.
 */
function ProtectedPage() {
  const { data, isLoading, error } = useSWR('/cities', fetcher);

  return (
    <MainLayout>
      <>{error && <p>Error: {JSON.stringify(error)}</p>}</>
      <>{isLoading && <p>Loading...</p>}</>
      <p>This page is protected.</p>
      <p>Cities: {JSON.stringify(data)}</p>
      <>{error && <p>Data error: {JSON.stringify(error.message)}</p>}</>
    </MainLayout>
  );
}

export default ProtectedPage;
