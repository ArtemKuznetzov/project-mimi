import { MessageList } from "@/features/messages/ui/MessageList.tsx";
import { MessageInput } from "@/features/messages/ui/MessageInput.tsx";
import { MessageHeader } from "@/features/messages/ui/MessageHeader.tsx";

export const MessagesPage = () => {
  return (
    <div className="space-y-6">
      <MessageHeader />
      <MessageList/>
      <MessageInput/>
    </div>
  )
}