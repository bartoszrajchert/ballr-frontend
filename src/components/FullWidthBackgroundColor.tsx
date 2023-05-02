import React from 'react';

type Props = {
  color: string;
};

/**
 * Full width background color.
 * Parent container must have position: relative.
 * @param {string} color - Color of the background. Example: bg-green-900
 */
const FullWidthBackgroundColor = ({ color }: Props) => {
  return (
    <span
      className={`${color} absolute bottom-0 left-[50%] top-0 -z-10 block w-[100vw] translate-x-[-50%]`}
    />
  );
};

export default FullWidthBackgroundColor;
