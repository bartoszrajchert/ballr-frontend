import { ErrorMessage } from '@/components/messages/ErrorMessage';
import NoResultsMessage from '@/components/messages/NoResultsMessage';
import SkeletonListWithPagination from '@/components/skeletons/SkeletonListWithPagination';
import { Pagination } from '@/models/base.model';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useSWR from 'swr';

type Props = {
  child: (data: any) => JSX.Element;
  apiURL: string;
  queryParams?: string;
  listClassName?: string;
};

function ListWithPagination(props: Props) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const { data, isLoading, error } = useSWR<Pagination<unknown>>(
    `${props.apiURL}?page=${pageIndex}&size=${pageSize}&${props.queryParams}`
  );

  useEffect(() => {
    if (data) {
      setPageCount(data.pages);
    }
  }, [data]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPageIndex(selectedItem.selected + 1);
  };

  if (isLoading) return <SkeletonListWithPagination />;

  if (error) return <ErrorMessage error={error} />;

  if (!error && !isLoading && (!data || data.total <= 0))
    return <NoResultsMessage />;

  return (
    <>
      <div className={clsx('mb-8', props.listClassName)}>
        {data && !error && data.items.map((item: unknown) => props.child(item))}
      </div>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pageSize}
        onPageChange={handlePageClick}
        renderOnZeroPageCount={null}
        forcePage={pageIndex - 1}
        className="mt-2 flex items-center justify-center gap-3"
        pageLinkClassName="p-2 link"
        activeLinkClassName="--underline text-green-600"
        previousLinkClassName="flex p-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
        nextLinkClassName="flex p-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
        previousLabel={<IconChevronLeft />}
        nextLabel={<IconChevronRight />}
      />
    </>
  );
}

export default ListWithPagination;
