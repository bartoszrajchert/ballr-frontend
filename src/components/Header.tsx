import React from 'react';

type Props = {
  value: string;
};

function Header(props: Props) {
  return (
    <h1 className="mb-10 mt-4 text-center text-heading-h2 sm:my-14 sm:text-heading-h1">
      {props.value}
    </h1>
  );
}

export default Header;
