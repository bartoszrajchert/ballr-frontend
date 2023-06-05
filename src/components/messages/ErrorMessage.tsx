import { IconExclamationCircle } from '@tabler/icons-react';
import React from 'react';

type Props = {
  error: any;
};

function ErrorMessage({ error }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl px-4 py-8 text-center shadow-border-1px shadow-red">
      <IconExclamationCircle size={48} className="mb-2 text-red" />
      <h3 className="mb-2 text-heading-h4 text-red sm:text-heading-h3">
        Przepraszamy, wystąpił błąd
      </h3>
      <p>Prosimy spróbować ponownie później.</p>
      <p>Treść błędu: {JSON.stringify(error)}</p>
    </div>
  );
}

function InlineErrorMessage({ error }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl p-4 text-center shadow-border-1px shadow-red">
      <div className="mb-1 flex flex-col items-center gap-2 sm:flex-row">
        <IconExclamationCircle size={24} className="text-red" />
        <h3 className="text-label-medium text-red">
          Przepraszamy, wystąpił błąd
        </h3>
      </div>
      <p>Treść błędu: {JSON.stringify(error)}</p>
    </div>
  );
}

export { ErrorMessage, InlineErrorMessage };
