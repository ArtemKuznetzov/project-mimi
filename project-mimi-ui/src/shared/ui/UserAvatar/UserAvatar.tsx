import { useState, useCallback, useEffect } from "react";
import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils.ts";
import { mediaViewUrl, DEFAULT_AVATAR_URL } from "@/shared/lib/mediaUrls";

interface UserAvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  avatarId?: string;
}

const UserAvatar = ({ avatarId, alt, className, ...props }: UserAvatarProps) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const imageUrl = mediaViewUrl(avatarId);

  useEffect(() => {
    setLoadFailed(false);
  }, [avatarId]);

  const handleError = useCallback(() => {
    setLoadFailed(true);
  }, []);

  return (
    <img
      src={loadFailed ? DEFAULT_AVATAR_URL : imageUrl}
      alt={alt}
      className={cn("h-12 w-12 shrink-0 rounded-full object-cover border border-white shadow-sm", className)}
      onError={handleError}
      {...props}
    />
  );
};

export { UserAvatar }