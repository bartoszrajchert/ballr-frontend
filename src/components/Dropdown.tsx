import Label from '@/components/Label';
import { InlineErrorMessage } from '@/components/messages/ErrorMessage';
import { getFieldErrorText } from '@/lib/helpers';
import { Pagination } from '@/models/base.model';
import * as Select from '@radix-ui/react-select';
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconExclamationCircle,
} from '@tabler/icons-react';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';

type Props = {
  name: string;
  control: Control<any>;
  label?: string;
  resetField?: () => void;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  rules?: RegisterOptions;
  fieldErrors?: FieldErrors<any>;
};

type FetchProps = {
  mapper: (data: any) => { label: string; value: string };
  apiURL: string;
  dataType: 'array' | 'pagination';
  queryParams?: string;
};

type StaticProps = {
  data: { label: string; value: string }[];
};

const Dropdown = (props: Props & FetchProps) => {
  const { data, isLoading, error, isValidating } = useSWR<unknown>(
    `${props.apiURL}?${props.queryParams ?? ''}`
  );

  const finalData = useMemo(() => {
    if (data === undefined) return [];

    if (props.dataType === 'array' && Array.isArray(data))
      return data.map(props.mapper);

    if (props.dataType === 'pagination' && 'items' in (data as Pagination<any>))
      return (data as Pagination<any>).items.map(props.mapper);

    return [];
  }, [data, props.dataType, props.mapper]);

  if (isLoading && !isValidating) return <Skeleton height={40} />;

  if (error) return <InlineErrorMessage error={error?.message} />;

  return <DropdownContent {...props} data={finalData} />;
};

const DropdownStatic = (props: Props & StaticProps) => {
  return <DropdownContent {...props} />;
};

const DropdownContent = (props: Props & StaticProps) => {
  const errorText = useMemo(() => {
    if (!props.fieldErrors) return undefined;

    return getFieldErrorText(props.name, props.fieldErrors);
  }, [props.fieldErrors, props.name]);

  return (
    <div className="w-full space-y-1">
      {props.label && <Label value={props.label} htmlFor={props.name} />}
      <Controller
        control={props.control}
        name={props.name}
        rules={props.rules}
        render={({ field }) => (
          <div
            className={clsx('flex flex-col gap-1', {
              '!text-red': errorText,
            })}
          >
            <Select.Root
              value={field.value}
              onValueChange={(event) => {
                field.onChange(event);
                props.onValueChange?.(event);
              }}
              name={field.name}
            >
              <Select.Trigger
                id={props.name}
                className={clsx(
                  'flex h-[48px] w-full appearance-none items-center justify-between rounded-2 px-4 shadow-border-1px outline-none transition-shadow hover:shadow-border-2px focus:shadow-border-3px focus-visible:shadow-border-3px',
                  {
                    '!shadow-red': errorText,
                    '!shadow-green-900': !errorText,
                  }
                )}
              >
                <Select.Value asChild>
                  <span>
                    {props.data.find((data) => data.value === field.value)
                      ?.label ?? (
                      <span className="text-grey-800">{props.placeholder}</span>
                    )}
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
                    <SelectItem value="">-- Puste --</SelectItem>
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
            {errorText && (
              <div className="flex gap-1 text-red">
                <IconExclamationCircle size={20} />
                <small className="text-p-small">{errorText}</small>
              </div>
            )}
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
      className="relative flex h-[48px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[35px] transition-colors data-[disabled]:pointer-events-none data-[highlighted]:bg-green-900 data-[highlighted]:text-white data-[highlighted]:outline-none sm:h-[40px]"
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

export { Dropdown, DropdownStatic };
