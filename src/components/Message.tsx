import { motion } from 'framer-motion';
import { Message as MessageType } from '../types';
import { useStore } from '../store';

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function renderContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="code-block">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Process inline formatting
    let processed: React.ReactNode = line;

    // Bold: **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    const text = line;
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processInline(text.slice(lastIndex, match.index)));
      }
      parts.push(<strong key={`b-${i}-${match.index}`} className="text-text-bright font-semibold">{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(processInline(text.slice(lastIndex)));
    }

    if (parts.length > 0) {
      processed = <>{parts}</>;
    } else {
      processed = processInline(line);
    }

    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex gap-2 pl-1">
          <span className="text-text-dim select-none">•</span>
          <span>{processed}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      const rest = line.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={i} className="flex gap-2 pl-1">
          <span className="text-text-dim select-none min-w-[1.2em]">{num}.</span>
          <span>{processInline(rest)}</span>
        </div>
      );
    } else {
      elements.push(<p key={i} className="leading-relaxed">{processed}</p>);
    }
  });

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key="code-end" className="code-block">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
  }

  return <>{elements}</>;
}

function processInline(text: string): React.ReactNode {
  // Handle inline code and links
  const parts: React.ReactNode[] = [];
  const regex = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<code key={`ic-${match.index}`} className="inline-code">{match[1]}</code>);
    } else if (match[2] && match[3]) {
      parts.push(
        <a key={`link-${match.index}`} href={match[3]} className="msg-link" target="_blank" rel="noopener noreferrer">
          {match[2]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

interface MessageProps {
  message: MessageType;
  index: number;
}

export default function Message({ message, index }: MessageProps) {
  const { state } = useStore();
  const compact = state.settings.compactMode;

  const roleConfig = {
    system: { label: 'SYSTEM', color: 'text-text-dim' },
    user: { label: 'YOU', color: 'text-text-muted' },
    assistant: { label: 'CSAI', color: 'text-accent' },
  };

  const config = roleConfig[message.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`group ${compact ? 'py-1' : 'py-3'}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-[140px] text-[11px] text-text-dim font-mono pt-0.5 select-none">
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>
        <div className="flex-shrink-0 w-[70px]">
          <span className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
          <span className="text-text-dim ml-1">&gt;</span>
        </div>
        <div className="flex-1 min-w-0 text-[13px] text-text leading-relaxed">
          {renderContent(message.content)}
        </div>
      </div>
    </motion.div>
  );
}