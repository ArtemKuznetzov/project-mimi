import { MessageList } from "@/features/messages/ui/MessageList";
import { MessageInput } from "@/features/messages/ui/MessageInput";
import { MessageHeader } from "@/features/messages/ui/MessageHeader";
import {useParams} from "react-router-dom";
import {useGetDialogByIdQuery} from "@/features/dialogs/api/dialogsApi";

export const MessagesPage = () => {
  const { dialogId } = useParams()
  const dialogIdInt = Number(dialogId)

  const { data } = useGetDialogByIdQuery(dialogIdInt)

  return (
    <div className="space-y-6">
      <MessageHeader dialog={data} />
      <MessageList dialogId={dialogIdInt} />
      <MessageInput/>
    </div>
  )
}