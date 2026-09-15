import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function NewSessionPage() {
  const { dispatch } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex items-center justify-center p-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-4"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00e88f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-60">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </motion.div>
        <h2 className="text-sm font-medium text-text-bright tracking-wide mb-2">NEW SESSION</h2>
        <p className="text-xs text-text-dim mb-6">Start a fresh conversation with CSAI</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: 'NEW_SESSION' })}
          className="px-6 py-2.5 bg-accent-glow border border-accent/30 text-accent text-xs font-medium rounded hover:bg-accent/10 hover:border-accent/50 transition-all duration-200"
        >
          Create Session
        </motion.button>
      </div>
    </motion.div>
  );
}