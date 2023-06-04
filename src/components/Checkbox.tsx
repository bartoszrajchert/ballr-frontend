import Label from '@/components/Label';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { IconCheck } from '@tabler/icons-react';
import clsx from 'clsx';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
  control: Control<any>;
  disabled?: boolean;
};

const Checkbox = (props: Props) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <div
          className={clsx('flex items-center gap-2', {
            '!text-grey-400': props.disabled,
          })}
        >
          <RadixCheckbox.Root
            {...field}
            checked={String(field.value) === 'true'}
            onCheckedChange={field.onChange}
            id={props.name}
            className={clsx(
              'flex h-[24px] w-[24px] appearance-none items-center justify-center rounded-[4px]',
              'bg-white shadow-border-2px !shadow-green-900 outline-none',
              'transition-shadow hover:shadow-border-3px',
              {
                '!shadow-grey-400 hover:!shadow-border-2px': props.disabled,
              }
            )}
            disabled={props.disabled}
          >
            <RadixCheckbox.Indicator
              className={clsx('bg-green-900 text-white', {
                'bg-grey-400': props.disabled,
              })}
            >
              <IconCheck size={20} />
            </RadixCheckbox.Indicator>
          </RadixCheckbox.Root>
          <Label value={props.label} htmlFor={props.name} />
        </div>
      )}
    />
  );
};

export default Checkbox;
