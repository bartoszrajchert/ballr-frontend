import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';

export const DynamicDropdown = dynamic(
  () => import('@/components/Dropdown').then((mod) => mod.Dropdown),
  {
    loading: () => <Skeleton height={40} />,
  }
);

export const DynamicStaticDropdown = dynamic(
  () => import('@/components/Dropdown').then((mod) => mod.DropdownStatic),
  {
    loading: () => <Skeleton height={40} />,
  }
);
