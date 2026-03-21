import { BaseModal } from './BaseModal';
import { Button } from '@/shared/ui';

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
}: ConfirmModalProps) => (
  <BaseModal isOpen={isOpen} onClose={onCancel} hideCloseButton title={title}>
    <div className="flex flex-col gap-4">
      <h2 id="confirm-modal-title" className="text-xl font-semibold">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm}>{confirmText}</Button>
      </div>
    </div>
  </BaseModal>
);