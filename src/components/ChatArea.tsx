import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import Message from './Message';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { sendMessage, processCommand } from '../services/aiService';
import { generateId } from '../store';

export default function ChatArea() {
  const { state, dispatch, activeSession } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, scrollToBottom]);

  const simulateTyping = useCallback(async (content: string, delay: number) => {
    setIsStreaming(true);
    setTypedContent('');

    const words = content.split(/(\s+)/);
    let current = '';

    for (let i = 0; i < words.length; i++) {
      current += words[i];
      setTypedContent(current);
      await new Promise((r) => setTimeout(r, delay * words[i].length));
    }

    setTypedContent('');
    setIsStreaming(false);

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        sessionId: state.activeSessionId!,
        message: {
          id: generateId(),
          role: 'assistant',
          content,
          timestamp: new Date(),
        },
      },
    });
  }, [dispatch, state.activeSessionId]);

  const handleSend = useCallback(async (text: string) => {
    if (!state.activeSessionId) return;

    // Check for commands
    const cmd = processCommand(text);
    if (cmd) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          sessionId: state.activeSessionId,
          message: {
            id: generateId(),
            role: 'user',
            content: text,
            timestamp: new Date(),
          },
        },
      });

      // Handle commands
      switch (cmd.command) {
        case 'help':
          dispatch({ type: 'SET_PAGE', payload: 'help' });
          return;
        case 'new':
          dispatch({ type: 'NEW_SESSION' });
          return;
        case 'clear':
          dispatch({ type: 'CLEAR_SESSION', payload: state.activeSessionId });
          return;
        case 'history':
          dispatch({ type: 'SET_PAGE', payload: 'history' });
          return;
        case 'model':
          dispatch({ type: 'SET_PAGE', payload: 'models' });
          return;
        case 'settings':
          dispatch({ type: 'SET_PAGE', payload: 'settings' });
          return;
        case 'about':
          await simulateTyping(
            '**CSAI 1 (alpha)**\n\nVersion: 1.0.0-alpha\nArchitecture: Transformer-based conversational AI\nMode: Cloud\nStatus: Active',
            15
          );
          return;
        default:
          await simulateTyping(
            `Unknown command: /${cmd.command}\n\nType /help for available commands.`,
            15
          );
          return;
      }
    }

    // Add user message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        sessionId: state.activeSessionId,
        message: {
          id: generateId(),
          role: 'user',
          content: text,
          timestamp: new Date(),
        },
      },
    });

    // Get AI response
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await sendMessage(text);
      setIsTyping(false);
      await simulateTyping(response.content, response.delay);
    } catch {
      setIsTyping(false);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          sessionId: state.activeSessionId!,
          message: {
            id: generateId(),
            role: 'assistant',
            content: 'Error: Failed to get response. Please try again.',
            timestamp: new Date(),
          },
        },
      });
    }
  }, [state.activeSessionId, dispatch, simulateTyping, scrollToBottom]);

  if (!activeSession) return null;

  const messages = activeSession.messages;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between px-5 py-3 border-b border-bg-border bg-bg-panel/50"
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e88f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="text-xs font-medium text-text-bright tracking-wide">CSAI 1 (alpha)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] text-text-dim tracking-wider uppercase">Active</span>
        </div>
      </motion.div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-5 py-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <Message key={msg.id} message={msg} index={i} />
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}

        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-3"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-[140px] text-[11px] text-text-dim font-mono pt-0.5 select-none">
                <span>{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div className="flex-shrink-0 w-[70px]">
                <span className="text-xs font-medium text-accent">CSAI</span>
                <span className="text-text-dim ml-1">&gt;</span>
              </div>
              <div className="flex-1 min-w-0 text-[13px] text-text leading-relaxed">
                <span>{typedContent}</span>
                <motion.span
                  className="inline-block w-[2px] h-3.5 bg-accent ml-0.5 align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping || isStreaming} />
    </div>
  );
}