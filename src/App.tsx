import { AnimatePresence, motion } from 'framer-motion';
import { StoreProvider, useStore } from './store';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import HistoryPage from './components/HistoryPage';
import ModelsPage from './components/ModelsPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import NewSessionPage from './components/NewSessionPage';

function AppContent() {
  const { state, dispatch } = useStore();

  const renderPage = () => {
    switch (state.currentPage) {
      case 'chat':
        return <ChatArea />;
      case 'new':
        return <NewSessionPage />;
      case 'history':
        return <HistoryPage />;
      case 'models':
        return <ModelsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <ChatArea />;
    }
  };

  const fontSizeMap = { small: '12px', medium: '13px', large: '15px' };

  return (
    <div
      className="h-full w-full flex flex-col bg-bg text-text font-mono"
      style={{ fontSize: fontSizeMap[state.settings.fontSize] }}
    >
      {/* Noise overlay */}
      <div className="noise-overlay" />
      <div className="scanline-bar" />

      {/* Top bar */}
      <TopBar />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile menu button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="lg:hidden fixed top-12 left-3 z-30 p-2 rounded bg-bg-panel border border-bg-border text-text-muted hover:text-text transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-bg relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentPage + state.activeSessionId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}