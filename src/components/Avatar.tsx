type Props = {
  firstName: string;
  lastName: string;
  size?: number;
};

const Avatar = (props: Props) => {
  const initials = `${props.firstName[0]}${props.lastName[0]}`;
  const size = props.size ? props.size : 50;

  return (
    <div
      className="flex items-center justify-center rounded-full bg-green-200"
      style={{
        height: size,
        width: size,
      }}
    >
      <p className="text-p-medium text-green-900">{initials}</p>
    </div>
  );
};

export default Avatar;
