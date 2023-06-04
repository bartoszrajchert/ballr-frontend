import SkeletonListWithPagination from '@/components/skeletons/SkeletonListWithPagination';
import dynamic from 'next/dynamic';
import React from 'react';

export const DynamicListWithPagination = dynamic(
  () => import('@/components/ListWithPagination'),
  {
    loading: () => <SkeletonListWithPagination />,
  }
);
