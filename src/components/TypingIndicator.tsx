import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="py-3"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-[140px] text-[11px] text-text-dim font-mono pt-0.5 select-none">
          <span>typing...</span>
        </div>
        <div className="flex-shrink-0 w-[70px]">
          <span className="text-xs font-medium text-accent">CSAI</span>
          <span className="text-text-dim ml-1">&gt;</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent/40"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
            <motion.span
              className="inline-block w-[2px] h-3.5 bg-accent ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}