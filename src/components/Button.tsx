import clsx from 'clsx';
import React from 'react';

type Props = {
  value?: string;
  onClick?: () => void;
  type?: 'primary' | 'primary-dark' | 'secondary' | 'tertiary';
  icon?: JSX.Element;
  isSubmit?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
};

function Button({
  value,
  onClick,
  type = 'primary',
  icon,
  isSubmit,
  fullWidth,
  disabled,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center gap-1 rounded-full px-4 py-3 font-bold text-black transition-colors hover:border-transparent',
        {
          'bg-green-400 hover:bg-green-500': type === 'primary',
          'bg-green-900 text-green-300 hover:bg-black': type === 'primary-dark',
          'border border-green-900 hover:bg-green-500': type === 'secondary',
          'hover:bg-grey-200': type === 'tertiary',
          '!px-3': icon && !value,
          'w-full': fullWidth,
          '!bg-grey-300 !text-black': disabled,
        }
      )}
      type={isSubmit ? 'submit' : 'button'}
      disabled={disabled}
    >
      {icon} {value}
    </button>
  );
}

export default Button;
