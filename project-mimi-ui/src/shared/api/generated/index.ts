import type { components as AuthApiComponentsType } from './auth-api';
import type { components as ChatApiComponentsType } from './chat-api';

export type LoginRequestDTO = AuthApiComponentsType['schemas']['LoginRequestDTO'];
export type LoginResponseDTO = AuthApiComponentsType['schemas']['LoginResponseDTO'];
export type TokenValidationResult = AuthApiComponentsType['schemas']['TokenValidationResult'];
export type UserPublicDTO = AuthApiComponentsType['schemas']['UserPublicDTO'];

export type DialogResponseDTO = ChatApiComponentsType['schemas']['DialogResponseDTO'];
