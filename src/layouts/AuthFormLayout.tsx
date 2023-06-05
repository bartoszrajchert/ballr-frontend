import Button from '@/components/Button';
import ConfirmDialog, {
  ConfirmDialogProps,
} from '@/components/dialogs/ConfirmDialog';
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
  cancelButtonValue?: string;
  cancelButtonOnClick?: () => void;
  confirmDialog?: Omit<
    ConfirmDialogProps,
    'trigger' | 'onConfirm' | 'altConfirmValue' | 'onAltConfirm'
  >;
};

const AuthFormLayout = (props: Props) => {
  return (
    <MainLayout>
      <div
        className={clsx({
          'sm:centered': props.centered || props.centered === undefined,
        })}
      >
        <div
          className={clsx('my-6 sm:min-w-[400px]', {
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
                <p className="mt-2 text-center text-red">
                  {props.errorMessage}
                </p>
              )}
            </div>
            {props.footerChildren && (
              <div className="mb-2 mt-10">
                <p className="text-center">{props.footerChildren}</p>
              </div>
            )}
          </form>

          {props.cancelButtonValue && (
            <>
              <hr className="my-5" />
              {props.confirmDialog && (
                <ConfirmDialog
                  trigger={
                    <Button
                      value={props.cancelButtonValue}
                      type="cancel"
                      fullWidth
                    />
                  }
                  title={props.confirmDialog.title}
                  description={props.confirmDialog.description}
                  confirmValue={props.confirmDialog.confirmValue}
                  onConfirm={props.cancelButtonOnClick}
                />
              )}
              {!props.confirmDialog && (
                <Button
                  value={props.cancelButtonValue}
                  type="cancel"
                  fullWidth
                  onClick={props.cancelButtonOnClick}
                />
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthFormLayout;
