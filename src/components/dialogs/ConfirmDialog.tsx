import Button from '@/components/Button';
import BaseDialog from '@/components/dialogs/BaseDialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';

type Props = {
  trigger: JSX.Element;
  title: string;
  description: string;
  confirmValue: string;
  altConfirmValue?: string;
  onConfirm: () => void;
  altOnConfirm?: () => void;
};

function ConfirmDialog(props: Props) {
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
              onClick={props.altOnConfirm}
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
