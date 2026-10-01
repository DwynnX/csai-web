import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Page, Message, Session, Settings, DEFAULT_SETTINGS, User } from './types';

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
  user: User | null;
  authPage: 'login' | 'register' | '2fa';
  registeredUsers: User[]; // База "зарегистрированных" пользователей
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
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_AUTH_PAGE'; payload: 'login' | 'register' | '2fa' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'TOGGLE_2FA'; payload: boolean };

const savedUser = typeof window !== 'undefined' ? localStorage.getItem('csai_current_user') : null;
const savedUsers = typeof window !== 'undefined' ? localStorage.getItem('csai_registered_users') : null;

const initialState: State = {
  currentPage: 'chat',
  sessions: [createSession()],
  activeSessionId: null,
  settings: DEFAULT_SETTINGS,
  sidebarOpen: false,
  isLoading: false,
  user: savedUser ? JSON.parse(savedUser) : null,
  authPage: 'login',
  registeredUsers: savedUsers ? JSON.parse(savedUsers) : [],
};

function reducer(state: State, action: Action): State {
  let newState = { ...state };

  switch (action.type) {
    case 'REGISTER_USER':
      newState.registeredUsers = [...state.registeredUsers, action.payload];
      localStorage.setItem('csai_registered_users', JSON.stringify(newState.registeredUsers));
      return newState;

    case 'LOGIN':
      newState.user = action.payload;
      newState.currentPage = 'chat';
      newState.sessions = [createSession()];
      newState.activeSessionId = newState.sessions[0].id;
      localStorage.setItem('csai_current_user', JSON.stringify(action.payload));
      return newState;

    case 'LOGOUT':
      newState.user = null;
      newState.authPage = 'login';
      newState.sessions = [];
      newState.activeSessionId = null;
      localStorage.removeItem('csai_current_user');
      return newState;

    case 'SET_AUTH_PAGE':
      return { ...state, authPage: action.payload };

    case 'UPDATE_PROFILE':
      if (state.user) {
        const updatedUser = { ...state.user, ...action.payload };
        const updatedUsers = state.registeredUsers.map(u => u.username === state.user!.username ? updatedUser : u);
        localStorage.setItem('csai_current_user', JSON.stringify(updatedUser));
        localStorage.setItem('csai_registered_users', JSON.stringify(updatedUsers));
        return { ...state, user: updatedUser, registeredUsers: updatedUsers };
      }
      return state;

    case 'TOGGLE_2FA':
      if (state.user) {
        const secret = action.payload ? Math.floor(100000 + Math.random() * 900000).toString() : undefined;
        const updatedUser = { ...state.user, twoFactorEnabled: action.payload, twoFactorSecret: secret };
        const updatedUsers = state.registeredUsers.map(u => u.username === state.user!.username ? updatedUser : u);
        localStorage.setItem('csai_current_user', JSON.stringify(updatedUser));
        localStorage.setItem('csai_registered_users', JSON.stringify(updatedUsers));
        return { ...state, user: updatedUser, registeredUsers: updatedUsers };
      }
      return state;

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

interface StoreContextType { state: State; dispatch: React.Dispatch<Action>; activeSession: Session | null; }
const StoreContext = createContext<StoreContextType | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId) || null;
  return <StoreContext.Provider value={{ state, dispatch, activeSession }}>{children}</StoreContext.Provider>;
}
export function useStore() { const ctx = useContext(StoreContext); if (!ctx) throw new Error('useStore must be used within StoreProvider'); return ctx; }
export { generateId };