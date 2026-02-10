import { useCallback, useEffect, useRef, useState } from "react";
import { useGetDialogReadStateQuery, useMarkDialogReadMutation } from "@/features/messages/api/messagesApi";
import type { ReadReceiptEvent } from "@/shared/lib/websoket/types";

type UseDialogReadStateOptions = {
  dialogId: number;
  currentUserId: number | null;
};

type UseDialogReadStateResult = {
  otherLastReadMessageId: number | null;
  onReadCandidate: (messageId: number) => void;
  onReadReceipt: (event: ReadReceiptEvent) => void;
};

const READ_THROTTLE_MS = 600;

export const useDialogReadState = ({
  dialogId,
  currentUserId,
}: UseDialogReadStateOptions): UseDialogReadStateResult => {
  const shouldSkip = !Number.isFinite(dialogId) || currentUserId === null;
  const { data: readState } = useGetDialogReadStateQuery(dialogId, { skip: shouldSkip });
  const [markDialogRead] = useMarkDialogReadMutation();

  const [otherLastReadMessageId, setOtherLastReadMessageId] = useState<number | null>(null);
  const lastReadMessageIdRef = useRef<number>(0);
  const pendingMaxRef = useRef<number | null>(null);
  const flushTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOtherLastReadMessageId(null);
    lastReadMessageIdRef.current = 0;
    pendingMaxRef.current = null;
  }, [dialogId]);

  useEffect(() => {
    if (!readState) {
      return;
    }
    if (typeof readState.lastReadMessageId === "number") {
      lastReadMessageIdRef.current = Math.max(lastReadMessageIdRef.current, readState.lastReadMessageId);
    }
    if (typeof readState.otherLastReadMessageId === "number") {
      const otherId = readState.otherLastReadMessageId
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOtherLastReadMessageId((prev) =>
        prev === null ? otherId : Math.max(prev, otherId),
      );
    }
  }, [readState]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, []);

  const flush = useCallback(async () => {
    const pending = pendingMaxRef.current;
    if (pending === null || shouldSkip) {
      return;
    }
    pendingMaxRef.current = null;
    try {
      const response = await markDialogRead({ dialogId, lastReadMessageId: pending }).unwrap();
      if (typeof response.lastReadMessageId === "number") {
        lastReadMessageIdRef.current = Math.max(lastReadMessageIdRef.current, response.lastReadMessageId);
      }
      if (typeof response.otherLastReadMessageId === "number") {
        const otherId = response.otherLastReadMessageId;

        setOtherLastReadMessageId(prev =>
          prev === null ? otherId : Math.max(prev, otherId)
        );
      }
    } catch {
      pendingMaxRef.current = Math.max(pendingMaxRef.current ?? 0, pending);
    }
  }, [dialogId, markDialogRead, shouldSkip]);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current !== null) {
      return;
    }
    flushTimerRef.current = window.setTimeout(() => {
      flushTimerRef.current = null;
      void flush();
    }, READ_THROTTLE_MS);
  }, [flush]);

  const onReadCandidate = useCallback(
    (messageId: number) => {
      if (shouldSkip || !Number.isFinite(messageId) || messageId <= 0) {
        return;
      }
      if (messageId <= lastReadMessageIdRef.current) {
        return;
      }
      pendingMaxRef.current = Math.max(pendingMaxRef.current ?? 0, messageId);
      scheduleFlush();
    },
    [scheduleFlush, shouldSkip],
  );

  const onReadReceipt = useCallback(
    (event: ReadReceiptEvent) => {
      if (shouldSkip || event.dialogId !== dialogId || event.userId === currentUserId) {
        return;
      }
      if (!Number.isFinite(event.lastReadMessageId)) {
        return;
      }
      setOtherLastReadMessageId((prev) =>
        prev === null ? event.lastReadMessageId : Math.max(prev, event.lastReadMessageId),
      );
    },
    [dialogId, currentUserId, shouldSkip],
  );

  return { otherLastReadMessageId, onReadCandidate, onReadReceipt };
};
