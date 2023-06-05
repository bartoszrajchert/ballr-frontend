import { IconSearchOff } from '@tabler/icons-react';

function NoResultsMessage() {
  return (
    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-grey-100 p-4 text-gray-400">
      <IconSearchOff className="h-[28px] w-[28px] sm:h-[48px] sm:w-[48px]" />
      <h3 className="text-heading-h4 sm:text-heading-h3">Brak wyników</h3>
    </div>
  );
}

export default NoResultsMessage;
