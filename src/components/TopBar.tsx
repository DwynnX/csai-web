import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function TopBar() {
  const { dispatch } = useStore();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-between h-10 px-4 bg-bg-panel border-b border-bg-border select-none"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-5 h-5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e88f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xs font-medium tracking-wide text-text-bright">
          CSAI 1 <span className="text-text-dim">(alpha)</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => {}}
          className="flex items-center justify-center w-7 h-7 rounded hover:bg-bg-borderLight transition-colors duration-200 group"
          title="Minimize"
        >
          <div className="w-2.5 h-[1.5px] bg-text-dim group-hover:bg-text-muted transition-colors" />
        </button>
        <button
          onClick={() => {}}
          className="flex items-center justify-center w-7 h-7 rounded hover:bg-bg-borderLight transition-colors duration-200 group"
          title="Maximize"
        >
          <div className="w-2.5 h-2.5 border border-text-dim group-hover:border-text-muted rounded-[1px] transition-colors" />
        </button>
        <button
          onClick={() => {}}
          className="flex items-center justify-center w-7 h-7 rounded hover:bg-red-500/20 transition-colors duration-200 group"
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-text-dim group-hover:text-red-400 transition-colors">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}