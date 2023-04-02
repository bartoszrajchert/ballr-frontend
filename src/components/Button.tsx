import React from 'react';
import clsx from 'clsx';

type Props = {
  value: string;
  type: 'primary' | 'secondary';
  onClick: () => void;
  icon?: JSX.Element;
};

function Button(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        'flex gap-1 hover:border-transparent hover:bg-green-500 px-3 py-4 rounded-full',
        {
          'bg-green-400': props.type === 'primary',
          'border border-green-900': props.type === 'secondary',
        }
      )}
    >
      {props.icon} {props.value}
    </button>
  );
}

export default Button;
