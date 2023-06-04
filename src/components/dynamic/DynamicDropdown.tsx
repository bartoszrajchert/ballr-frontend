import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';

export const DynamicDropdown = dynamic(() => import('@/components/Dropdown'), {
  loading: () => <Skeleton height={40} />,
});
