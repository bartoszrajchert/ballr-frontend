import * as RadixLabel from '@radix-ui/react-label';
import React from 'react';

type Props = {
  value: string;
  htmlFor: string;
};

const Label = (props: Props) => {
  return (
    <RadixLabel.Root className="text-p-small" htmlFor={props.htmlFor}>
      {props.value}
    </RadixLabel.Root>
  );
};

export default Label;
