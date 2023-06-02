import Button from '@/components/Button';
import MainLayout from '@/layouts/MainLayout';
import clsx from 'clsx';
import React from 'react';

type Props = {
  header: string;
  subheader?: string | JSX.Element | JSX.Element[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputChildren: JSX.Element | JSX.Element[];
  buttonValue: string;
  footerChildren?: JSX.Element | JSX.Element[];
  errorMessage?: string;
  buttonDisabled?: boolean;
  buttonOnClick?: () => void;
  centered?: boolean; // default true
};

const AuthFormLayout = (props: Props) => {
  return (
    <MainLayout>
      <div
        className={clsx('mt-6 sm:min-w-[400px]', {
          'sm:centered': props.centered || props.centered === undefined,
          'm-auto sm:max-w-[400px]': !props.centered,
        })}
      >
        <div className="mb-10 space-y-2 text-center">
          <h1 className="text-heading-h2 text-green-900">{props.header}</h1>
          <p>{props.subheader}</p>
        </div>
        <form onSubmit={props.onSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">{props.inputChildren}</div>
            <Button
              value={props.buttonValue}
              isSubmit
              fullWidth
              disabled={props.buttonDisabled}
              onClick={props.buttonOnClick}
            />
            {props.errorMessage && (
              <p className="text-red">{props.errorMessage}</p>
            )}
          </div>
          <p className="mt-10 text-center">{props.footerChildren}</p>
        </form>
      </div>
    </MainLayout>
  );
};

export default AuthFormLayout;
