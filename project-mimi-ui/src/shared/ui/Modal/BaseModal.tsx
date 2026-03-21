import {type ReactNode, useEffect} from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui';

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  contentClassName?: string;
  title?: string;
};

export const BaseModal = ({
  isOpen,
  onClose,
  children,
  hideCloseButton = false,
  closeOnOverlayClick = true,
  contentClassName,
  title = 'Dialog',
}: BaseModalProps) => {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'flex min-h-96 min-w-96 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900',
          contentClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && (
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X size={18} />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};