import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Settings as SettingsType } from '../types';

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const settings = state.settings;

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  const fontSizeMap = { small: '12px', medium: '13px', large: '15px' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6"
      style={{ fontSize: fontSizeMap[settings.fontSize] }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-text-bright tracking-wide">SETTINGS</h2>
          <p className="text-[11px] text-text-dim mt-1">Interface configuration</p>
        </div>

        <div className="space-y-4">
          {/* Font Size */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-bg-panel border border-bg-border rounded p-4"
          >
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-3">Font Size</div>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`
                    px-3 py-1.5 rounded text-xs border transition-all duration-200 capitalize
                    ${settings.fontSize === size
                      ? 'border-accent/30 bg-accent-glow text-accent'
                      : 'border-bg-border text-text-muted hover:border-bg-borderLight hover:text-text'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Animation Intensity */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-panel border border-bg-border rounded p-4"
          >
            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-3">Animation Intensity</div>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updateSetting('animationIntensity', level)}
                  className={`
                    px-3 py-1.5 rounded text-xs border transition-all duration-200 capitalize
                    ${settings.animationIntensity === level
                      ? 'border-accent/30 bg-accent-glow text-accent'
                      : 'border-bg-border text-text-muted hover:border-bg-borderLight hover:text-text'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Enter to Send */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-bg-panel border border-bg-border rounded p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Enter to Send</div>
              <div className="text-xs text-text-muted">Press Enter to send, Shift+Enter for newline</div>
            </div>
            <button
              onClick={() => updateSetting('enterToSend', !settings.enterToSend)}
              className={`
                w-9 h-5 rounded-full transition-all duration-300 relative
                ${settings.enterToSend ? 'bg-accent/30' : 'bg-bg-border'}
              `}
            >
              <motion.div
                animate={{ x: settings.enterToSend ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-accent"
              />
            </button>
          </motion.div>

          {/* Sound Effects */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-bg-panel border border-bg-border rounded p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Sound Effects</div>
              <div className="text-xs text-text-muted">Play sounds on message events</div>
            </div>
            <button
              onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
              className={`
                w-9 h-5 rounded-full transition-all duration-300 relative
                ${settings.soundEffects ? 'bg-accent/30' : 'bg-bg-border'}
              `}
            >
              <motion.div
                animate={{ x: settings.soundEffects ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-accent"
              />
            </button>
          </motion.div>

          {/* Compact Mode */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-bg-panel border border-bg-border rounded p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Compact Mode</div>
              <div className="text-xs text-text-muted">Reduce spacing between messages</div>
            </div>
            <button
              onClick={() => updateSetting('compactMode', !settings.compactMode)}
              className={`
                w-9 h-5 rounded-full transition-all duration-300 relative
                ${settings.compactMode ? 'bg-accent/30' : 'bg-bg-border'}
              `}
            >
              <motion.div
                animate={{ x: settings.compactMode ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-accent"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}