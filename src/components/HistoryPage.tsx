import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function HistoryPage() {
  const { state, dispatch } = useStore();
  const sessions = state.sessions;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-text-bright tracking-wide">SESSION HISTORY</h2>
          <p className="text-[11px] text-text-dim mt-1">{sessions.length} session(s)</p>
        </div>

        <div className="space-y-1">
          {sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`
                group flex items-center justify-between p-3 rounded border transition-all duration-200 cursor-pointer
                ${session.id === state.activeSessionId
                  ? 'bg-accent-glow border-accent/20'
                  : 'bg-bg-panel border-bg-border hover:border-bg-borderLight hover:bg-bg-panelAlt'
                }
              `}
              onClick={() => dispatch({ type: 'SET_ACTIVE_SESSION', payload: session.id })}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-bright truncate">{session.name}</span>
                  {session.id === state.activeSessionId && (
                    <span className="text-[9px] text-accent bg-accent-glow px-1.5 py-0.5 rounded">ACTIVE</span>
                  )}
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">
                  {session.messages.length} messages · {formatDate(session.updatedAt)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'DELETE_SESSION', payload: session.id });
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 transition-all"
                title="Delete session"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim hover:text-red-400">
                  <polyline points="3,6 5,6 21,6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12 text-text-dim text-xs">
            No sessions yet. Start a new conversation.
          </div>
        )}
      </div>
    </motion.div>
  );
}