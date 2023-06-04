import SkeletonListWithPagination from '@/components/skeletons/SkeletonListWithPagination';
import dynamic from 'next/dynamic';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const DynamicListWithPagination = dynamic(
  () => import('@/components/ListWithPagination'),
  {
    loading: () => <SkeletonListWithPagination />,
  }
);
