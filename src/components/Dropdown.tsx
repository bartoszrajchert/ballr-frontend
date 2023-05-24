import Label from '@/components/Label';
import * as Select from '@radix-ui/react-select';
import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

type Props = {
  name: string;
  control: Control;
  data: { label: string; value: string }[];
  label?: string;
  resetField?: () => void;
};

const Dropdown = (props: Props) => {
  return (
    <div className="w-full space-y-1">
      {props.label && <Label value={props.label} htmlFor={props.name} />}
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <div className="flex gap-1">
            <Select.Root
              value={field.value}
              onValueChange={field.onChange}
              name={field.name}
            >
              <Select.Trigger
                id={props.name}
                className="flex h-[48px] w-full appearance-none items-center justify-between rounded-2 px-4 shadow-border-1px outline-none transition-shadow hover:shadow-border-2px focus:shadow-border-3px focus-visible:shadow-border-3px"
              >
                <Select.Value asChild>
                  <span>
                    {
                      props.data.find((data) => data.value === field.value)
                        ?.label
                    }
                  </span>
                </Select.Value>

                <Select.Icon>
                  <IconChevronDown />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="w-full rounded-md border border-green-900 bg-white">
                  <Select.ScrollUpButton className="m-1 flex h-[25px] cursor-default items-center justify-center bg-white">
                    <IconChevronUp />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    {props.data.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="m-1 flex h-[25px] cursor-default items-center justify-center bg-white">
                    <IconChevronDown />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        )}
      />
    </div>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>((props, ref) => {
  return (
    <Select.Item
      className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] data-[disabled]:pointer-events-none data-[highlighted]:bg-green-900 data-[highlighted]:text-white data-[highlighted]:outline-none"
      ref={ref}
      {...props}
    >
      <Select.ItemText>{props.children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <IconCheck size={16} />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = 'SelectItem';

export default Dropdown;
