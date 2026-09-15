import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Page, Message, Session, Settings, DEFAULT_SETTINGS } from './types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function generateSessionName(): string {
  const adjectives = ['silent', 'quantum', 'neural', 'dark', 'prime', 'alpha', 'zero', 'deep'];
  const nouns = ['protocol', 'channel', 'thread', 'session', 'stream', 'node', 'link'];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  return `${a}-${n}-${Math.floor(Math.random() * 999)}`;
}

function createSystemMessage(): Message {
  return {
    id: generateId(),
    role: 'system',
    content: 'Welcome to CSAI 1 (alpha).\n\nType a message to begin.\nType /help to view available commands.',
    timestamp: new Date(),
  };
}

function createSession(): Session {
  const now = new Date();
  return {
    id: generateId(),
    name: generateSessionName(),
    messages: [createSystemMessage()],
    createdAt: now,
    updatedAt: now,
  };
}

interface State {
  currentPage: Page;
  sessions: Session[];
  activeSessionId: string | null;
  settings: Settings;
  sidebarOpen: boolean;
  isLoading: boolean;
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
  | { type: 'CLEAR_SESSION'; payload: string };

const initialSession = createSession();

const initialState: State = {
  currentPage: 'chat',
  sessions: [initialSession],
  activeSessionId: initialSession.id,
  settings: DEFAULT_SETTINGS,
  sidebarOpen: false,
  isLoading: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload, sidebarOpen: false };

    case 'SET_ACTIVE_SESSION':
      return { ...state, activeSessionId: action.payload, currentPage: 'chat' };

    case 'NEW_SESSION': {
      const session = createSession();
      return {
        ...state,
        sessions: [session, ...state.sessions],
        activeSessionId: session.id,
        currentPage: 'chat',
      };
    }

    case 'ADD_MESSAGE': {
      const sessions = state.sessions.map((s) =>
        s.id === action.payload.sessionId
          ? { ...s, messages: [...s.messages, action.payload.message], updatedAt: new Date() }
          : s
      );
      return { ...state, sessions };
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'DELETE_SESSION': {
      const sessions = state.sessions.filter((s) => s.id !== action.payload);
      const activeSessionId =
        state.activeSessionId === action.payload
          ? sessions[0]?.id || null
          : state.activeSessionId;
      return { ...state, sessions, activeSessionId };
    }

    case 'CLEAR_SESSION': {
      const sessions = state.sessions.map((s) =>
        s.id === action.payload
          ? { ...s, messages: [createSystemMessage()], updatedAt: new Date() }
          : s
      );
      return { ...state, sessions };
    }

    default:
      return state;
  }
}

interface StoreContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  activeSession: Session | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId) || null;

  return (
    <StoreContext.Provider value={{ state, dispatch, activeSession }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export { generateId, generateSessionName, createSystemMessage };