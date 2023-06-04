import Button from '@/components/Button';
import BaseDialog from '@/components/dialogs/BaseDialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export type ConfirmDialogProps = {
  trigger: JSX.Element;
  title: string;
  description: string;
  confirmValue: string;
  altConfirmValue?: string;
  onConfirm?: () => void;
  onAltConfirm?: () => void;
};

function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <BaseDialog
      trigger={props.trigger}
      title={props.title}
      description={props.description}
    >
      <div className="flex flex-col gap-2 sm:flex-row-reverse sm:justify-end">
        <DialogPrimitive.Close asChild>
          <Button
            type="cancel"
            value={props.confirmValue}
            onClick={props.onConfirm}
          />
        </DialogPrimitive.Close>
        {props.altConfirmValue && (
          <DialogPrimitive.Close asChild>
            <Button
              type="cancel"
              value={props.altConfirmValue}
              onClick={props.onAltConfirm}
            />
          </DialogPrimitive.Close>
        )}
        <DialogPrimitive.Close asChild>
          <Button type="secondary" value="Anuluj" />
        </DialogPrimitive.Close>
      </div>
    </BaseDialog>
  );
}

export default ConfirmDialog;
