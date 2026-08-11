import { cn } from "@/lib/utils";
import { attachmentFrameClass, ALBUM_TILE_MIN_HEIGHT, computeAlbumRowHeight, getAlbumContainerWidth, computeAlbumLayout } from "@/features/messages/model";
import { useAlbumNaturalSizes } from "@/features/messages/model/lib/useAlbumNaturalSizes";
import { mediaViewUrl } from "@/shared/lib/mediaUrls";
import type { UiMessage } from "@/entities/message";
import { MediaImage } from "./MediaImage";
import { ImageGalleryModal } from "@/shared/ui/Modal/ImageGalleryModal";
import { useState } from "react";

type ImageBlockProps = {
  attachments: UiMessage["attachments"];
  textAndAttachments: boolean;
  attachmentOnly: boolean;
  isMine: boolean;
  embeddedInBubble?: boolean;
};

export const ImagesBlock = ({
  textAndAttachments,
  attachments,
  attachmentOnly,
  isMine,
  embeddedInBubble = false,
}: ImageBlockProps) => {
  const [openedImgIndex, setOpenedImgIndex] = useState<number | null>(null);
  const items = (attachments ?? []).filter((a) =>
    Boolean(a.objectName),
  );
  const count = items.length;

  const sources = items.map((a) => mediaViewUrl(a.objectName));
  const albumSizes = useAlbumNaturalSizes(sources);
  const loadedSizes = albumSizes.filter((s) => s !== null);

  const placeholderSizes = Array(count)
    .fill(null)
    .map(() => ({ width: 1, height: 1 }));
  const layoutSizes = loadedSizes.length > 0 ? loadedSizes : placeholderSizes;
  const albumLayout = computeAlbumLayout(layoutSizes);
  const { rowCount: rows, rowCols: colsArray, cells } = albumLayout;
  const cols = colsArray[0] ?? 1;
  const isSingle = count === 1;
  const containerMaxWidth = getAlbumContainerWidth(textAndAttachments, embeddedInBubble);

  const tileHeight =
    !isSingle && loadedSizes.length > 0
      ? computeAlbumRowHeight(loadedSizes, cols)
      : undefined;

  const frameClass = embeddedInBubble
    ? "w-full overflow-hidden"
    : attachmentOnly
      ? attachmentFrameClass(isMine)
      : "overflow-hidden rounded-lg";

  const gapClass = isSingle ? "" : "gap-0.5";

  if (count === 0) return null;

  return (
    <div className={cn("flex w-fit max-w-full min-w-0", embeddedInBubble ? "w-full" : "")}>
      <div
        className={cn(
          isSingle ? frameClass : cn("grid overflow-hidden", gapClass, !embeddedInBubble && frameClass),
          isSingle && embeddedInBubble ? "w-full" : "",
          embeddedInBubble && !isSingle && "w-full",
          isSingle && embeddedInBubble && "w-full",
        )}
        style={{
          maxWidth: embeddedInBubble ? undefined : containerMaxWidth,
          width: embeddedInBubble ? "100%" : undefined,
          ...(isSingle
            ? {}
            : {
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, ${tileHeight ?? ALBUM_TILE_MIN_HEIGHT}px)`,
              }),
        }}
      >
        {items.map((att, i) => {
          const cell = cells[i] ?? { colSpan: 1, row: 0 };
          const colSpan = cell.colSpan;
          const rowSpan = cell.rowSpan ?? 1;
          const src = mediaViewUrl(att.objectName);

          return (
            <div
              key={att.objectName}
              className={cn(!isSingle && "min-h-0 min-w-0")}
              onClick={() => setOpenedImgIndex(i)}
              style={{
                gridColumn: `span ${colSpan}`,
                ...(rowSpan > 1 ? { gridRow: `span ${rowSpan}` } : {}),
              }}
            >
              <MediaImage
                src={src}
                alt={att.fileName ?? "Attachment"}
                mode={isSingle ? "single" : "album-tile"}
                tileHeight={tileHeight}
                fillBubbleWidth={isSingle && embeddedInBubble}
                className={cn(isSingle && !embeddedInBubble && "rounded-2xl", isSingle && embeddedInBubble && "w-full", "cursor-pointer")}
              />
            </div>
          );
        })}
        <ImageGalleryModal isOpen={openedImgIndex != null} onClose={() => setOpenedImgIndex(null)} images={sources} initialIndex={openedImgIndex || 0} />
      </div>
    </div>
  );
};
