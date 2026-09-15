export type Page = 'chat' | 'new' | 'history' | 'models' | 'settings' | 'help';

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

export const DEFAULT_SETTINGS: Settings = {
  fontSize: 'medium',
  animationIntensity: 'medium',
  soundEffects: false,
  enterToSend: true,
  compactMode: false,
}

export interface User {
  username: string;
  token: string; // фейковый токен для сессии
};