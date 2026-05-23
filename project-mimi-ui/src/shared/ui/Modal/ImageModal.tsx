import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button, Input } from "@/shared/ui";

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

export type ImageUploadModalProps = {
  onClose: () => void;
  onSaveModalData: (input: string, files: File[]) => void;
  files: File[];
  inputValue: string;
  isOpen: boolean;
};

export const ImageUploadModal = ({ onClose, onSaveModalData, files = [], inputValue, isOpen }: ImageUploadModalProps) => {
  const [addFiles, setAddFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allFiles = useMemo(() => {
    return [...files, ...addFiles];
  }, [files, addFiles]);

  const previewUrls = useMemo(() => {
    const imageFiles = allFiles.filter((f) => f.type.startsWith("image/"));
    return imageFiles.map((f) => URL.createObjectURL(f));
  }, [allFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);

  const onFileUpload = useCallback((newFiles: File[]) => {
    setAddFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const onCloseModal = useCallback(() => {
    setAddFiles([]);
    onClose();
  }, [onClose]);

  const onMessageUpload = useCallback(() => {
    onSaveModalData(inputRef.current?.value ?? "", allFiles);
    onCloseModal();
  }, [allFiles, onCloseModal, onSaveModalData])

  const count = previewUrls.length;
  const { cols, rows } = getGridConfig(count);
  const remainder = count % cols;
  const lastIndex = count - 1;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCloseModal}
      title="Upload images"
      contentClassName="flex flex-col w-[420px] max-w-[95vw] h-[520px] max-h-[90vh] overflow-hidden"
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <div
          className="grid gap-0.5 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 p-2 flex-1 min-h-0"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {previewUrls.map((url, idx) => {
            const span = remainder !== 0 && idx === lastIndex ? cols - remainder + 1 : undefined;

            return (
              <div
                key={url}
                className="overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800 shadow-sm flex items-center justify-center"
                style={span ? { gridColumn: `span ${span}` } : undefined}
              >
                <img src={url} alt="preview" className="h-full w-full object-cover" />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <Input defaultValue={inputValue} ref={inputRef} onFileUpload={onFileUpload} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button onClick={onMessageUpload} disabled={allFiles.length === 0}>
              Upload
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};