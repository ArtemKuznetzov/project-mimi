import { type InputHTMLAttributes, forwardRef, useRef, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import { Button } from "@/shared/ui";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onFileUpload?: (files: File[]) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", onFileUpload, ...props }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onAttachClick = () => {
    if (onFileUpload) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onFileUpload?.(files);
    e.target.value = "";
  }

  return (
    <div className="flex w-full relative">
      <input
        type={type}
        className={cn(
          "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
      {onFileUpload && (
        <>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onAttachClick}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Paperclip size={20} />
        </Button>
      </>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
