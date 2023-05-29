import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
  title: string;
  subtitle?: string;
  className?: string;
};

function Section(props: Props) {
  return (
    <section className={props.className}>
      <div className="mb-6 space-y-2">
        <h3 className="text-heading-h3">{props.title}</h3>
        <p>{props.subtitle}</p>
      </div>
      {props.children}
    </section>
  );
}

export default Section;
