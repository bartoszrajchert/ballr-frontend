import clsx from 'clsx';
import React from 'react';

type Props = {
  value: string;
  onClick?: () => void;
  type?: 'primary' | 'primary-dark' | 'secondary';
  icon?: JSX.Element;
  isSubmit?: boolean;
  fullWidth?: boolean;
};

function Button({
  value,
  onClick,
  type = 'primary',
  icon,
  isSubmit,
  fullWidth,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center gap-1 rounded-full px-4 py-3 font-bold text-black hover:border-transparent hover:bg-green-500',
        {
          'bg-green-400': type === 'primary',
          'bg-green-900 text-green-300 hover:bg-black': type === 'primary-dark',
          'border border-green-900': type === 'secondary',
          'w-full': fullWidth,
        }
      )}
      type={isSubmit ? 'submit' : 'button'}
    >
      {icon} {value}
    </button>
  );
}

export default Button;
