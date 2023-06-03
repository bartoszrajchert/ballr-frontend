import * as PrimitiveTooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';

type Props = {
  trigger: JSX.Element;
  children: JSX.Element | JSX.Element[];
  delay?: number;
};

function Tooltip(props: Props) {
  return (
    <PrimitiveTooltip.Provider delayDuration={props.delay}>
      <PrimitiveTooltip.Root>
        <PrimitiveTooltip.Trigger asChild>
          {props.trigger}
        </PrimitiveTooltip.Trigger>
        <PrimitiveTooltip.Content
          sideOffset={4}
          side="bottom"
          className={clsx(
            'radix-side-top:animate-slide-down-fade',
            'radix-side-right:animate-slide-left-fade',
            'radix-side-bottom:animate-slide-up-fade',
            'radix-side-left:animate-slide-right-fade',
            'inline-flex items-center rounded-md px-4 py-2.5',
            'bg-white shadow'
          )}
        >
          {props.children}
        </PrimitiveTooltip.Content>
      </PrimitiveTooltip.Root>
    </PrimitiveTooltip.Provider>
  );
}

export default Tooltip;
