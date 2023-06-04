import Skeleton from 'react-loading-skeleton';

function SkeletonNavigation() {
  return (
    <div className="flex h-[80px] w-full justify-between py-4">
      <Skeleton className="h-[40px] !w-[140px] lg:!w-[200px]" />
      <Skeleton className="h-[40px] lg:!w-[400px]" />
      <Skeleton className="h-[40px] !w-[40px] lg:!w-[200px]" />
    </div>
  );
}

export default SkeletonNavigation;
