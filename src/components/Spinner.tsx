import { IconBallFootball } from '@tabler/icons-react';

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-green-900">
      <div className="flex w-fit animate-spin ">
        <IconBallFootball />
      </div>
      <p className="text-label-medium">Ładowanie...</p>
    </div>
  );
}

export default Spinner;
