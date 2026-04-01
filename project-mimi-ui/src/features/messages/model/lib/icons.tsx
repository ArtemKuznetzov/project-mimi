import { AlertCircle, Check, CheckCheck, Loader2 } from "lucide-react";
import type { MessageStatus } from "@/entities/message";

const getStatusIcon = (status: MessageStatus | null, isMine: boolean, isDeleted: boolean) => {
  if (!isMine || !status || isDeleted) {
    return null;
  }
  if (status === "failed") {
    return <AlertCircle size={10} className="text-red-500" />;
  }
  if (status === "pending") {
    return <Loader2 size={10} className="animate-spin text-muted-foreground" />;
  }
  if (status === "read") {
    return <CheckCheck size={12} className="text-blue-500" />;
  }
  if (status === "sent") {
    return <Check size={12} className="text-muted-foreground" />;
  }
  return null;
};

export {getStatusIcon}