import React from 'react';
import clsx from 'clsx';

type Props = {
  value: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
  icon?: JSX.Element;
};

function Button({ value, onClick, type = 'primary', icon }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex min-w-[140px] items-center justify-center gap-1 rounded-full px-3 py-4 font-bold text-black hover:border-transparent hover:bg-green-500',
        {
          'bg-green-400': type === 'primary',
          'border border-green-900': type === 'secondary',
        }
      )}
    >
      {icon} {value}
    </button>
  );
}

export default Button;
