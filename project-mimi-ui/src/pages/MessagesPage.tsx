import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDialogByIdQuery } from "@/features/dialogs/api/dialogsApi";
import { useGetMessagesQuery } from "@/features/messages/api/messagesApi";
import { MessageList } from "@/features/messages/ui/MessageList";
import { MessageInput } from "@/features/messages/ui/MessageInput";
import { MessageHeader } from "@/features/messages/ui/MessageHeader";
import type { MessageResponseDTO } from "@/shared/api/generated";
import { useWebsoket } from "@/shared/lib/websoket/useWebsoket";

export const MessagesPage = () => {
  const { dialogId } = useParams()
  const dialogIdInt = Number(dialogId)

  const { data: dialog } = useGetDialogByIdQuery(dialogIdInt)
  const { data: messagesData = [] } = useGetMessagesQuery(dialogIdInt)
  const [liveMessagesByDialog, setLiveMessagesByDialog] = useState<
    Record<number, MessageResponseDTO[]>
  >({})

  const handleMessage = useCallback(
    (message: MessageResponseDTO) => {
      setLiveMessagesByDialog((prev) => {
        const current = prev[dialogIdInt] ?? []
        const existsInLive = current.some((item) => item.id === message.id)
        const existsInInitial = messagesData.some((item) => item.id === message.id)
        if (existsInLive || existsInInitial) {
          return prev
        }
        return {
          ...prev,
          [dialogIdInt]: [...current, message],
        }
      })
    },
    [dialogIdInt, messagesData]
  )

  const { sendMessage, isConnected } = useWebsoket({
    dialogId: dialogIdInt,
    onMessage: handleMessage,
  })

  const messages = useMemo(() => {
    const liveMessages = liveMessagesByDialog[dialogIdInt] ?? []
    if (liveMessages.length === 0) {
      return messagesData
    }
    const merged = [...messagesData]
    for (const message of liveMessages) {
      const exists = merged.some((item) => item.id === message.id)
      if (!exists) {
        merged.push(message)
      }
    }
    return merged
  }, [dialogIdInt, liveMessagesByDialog, messagesData])

  return (
    <div className="space-y-6">
      <MessageHeader dialog={dialog} />
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} isConnected={isConnected} />
    </div>
  )
}