import React from 'react';

type Props = {
  value?: string;
  children?: JSX.Element | JSX.Element[];
};

function Header(props: Props) {
  return (
    <div className="mb-10 mt-4 flex w-full items-center justify-center sm:my-14">
      {props.value && (
        <h1 className=" text-heading-h2  sm:text-heading-h1">{props.value}</h1>
      )}
      {props.children}
    </div>
  );
}

export default Header;
