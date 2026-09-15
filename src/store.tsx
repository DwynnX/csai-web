import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Page, Message, Session, Settings, DEFAULT_SETTINGS, User } from './types';

// ... (функции generateId, generateSessionName, createSystemMessage, createSession остаются без изменений) ...
function generateId(): string { return Math.random().toString(36).substring(2, 10) + Date.now().toString(36); }
function generateSessionName(): string {
  const adj = ['silent', 'quantum', 'neural', 'dark', 'prime'];
  const noun = ['protocol', 'channel', 'thread', 'session'];
  return `${adj[Math.floor(Math.random()*adj.length)]}-${noun[Math.floor(Math.random()*noun.length)]}-${Math.floor(Math.random()*999)}`;
}
function createSystemMessage(): Message {
  return { id: generateId(), role: 'system', content: 'Welcome to CSAI 1 (alpha).\n\nType a message to begin.\nType /help to view available commands.', timestamp: new Date() };
}
function createSession(): Session {
  const now = new Date();
  return { id: generateId(), name: generateSessionName(), messages: [createSystemMessage()], createdAt: now, updatedAt: now };
}

interface State {
  currentPage: Page;
  sessions: Session[];
  activeSessionId: string | null;
  settings: Settings;
  sidebarOpen: boolean;
  isLoading: boolean;
  user: User | null; // <-- НОВОЕ ПОЛЕ
  authPage: 'login' | 'register'; // <-- Для переключения между входом и регистрацией
}

type Action =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'SET_ACTIVE_SESSION'; payload: string }
  | { type: 'NEW_SESSION' }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'CLEAR_SESSION'; payload: string }
  | { type: 'LOGIN'; payload: User } // <-- НОВОЕ
  | { type: 'LOGOUT' } // <-- НОВОЕ
  | { type: 'SET_AUTH_PAGE'; payload: 'login' | 'register' }; // <-- НОВОЕ

const initialSession = createSession();

// Загружаем пользователя из localStorage при старте
const savedUser = typeof window !== 'undefined' ? localStorage.getItem('csai_user') : null;

const initialState: State = {
  currentPage: 'chat',
  sessions: [initialSession],
  activeSessionId: initialSession.id,
  settings: DEFAULT_SETTINGS,
  sidebarOpen: false,
  isLoading: false,
  user: savedUser ? JSON.parse(savedUser) : null,
  authPage: 'login',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('csai_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, currentPage: 'chat' };
    case 'LOGOUT':
      localStorage.removeItem('csai_user');
      return { ...state, user: null, currentPage: 'chat', sessions: [createSession()], activeSessionId: null };
    case 'SET_AUTH_PAGE':
      return { ...state, authPage: action.payload };
    // ... остальные case остаются как были ...
    case 'SET_PAGE': return { ...state, currentPage: action.payload, sidebarOpen: false };
    case 'SET_ACTIVE_SESSION': return { ...state, activeSessionId: action.payload, currentPage: 'chat' };
    case 'NEW_SESSION': { const s = createSession(); return { ...state, sessions: [s, ...state.sessions], activeSessionId: s.id, currentPage: 'chat' }; }
    case 'ADD_MESSAGE': { const sessions = state.sessions.map(s => s.id === action.payload.sessionId ? { ...s, messages: [...s.messages, action.payload.message], updatedAt: new Date() } : s); return { ...state, sessions }; }
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'DELETE_SESSION': { const sessions = state.sessions.filter(s => s.id !== action.payload); return { ...state, sessions, activeSessionId: state.activeSessionId === action.payload ? sessions[0]?.id || null : state.activeSessionId }; }
    case 'CLEAR_SESSION': { const sessions = state.sessions.map(s => s.id === action.payload ? { ...s, messages: [createSystemMessage()], updatedAt: new Date() } : s); return { ...state, sessions }; }
    default: return state;
  }
}

// ... StoreProvider и useStore остаются без изменений ...
interface StoreContextType { state: State; dispatch: React.Dispatch<Action>; activeSession: Session | null; }
const StoreContext = createContext<StoreContextType | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId) || null;
  return <StoreContext.Provider value={{ state, dispatch, activeSession }}>{children}</StoreContext.Provider>;
}
export function useStore() { const ctx = useContext(StoreContext); if (!ctx) throw new Error('useStore must be used within StoreProvider'); return ctx; }
export { generateId };