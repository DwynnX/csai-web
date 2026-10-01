import { AnimatePresence, motion } from 'framer-motion';
import { StoreProvider, useStore } from './store';
import AuthPage from './components/AuthPage'; // <-- Обычный импорт вместо require
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import HistoryPage from './components/HistoryPage';
import ModelsPage from './components/ModelsPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import NewSessionPage from './components/NewSessionPage';
import ProfilePage from './components/ProfilePage';

function AppContent() {
  const { state, dispatch } = useStore();

  // Если пользователь не авторизован - показываем AuthPage
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
      case 'profile': return <ProfilePage />;
      default: return <ChatArea />;
    }
  };

  const fontSizeMap = { small: '12px', medium: '13px', large: '15px' };

  return (
    <div className="h-full w-full flex flex-col bg-bg text-text font-mono overflow-hidden" style={{ fontSize: fontSizeMap[state.settings.fontSize] }}>
      {/* Глобальные эффекты фона */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" />
      <div className="scanline-bar pointer-events-none fixed top-0 left-0 w-full h-[2px] z-[1]" />
      
      {/* Верхняя панель */}
      <header className="flex items-center justify-between h-12 px-4 bg-bg-panel border-b border-bg-border select-none shrink-0 z-20 relative">
        <div className="flex items-center gap-3">
          {/* Кнопка меню для мобильных */}
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="lg:hidden p-2 rounded-md hover:bg-bg-borderLight active:scale-95 transition-all touch-manipulation z-50"
            aria-label="Toggle Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e88f" strokeWidth="1.5" className="hidden sm:block">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span className="text-xs font-bold tracking-wide text-text-bright">
              CSAI 1 <span className="text-text-dim font-normal">(alpha)</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-text-dim font-mono bg-bg-border/30 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,232,143,0.5)]" />
            <span className="uppercase">{state.user?.username || 'GUEST'}</span>
          </div>
          
          <button 
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="text-[10px] text-text-dim hover:text-red-400 font-mono transition-colors px-2 py-1 rounded hover:bg-red-500/10"
          >
            [LOGOUT]
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden bg-bg relative z-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={state.currentPage + (state.activeSessionId || '')} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.2 }} 
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
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