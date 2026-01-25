import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils.ts";

type UserAvatarProps = ImgHTMLAttributes<HTMLImageElement>

const UserAvatar = ({src, alt, className, ...props}: UserAvatarProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-12 w-12 shrink-0 rounded-full object-cover border border-white shadow-sm", className)}
      {...props}
    />
  )
}

export { UserAvatar }