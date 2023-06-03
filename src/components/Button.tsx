import clsx from 'clsx';
import React from 'react';

export type ButtonProps = {
  value?: string;
  onClick?: () => void;
  type?: 'primary' | 'primary-dark' | 'secondary' | 'tertiary' | 'cancel';
  icon?: JSX.Element;
  isSubmit?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      value,
      onClick,
      type = 'primary',
      icon,
      isSubmit,
      fullWidth,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        onClick={onClick}
        className={clsx(
          'flex items-center justify-center gap-1 rounded-full px-4 py-3 font-bold text-black transition-colors',
          props.className,
          {
            'bg-green-400 hover:bg-green-500': type === 'primary',
            'bg-green-900 text-green-300 hover:bg-black':
              type === 'primary-dark',
            'shadow-border-1px shadow-green-900 hover:bg-green-500 hover:shadow-green-500':
              type === 'secondary',
            'hover:bg-grey-200': type === 'tertiary',
            '!px-3': icon && !value,
            'w-full': fullWidth,
            '!bg-grey-300 !text-black !shadow-none': disabled,
            'bg-red text-white hover:bg-redHover': type === 'cancel',
          }
        )}
        type={isSubmit ? 'submit' : 'button'}
        disabled={disabled}
      >
        {icon} {value}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
