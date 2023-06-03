import Avatar from '@/components/Avatar';
import Header from '@/components/Header';

type Props = {
  avatarText: string;
  title: string;
  subtitle: string;
  children?: JSX.Element | JSX.Element[];
};

function AvatarHeader(props: Props) {
  return (
    <Header>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Avatar text={`${props.avatarText}`} size={60} />
        <div>
          <p>{props.subtitle}</p>
          <h1 className="text-heading-h2">{props.title}</h1>
        </div>
        {props.children}
      </div>
    </Header>
  );
}

export default AvatarHeader;
