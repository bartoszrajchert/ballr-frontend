import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';

export const DynamicCheckbox = dynamic(() => import('@/components/Checkbox'), {
  loading: () => <Skeleton height={40} />,
});
