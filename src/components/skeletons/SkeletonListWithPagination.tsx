import React from 'react';
import Skeleton from 'react-loading-skeleton';

function SkeletonListWithPagination() {
  return (
    <div className="space-y-4">
      <Skeleton height={140} count={2} containerClassName="space-y-4" />
      <Skeleton
        height={140}
        count={4}
        containerClassName="flex flex-col sm:flex-row gap-4"
        inline
      />
      <div className="flex w-full justify-center">
        <Skeleton height={40} width={200} />
      </div>
    </div>
  );
}

export default SkeletonListWithPagination;
