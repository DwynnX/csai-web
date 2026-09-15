import { motion } from 'framer-motion';
import { useStore } from '../store';

const commands = [
  { cmd: '/help', desc: 'Show available commands' },
  { cmd: '/new', desc: 'Start a new session' },
  { cmd: '/clear', desc: 'Clear current conversation' },
  { cmd: '/history', desc: 'View session history' },
  { cmd: '/model', desc: 'Show current model info' },
  { cmd: '/settings', desc: 'Open settings panel' },
  { cmd: '/about', desc: 'Show information about CSAI' },
];

export default function HelpPage() {
  const { dispatch } = useStore();

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
          <h2 className="text-sm font-medium text-text-bright tracking-wide">COMMAND REFERENCE</h2>
          <p className="text-[11px] text-text-dim mt-1">Available terminal commands</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-panel border border-bg-border rounded overflow-hidden"
        >
          {commands.map((cmd, i) => (
            <motion.div
              key={cmd.cmd}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3 border-b border-bg-border last:border-b-0 hover:bg-bg-panelAlt/50 transition-colors group cursor-pointer"
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'chat' })}
            >
              <code className="text-xs text-accent font-mono min-w-[80px]">{cmd.cmd}</code>
              <span className="text-xs text-text-muted group-hover:text-text transition-colors">{cmd.desc}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-bg-panel border border-bg-border rounded"
        >
          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-2">Tips</div>
          <ul className="space-y-1.5 text-xs text-text-muted">
            <li className="flex gap-2">
              <span className="text-accent/60">▸</span>
              Type commands directly in the chat input
            </li>
            <li className="flex gap-2">
              <span className="text-accent/60">▸</span>
              Use Shift+Enter for multi-line messages
            </li>
            <li className="flex gap-2">
              <span className="text-accent/60">▸</span>
              Unknown commands will show an error with available options
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}