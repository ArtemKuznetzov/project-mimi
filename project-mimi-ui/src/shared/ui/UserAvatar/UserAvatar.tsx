import { useCallback } from "react";
import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import { cn } from "@/lib/utils";
import { mediaViewUrl, DEFAULT_AVATAR_URL } from "@/shared/lib/mediaUrls";

interface UserAvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  avatarId?: string;
}

const UserAvatar = ({ avatarId, alt, className, ...props }: UserAvatarProps) => {
  const imageUrl = mediaViewUrl(avatarId);

  const handleError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.src !== DEFAULT_AVATAR_URL) {
      img.onerror = null;
      img.src = DEFAULT_AVATAR_URL;
    }
  }, []);

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn("h-12 w-12 shrink-0 rounded-full object-cover border border-white shadow-sm", className)}
      onError={handleError}
      {...props}
    />
  );
};

export { UserAvatar };
