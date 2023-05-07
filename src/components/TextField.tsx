import { IconInfoCircle } from '@tabler/icons-react';
import React, { InputHTMLAttributes } from 'react';

type Props = {
  label?: string;
  helperText?: string;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = React.forwardRef<HTMLInputElement, Props>(
  ({ helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {props.label && <label className="text-p-small">{props.label}</label>}
        <div className="overflow-auto rounded-2 border border-green-900">
          <span className="icon leading-icon">{props.leadingIcon}</span>
          <input
            ref={ref}
            className="h-[48px] w-full rounded-2 px-4"
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
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
