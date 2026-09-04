import { useImageNaturalSize, type NaturalSize } from "@/features/messages/model/lib/useImageNaturalSize";
import { fitSingleMediaSize } from "@/features/messages/model";
import { cn } from "@/lib/utils";
import { chatTokens } from "@/features/messages/model/lib/chatTokens";
import type { CSSProperties } from "react";

type MediaImageProps = {
  src: string;
  alt: string;
  mode: "single" | "album-tile";
  tileHeight?: number;
  /** For 1 photo and message */
  fillBubbleWidth?: boolean;
  className?: string;
};

type GetMediaBoxStyleProps = {
  isSingle: boolean;
  natural: NaturalSize | null;
  singleSize: { width: number; height: number } | null;
  fillBubbleWidth: boolean | undefined;
  tileHeight: number | undefined;
};

const getMediaBoxStyle = ({ 
  isSingle, 
  natural, 
  singleSize, 
  fillBubbleWidth, 
  tileHeight 
}: GetMediaBoxStyleProps): CSSProperties => {
  if (!isSingle) {
    return tileHeight
      ? { width: "100%", height: tileHeight }
      : { width: "100%", aspectRatio: "4 / 3" };
  }
  if (!natural) {
    return { width: "100%", minHeight: 150 };
  }
  if (fillBubbleWidth) {
    return {
      width: "100%",
      aspectRatio: `${natural.width} / ${natural.height}`,
      maxHeight: 380,
      maxWidth: 280,
    };
  }
  if (singleSize) {
    return { width: singleSize.width, height: singleSize.height, maxWidth: "100%" };
  }
  return {};
}

export const MediaImage = ({ src, alt, mode, tileHeight, fillBubbleWidth, className }: MediaImageProps) => {
  const natural = useImageNaturalSize(src);
  const isSingle = mode === "single";

  const singleSize = natural && isSingle && !fillBubbleWidth ? fitSingleMediaSize(natural.width, natural.height) : null;

  return (
    <div
      className={cn("relative overflow-hidden dark:bg-[#2A3942]", !natural && "animate-pulse", className)}
      style={{
        backgroundColor: !natural ? undefined : chatTokens.mediaPlaceholder.light,
        ...getMediaBoxStyle({ isSingle, natural, singleSize, fillBubbleWidth, tileHeight })
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "block h-full w-full object-cover",
          !natural && "opacity-0",
          natural && "opacity-100 transition-opacity duration-200",
        )}
      />
    </div>
  );
};
