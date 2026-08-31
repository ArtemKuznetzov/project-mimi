import type { components as AuthApiComponentsType } from "./auth-api";
import type { components as ChatApiComponentsType } from "./chat-api";
import type { components as ChatWsComponentsType } from './chat-ws'

export type LoginRequestDTO = AuthApiComponentsType["schemas"]["LoginRequestDTO"];
export type LoginResponseDTO = AuthApiComponentsType["schemas"]["LoginResponseDTO"];
export type TokenValidationResultDTO = AuthApiComponentsType["schemas"]["TokenValidationResultDTO"];
export type UserPublicDTO = AuthApiComponentsType["schemas"]["UserPublicDTO"];

export type DialogResponseDTO = ChatApiComponentsType["schemas"]["DialogResponseDTO"];
export type DialogReadStateDTO = ChatApiComponentsType["schemas"]["DialogReadStateDTO"];
export type MessageResponseDTO = ChatApiComponentsType["schemas"]["MessageResponseDTO"];

export type MessageReactionResponseDTO = ChatWsComponentsType["schemas"]["MessageReactionResponseDTO"];
export type MessageReactionDTO = ChatWsComponentsType["schemas"]["MessageReactionDTO"]
export type ReactionGroup = ChatWsComponentsType["schemas"]["ReactionGroup"]
