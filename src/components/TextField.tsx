import { IconInfoCircle } from '@tabler/icons-react';
import React, { InputHTMLAttributes } from 'react';

type Props = {
  label?: string;
  helperText?: string;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

function TextField({ helperText, ...props }: Props) {
  return (
    <div className="space-y-1">
      {props.label && <label className="text-p-small">{props.label}</label>}
      <div className="overflow-auto rounded-2 border border-green-900">
        <span className="icon leading-icon">{props.leadingIcon}</span>
        <input className="h-[48px] w-full rounded-2 px-4" {...props} />
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

export default TextField;
