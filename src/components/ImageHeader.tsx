import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import footballImage1 from '../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

type Props = {
  href: string;
  hrefText: string;
  title: string;
  iconDetails: {
    icon: JSX.Element;
    text: string;
  }[];
  children?: JSX.Element | JSX.Element[];
};

function ImageHeader(props: Props) {
  return (
    <section className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-2">
      <Image
        className="aspect-video rounded-2xl bg-green-900 object-cover"
        src={footballImage1}
        quality={20}
        alt=""
      />
      <div className="my-auto space-y-6 lg:px-10">
        <div className="flex flex-col gap-2">
          <div>
            <Link className="link --underline" href={props.href}>
              {props.hrefText}
            </Link>
          </div>
          <h1 className="text-heading-h3">{props.title}</h1>
        </div>

        <div className="flex flex-col gap-1">
          {props.iconDetails.map((iconDetail, index) => (
            <div key={index} className="flex gap-3">
              {iconDetail.icon}
              <p>{iconDetail.text}</p>
            </div>
          ))}
        </div>

        {props.children}
      </div>
    </section>
  );
}

export default ImageHeader;
