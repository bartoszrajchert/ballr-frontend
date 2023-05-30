import clsx from 'clsx';

export type AvatarProps = {
  firstName: string;
  lastName: string;
  size?: number;
  className?: string;
  clickable?: boolean;
};

const Avatar = (props: AvatarProps) => {
  const initials = `${props.firstName[0]}${props.lastName[0]}`;
  const size = props.size ? props.size : 48;

  return (
    <div>
      <div
        className={clsx(
          'flex items-center justify-center rounded-full bg-green-200',
          {
            'cursor-pointer shadow-border-1px shadow-green-400 transition-colors hover:bg-green-300':
              props.clickable,
          },
          props.className
        )}
        style={{
          height: size,
          width: size,
        }}
      >
        <p className="text-label-medium text-green-900">{initials}</p>
      </div>
    </div>
  );
};

export default Avatar;
