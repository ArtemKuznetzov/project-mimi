import {useState, useEffect, useRef } from 'react';
import { BaseModal } from './BaseModal';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';

const getGridConfig = (count: number) => {
  switch (count) {
    case 1:
      return { cols: 1, rows: 1 };
    case 2:
      return { cols: 2, rows: 1 };
    case 3:
      return { cols: 3, rows: 1 };
    case 4:
      return { cols: 2, rows: 2 };
    case 5:
    case 6:
      return { cols: 3, rows: 2 };
    case 7:
    case 8:
    case 9:
      return { cols: 3, rows: 3 };
    case 10:
      return { cols: 3, rows: 4 };
    default:
      return { cols: 3, rows: 2 };
  }
};

type ImageUploadModalProps = {
  onClose: () => void;
  onSaveInputValue: (inputValue: string) => void;
  files: File[];
  inputValue: string;
};

export const ImageUploadModal = ({ onClose, onSaveInputValue, files: files = [], inputValue }: ImageUploadModalProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const isOpen = files.length > 0;
  const count = previewUrls.length;
  const gridConfig = getGridConfig(count);

  useEffect(() => {
    if (isOpen) {
      const urls = files
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => URL.createObjectURL(f));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrls(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [files, isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload images"
      contentClassName="flex flex-col w-[420px] max-w-[95vw] h-[520px] max-h-[90vh] overflow-hidden"
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <div
          className="grid gap-0.5 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 p-2 flex-1 min-h-0"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          }}
        >
          {previewUrls.map((url) => (
            <div
              key={url}
              className="overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800 shadow-sm flex items-center justify-center"
            >
              <img
                src={url}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Input
            defaultValue={inputValue}
            ref={ref}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSaveInputValue(ref.current?.value || '')} disabled={files.length === 0}>
              Upload
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};