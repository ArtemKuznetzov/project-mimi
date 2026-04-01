import { cn } from "@/lib/utils";
import { attachmentFrameClass } from "@/features/messages/model";
import { mediaViewUrl } from "@/shared/lib/mediaUrls";
import type { UiMessage } from "@/entities/message";

type ImageBlockProps = {
  attachments: UiMessage["attachments"];
  textAndAttachments: boolean;
  attachmentOnly: boolean;
  isMine: boolean;
};

export const ImagesBlock = ({ textAndAttachments, attachments, attachmentOnly, isMine }: ImageBlockProps) => {
  return (
    <div className="flex w-fit max-w-full min-w-0 flex-col gap-2">
      <div className={cn("flex flex-col gap-1.5", textAndAttachments ? "w-full max-w-[min(280px,85vw)]" : "w-full")}>
        {attachments?.map((i) => (
          <div
            key={i.objectName}
            className={attachmentOnly ? attachmentFrameClass(isMine) : "overflow-hidden rounded-lg"}
          >
            <img
              src={mediaViewUrl(i.objectName!)}
              alt={i.fileName ?? "Attachment"}
              className={cn("max-h-72 w-full object-cover", attachmentOnly ? "max-h-80" : "max-h-64")}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
