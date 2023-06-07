import Avatar, { AvatarProps } from '@/components/Avatar';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

type Props = {
  href: string;
  title: string;
  avatar?: AvatarProps;
  paragraph?: string;
  className?: string;
  leadingIcon?: JSX.Element;
  actionChildren?: JSX.Element | false;
};

function EntityCard(props: Props) {
  return (
    <div className={clsx(props.className, 'relative')}>
      <Link href={props.href} className="h-full w-full">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-grey-100 p-7 shadow-border-1px shadow-grey-300 transition-colors hover:bg-green-100">
          {props.avatar && <Avatar {...props.avatar} className="mb-4" />}
          <p className="flex items-center justify-center gap-1 text-label-medium">
            {props.leadingIcon}
            {props.title}
          </p>
          <p>{props.paragraph}</p>
        </div>
      </Link>
      {props.actionChildren && (
        <div className="absolute right-0.5 top-0.5">{props.actionChildren}</div>
      )}
    </div>
  );
}

export default EntityCard;
