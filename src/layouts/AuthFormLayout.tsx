import Button from '@/components/Button';
import MainLayout from '@/layouts/MainLayout';
import React from 'react';

type Props = {
  header: string;
  subheader: string | JSX.Element | JSX.Element[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputChildren: JSX.Element | JSX.Element[];
  buttonValue: string;
  footerChildren: JSX.Element | JSX.Element[];
  infoChildren: JSX.Element | JSX.Element[]; // TODO: delete
};

const AuthFormLayout = (props: Props) => {
  return (
    <MainLayout focusMode>
      <div className="sm:centered mt-6 sm:min-w-[400px]">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="text-heading-h2 text-green-900">{props.header}</h1>
          <p>{props.subheader}</p>
        </div>
        <form onSubmit={props.onSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">{props.inputChildren}</div>
            <Button value={props.buttonValue} isSubmit fullWidth />
          </div>
          <p className="mt-14 text-center">{props.footerChildren}</p>
        </form>
        <br />
        <hr />
        <br />
        <>{props.infoChildren}</>
      </div>
    </MainLayout>
  );
};

export default AuthFormLayout;