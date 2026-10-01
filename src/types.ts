export type Page = 'chat' | 'new' | 'history' | 'models' | 'settings' | 'help' | 'profile';

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  fontSize: 'small' | 'medium' | 'large';
  animationIntensity: 'low' | 'medium' | 'high';
  soundEffects: boolean;
  enterToSend: boolean;
  compactMode: boolean;
}

// НОВЫЙ ИНТЕРФЕЙС ПОЛЬЗОВАТЕЛЯ
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string; // формат YYYY-MM-DD
  passwordHash: string; // фейковый хэш для локальной симуляции
  token: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string; // фейковый 6-значный код для 2FA
}

export const DEFAULT_SETTINGS: Settings = {
  fontSize: 'medium',
  animationIntensity: 'medium',
  soundEffects: false,
  enterToSend: true,
  compactMode: false,
};