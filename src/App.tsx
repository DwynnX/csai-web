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
import AuthPage from './components/AuthPage'; // <-- Импортируем новую страницу

function AppContent() {
  const { state, dispatch } = useStore();

  // Если нет пользователя, показываем экран входа
  if (!state.user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (state.currentPage) {
      case 'chat': return <ChatArea />;
      case 'new': return <NewSessionPage />;
      case 'history': return <HistoryPage />;
      case 'models': return <ModelsPage />;
      case 'settings': return <SettingsPage />;
      case 'help': return <HelpPage />;
      default: return <ChatArea />;
    }
  };

  const fontSizeMap = { small: '12px', medium: '13px', large: '15px' };

  return (
    <div className="h-full w-full flex flex-col bg-bg text-text font-mono" style={{ fontSize: fontSizeMap[state.settings.fontSize] }}>
      <div className="noise-overlay" />
      <div className="scanline-bar" />
      
      {/* Верхняя панель с кнопкой выхода */}
      <div className="flex items-center justify-between h-10 px-4 bg-bg-panel border-b border-bg-border select-none">
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e88f" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span className="text-xs font-medium tracking-wide text-text-bright">CSAI 1 <span className="text-text-dim">(alpha)</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-text-dim font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            OPERATOR: <span className="text-accent">{state.user.username.toUpperCase()}</span>
          </div>
          <button 
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="text-[10px] text-text-dim hover:text-red-400 font-mono transition-colors border border-transparent hover:border-red-500/30 px-2 py-1 rounded"
          >
            [LOGOUT]
          </button>
          {/* Кнопки окна */}
          <div className="flex items-center gap-1 ml-2">
             <div className="w-2.5 h-[1.5px] bg-text-dim" />
             <div className="w-2.5 h-2.5 border border-text-dim rounded-[1px]" />
             <svg width="8" height="8" viewBox="0 0 10 10" className="text-text-dim"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} className="lg:hidden fixed top-12 left-3 z-30 p-2 rounded bg-bg-panel border border-bg-border text-text-muted hover:text-text transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-bg relative">
          <AnimatePresence mode="wait">
            <motion.div key={state.currentPage + state.activeSessionId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
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