import type { User } from "@/entities/user";

export interface Dialogue {
  id: number
  user: User,
  lastMessage: string
  timestamp: string
}