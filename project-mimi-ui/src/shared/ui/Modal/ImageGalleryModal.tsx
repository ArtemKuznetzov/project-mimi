import { useEffect, useState, useCallback } from "react";
import { BaseModal } from "./BaseModal";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui";

type ImageGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
};

export const ImageGalleryModal = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when new photo opened
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [isOpen, images.length, onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const currentImage = images[currentIndex];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="flex  flex-col w-screen max-w-none h-screen min-h-screen min-w-96 max-h-[90vh] overflow-hidden bg-black/90 p-0 border-0"
      hideCloseButton
    >
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 z-10">
        <span className="text-white/80 text-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X size={20} />
        </Button>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-0">
        <img
          src={currentImage}
          alt="attachment"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-opacity opacity-60 hover:opacity-100 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-opacity opacity-60 hover:opacity-100 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1 px-4 py-2 bg-black/50 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={img}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all",
                idx === currentIndex
                  ? "border-blue-500"
                  : "border-transparent hover:border-white/40",
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </BaseModal>
  );
};