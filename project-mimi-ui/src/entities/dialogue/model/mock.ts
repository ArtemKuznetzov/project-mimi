import type { Dialogue } from "@/entities/dialogue";
import { USER_BEYZA, USER_MIFA, USER_POFU } from "@/entities/user";
import { LAST_MESSAGE_FROM_BEYZA, LAST_MESSAGE_FROM_MIFA, LAST_MESSAGE_FROM_POFU } from "@/entities/message";

export const DIALOGUES: Dialogue[] = [
  {
    id: 1,
    user: USER_BEYZA,
    lastMessage: LAST_MESSAGE_FROM_BEYZA.message,
    timestamp: LAST_MESSAGE_FROM_BEYZA.timestamp
  },
  {
    id: 2,
    user: USER_POFU,
    lastMessage: LAST_MESSAGE_FROM_POFU.message,
    timestamp: LAST_MESSAGE_FROM_POFU.timestamp
  },
  {
    id: 3,
    user: USER_MIFA,
    lastMessage: LAST_MESSAGE_FROM_MIFA.message,
    timestamp: LAST_MESSAGE_FROM_MIFA.timestamp
  }
]