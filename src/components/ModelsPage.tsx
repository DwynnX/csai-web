import { motion } from 'framer-motion';

const modelInfo = {
  name: 'CSAI 1 (alpha)',
  architecture: 'Transformer-based Conversational AI',
  mode: 'Cloud',
  version: '1.0.0-alpha',
  contextWindow: '128K tokens',
  capabilities: [
    'Natural language understanding',
    'Code generation and analysis',
    'Technical documentation',
    'Multi-turn conversation',
    'Structured data processing',
  ],
};

export default function ModelsPage() {
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
          <h2 className="text-sm font-medium text-text-bright tracking-wide">MODEL INFORMATION</h2>
          <p className="text-[11px] text-text-dim mt-1">Active model configuration</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-panel border border-bg-border rounded p-5 space-y-4"
        >
          <div>
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Model</div>
            <div className="text-sm text-text-bright font-medium">{modelInfo.name}</div>
          </div>

          <div className="border-t border-bg-border pt-4">
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Architecture</div>
            <div className="text-xs text-text">{modelInfo.architecture}</div>
          </div>

          <div className="border-t border-bg-border pt-4">
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Mode</div>
            <div className="text-xs text-text flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {modelInfo.mode}
            </div>
          </div>

          <div className="border-t border-bg-border pt-4">
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Version</div>
            <div className="text-xs text-text">{modelInfo.version}</div>
          </div>

          <div className="border-t border-bg-border pt-4">
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Context Window</div>
            <div className="text-xs text-text">{modelInfo.contextWindow}</div>
          </div>

          <div className="border-t border-bg-border pt-4">
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-2">Capabilities</div>
            <ul className="space-y-1.5">
              {modelInfo.capabilities.map((cap, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-text">
                  <span className="text-accent text-[10px]"></span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}