import dynamic from 'next/dynamic';
import React from 'react';

export const DynamicListWithPagination = dynamic(
  () => import('@/components/ListWithPagination'),
  {
    loading: () => <p>Ładowanie...</p>,
  }
);
