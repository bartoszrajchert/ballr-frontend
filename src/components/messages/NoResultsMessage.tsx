import { IconSearchOff } from '@tabler/icons-react';

type Props = {
  message?: string;
};

function NoResultsMessage({ message }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-grey-100 p-4 text-gray-400 sm:flex-row">
      <IconSearchOff className="h-[28px] w-[28px] sm:h-[48px] sm:w-[48px]" />
      <h3 className="text-center text-heading-h5 sm:text-heading-h3">
        {message ?? 'Brak wyników'}
      </h3>
    </div>
  );
}

export default NoResultsMessage;
