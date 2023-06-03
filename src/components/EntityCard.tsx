import Avatar, { AvatarProps } from '@/components/Avatar';
import Link from 'next/link';
import React from 'react';

type Props = {
  href: string;
  title: string;
  avatar?: AvatarProps;
  paragraph?: string;
  className?: string;
  leadingIcon?: JSX.Element;
};

function EntityCard(props: Props) {
  return (
    <Link href={props.href} className={props.className}>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-grey-100 p-7 shadow-border-1px shadow-grey-300 hover:bg-green-100">
        {props.avatar && <Avatar {...props.avatar} className="mb-4" />}
        <p className="flex items-center justify-center gap-1 text-label-medium">
          {props.leadingIcon}
          {props.title}
        </p>
        <p>{props.paragraph}</p>
      </div>
    </Link>
  );
}

export default EntityCard;
