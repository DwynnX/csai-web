import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state } = useStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && state.settings.enterToSend) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="border-t border-bg-border bg-bg-panel/80 backdrop-blur-sm"
    >
      <div className="flex items-end gap-2 p-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm select-none pointer-events-none">
            &gt;
          </span>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="w-full pl-7 pr-3 py-2.5 bg-bg-panelAlt border border-bg-border rounded text-sm text-text placeholder:text-text-dim/50 focus:border-accent/30 focus:ring-1 focus:ring-accent/10 transition-all duration-200 disabled:opacity-50"
            style={{ minHeight: '40px', maxHeight: '160px' }}
          />
        </div>
        <motion.button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center justify-center w-9 h-9 rounded border transition-all duration-200
            ${value.trim() && !disabled
              ? 'border-accent/30 bg-accent-glow text-accent hover:bg-accent/10 hover:border-accent/50 hover:shadow-[0_0_12px_#00e88f15]'
              : 'border-bg-border text-text-dim/30 cursor-not-allowed'
            }
          `}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}