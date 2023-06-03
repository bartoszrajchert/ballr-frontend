import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import footballImage1 from '../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

type Props = {
  href: string;
  title: string;
  description: (string | null)[];
  tags?: (string | null)[];
};

function Tile(props: Props) {
  return (
    <Link href={props.href}>
      <div className="flex w-full cursor-pointer flex-col gap-5 rounded-2xl border border-gray-300 bg-grey-100 p-4 hover:bg-green-100 sm:flex-row">
        <div className="relative h-full w-full sm:w-[220px]">
          <Image
            className="aspect-video rounded-2xl bg-green-900 object-cover"
            src={footballImage1}
            quality={20}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between gap-3">
          <div>
            <h3 className="mb-1 text-label-medium">{props.title}</h3>
            {props.description.map(
              (description) =>
                description && <p key={description}>{description}</p>
            )}
          </div>
          <div className="flex gap-1">
            {props.tags?.map((tag) => tag && <Tag key={tag} text={tag} />)}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <div className="w-fit rounded-full border border-grey-600 px-2 py-1">
      <p className="text-label-small text-green-900">{text}</p>
    </div>
  );
}

export default Tile;
