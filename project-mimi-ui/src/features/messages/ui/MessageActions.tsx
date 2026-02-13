import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type MessageActionsProps = {
  x: number;
  y: number;
  onClose: () => void;
  canReply?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const MessageActions = ({
  x,
  y,
  onClose,
  canReply = true,
  canEdit = true,
  canDelete = true,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x, y });

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }
    const { offsetWidth, offsetHeight } = menu;
    const nextX = Math.max(8, Math.min(x, window.innerWidth - offsetWidth - 8));
    const nextY = Math.max(8, Math.min(y, window.innerHeight - offsetHeight - 8));
    setPosition({ x: nextX, y: nextY });
  }, [x, y]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const handleScroll = () => onClose();

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  const handleAction = (action?: () => void) => () => {
    action?.();
    onClose();
  };

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      style={{ left: position.x, top: position.y }}
      className={cn(
        "fixed z-50 min-w-[160px] rounded-md border border-gray-200 bg-white p-1 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900",
      )}
    >
      {canReply ? (
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={handleAction(onReply)}
        >
          Reply
        </button>
      ) : null}
      {canEdit ? (
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={handleAction(onEdit)}
        >
          Edit
        </button>
      ) : null}
      {canDelete ? (
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          onClick={handleAction(onDelete)}
        >
          Delete
        </button>
      ) : null}
    </div>,
    document.body,
  );
};
