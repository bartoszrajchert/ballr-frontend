import clsx from 'clsx';

type Props = {
  header: string;
  body: string;
  className?: any;
};

const TextInformation = (props: Props) => {
  return (
    <div
      className={clsx('rounded-xl bg-grey-100 p-6 text-center', {
        [props.className]: props.className,
      })}
    >
      <p className="text-label-medium">{props.header}</p>
      <p>{props.body}</p>
    </div>
  );
};

export default TextInformation;
