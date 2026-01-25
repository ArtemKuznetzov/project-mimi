import type {Message} from "@/entities/message";
import { USER_BEYZA, USER_MIFA, USER_POFU } from "@/entities/user";

export const LAST_MESSAGE_FROM_BEYZA: Message = {
  id: 1,
  user: USER_BEYZA,
  message: 'Günaydın!',
  timestamp: '10:24'
}

export const LAST_MESSAGE_FROM_POFU: Message = {
  id: 2,
  user: USER_POFU,
  message: 'Meow meow meow Beyza meow meow meow!',
  timestamp: '09:50'
}

export const LAST_MESSAGE_FROM_MIFA: Message = {
  id: 3,
  user: USER_MIFA,
  message: "YOU'VE LOST ME IN THE PYRAMID, SUKA. FIND ME",
  timestamp: 'Yesterday'
}