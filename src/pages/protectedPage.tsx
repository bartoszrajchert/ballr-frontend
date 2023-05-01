import { withAuth } from '@/lib/withAuth';

function ProtectedPage() {
  return <div>This page is protected</div>;
}

export default withAuth(ProtectedPage);
