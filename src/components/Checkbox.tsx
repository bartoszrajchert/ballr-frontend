import Label from '@/components/Label';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { IconCheck } from '@tabler/icons-react';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
  control: Control;
};

const Checkbox = (props: Props) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <RadixCheckbox.Root
            {...field}
            checked={field.value}
            onCheckedChange={field.onChange}
            id={props.name}
            className=" flex h-[24px] w-[24px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-border-2px !shadow-green-900 outline-none transition-shadow hover:shadow-border-3px"
          >
            <RadixCheckbox.Indicator className="bg-green-900 text-white">
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
