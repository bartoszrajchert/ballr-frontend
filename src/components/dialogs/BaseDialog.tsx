import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';

type Props = {
  trigger: JSX.Element;
  title: string;
  description: string;
  children: JSX.Element | JSX.Element[];
};

function BaseDialog(props: Props) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{props.trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-30 radix-state-open:animate-overlay-show" />
        <DialogPrimitive.Content
          className={clsx(
            'fixed z-50',
            'w-[95vw] max-w-[580px] rounded-lg px-10 py-8 md:w-full',
            'left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]',
            'bg-white',
            'radix-state-open:animate-content-show'
          )}
        >
          <DialogPrimitive.Title className="mb-2 text-heading-h3">
            {props.title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mb-6 text-p-medium">
            {props.description}
          </DialogPrimitive.Description>
          {props.children}
          <DialogPrimitive.Close
            className={clsx(
              'absolute right-3.5 top-3.5 inline-flex items-center justify-center rounded-full p-1'
            )}
          >
            <IconX className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default BaseDialog;
