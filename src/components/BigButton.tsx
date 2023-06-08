import clsx from 'clsx';
import React from 'react';

type Props = {
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
};

const BigButton = (props: Props) => {
  return (
    <button
      className={clsx(
        'space-y-1.5 rounded-2xl border border-green-900 p-6 text-left transition-colors',
        props.className,
        {
          'hover:bg-green-100': props.onClick,
        }
      )}
      onClick={props.onClick}
    >
      <p className="text-label-large">{props.title}</p>
      <p>{props.description}</p>
    </button>
  );
};

export default BigButton;
