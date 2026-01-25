import type { User } from "@/entities/user";

export interface Message {
  id: number
  user: User
  message: string
  timestamp: string
}