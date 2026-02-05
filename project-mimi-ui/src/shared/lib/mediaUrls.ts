import { apiBaseUrl } from "@/shared/config/api";

export const DEFAULT_AVATAR_URL = "/images/DefaultAvatarPic.jpg";

export const mediaViewUrl = (id?: string) => (id ? `${apiBaseUrl}/files/view/${id}` : DEFAULT_AVATAR_URL);

export const mediaDownloadUrl = (id: string) => `${apiBaseUrl}/files/download/${id}`;
