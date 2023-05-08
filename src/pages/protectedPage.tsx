import MainLayout from '@/layouts/MainLayout';
import useSWRWithToken from '@/lib/useSWRWithToken';
import { withAuth } from '@/lib/withAuth';

/**
 * This is a protected page. It will redirect to /login if the user is not logged in.
 * TODO: Delete this page.
 */
function ProtectedPage() {
  const { data, tokenError, tokenLoading, error } =
    useSWRWithToken('/api/user');

  return (
    <MainLayout>
      <>{tokenError && <p>Error: {JSON.stringify(tokenError)}</p>}</>
      <>{tokenLoading && <p>Loading...</p>}</>
      <p>This page is protected. Data: {JSON.stringify(data)}</p>
      <>{error && <p>Data error: {JSON.stringify(error.message)}</p>}</>
    </MainLayout>
  );
}

export default withAuth(ProtectedPage);
