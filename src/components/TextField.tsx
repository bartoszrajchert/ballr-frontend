import Label from '@/components/Label';
import { IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

type Props = {
  label?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = React.forwardRef<HTMLInputElement, Props>(
  ({ helperText, errorText, ...props }, ref) => {
    return (
      <div
        className={clsx('w-full space-y-1', {
          'text-red': errorText,
        })}
      >
        {props.label && (
          <Label value={props.label} htmlFor={props.name ?? ''} />
        )}
        <div className={'overflow-auto'}>
          <span className="icon leading-icon">{props.leadingIcon}</span>
          <input
            ref={ref}
            id={props.name}
            className={clsx(
              'h-[48px] w-full appearance-none rounded-2 px-4 shadow-border-1px outline-none transition-shadow hover:shadow-border-2px focus:shadow-border-3px focus-visible:shadow-border-3px',
              {
                '!shadow-red': errorText,
                '!shadow-green-900': !errorText,
              }
            )}
            {...props}
          />
          <span className="icon trailing-icon">{props.trailingIcon}</span>
        </div>
        {helperText && (
          <div className="flex gap-1">
            <IconInfoCircle size={20} />
            <small className="text-p-small">{helperText}</small>
          </div>
        )}
        {errorText && (
          <div className="flex gap-1 text-red">
            <IconExclamationCircle size={20} />
            <small className="text-p-small">{errorText}</small>
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
