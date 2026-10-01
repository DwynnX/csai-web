import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Page } from '../types';

const navItems = [
  { 
    id: 'chat', 
    label: 'CHAT', 
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> 
  },
  { 
    id: 'new', 
    label: 'NEW', 
    icon: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></> 
  },
  { 
    id: 'history', 
    label: 'LOGS', 
    icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> 
  },
  { 
    id: 'models', 
    label: 'MODELS', 
    icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></> 
  },
  { 
    id: 'profile', 
    label: 'ID', 
    icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> 
  },
  { 
    id: 'settings', 
    label: 'SYS', 
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></> 
  },
];

export default function Sidebar() {
  const { state, dispatch } = useStore();

  const handleNav = (page: Page) => {
    if (page === 'new') dispatch({ type: 'NEW_SESSION' });
    else dispatch({ type: 'SET_PAGE', payload: page });
    
    // Закрываем меню на мобильных после клика
    if (window.matchMedia('(max-width: 768px)').matches) {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    }
  };

  return (
    <>
      {/* Затемнение фона для мобильных */}
      <AnimatePresence>
        {state.sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-[1px] z-40 md:hidden"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} />
        )}
      </AnimatePresence>

      {/* Сайдбар */}
      <motion.aside 
        initial={false} 
        animate={{ x: state.sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-bg-border bg-bg-panel shadow-xl md:shadow-none
          md:w-16 md:hover:w-48 group transition-all duration-300 ease-in-out overflow-hidden
          ${!state.sidebarOpen ? '-translate-x-full' : ''} md:!translate-x-0 md:!visible`}
      >
        {/* Шапка только для мобильных */}
        <div className="flex items-center justify-between p-4 border-b border-bg-border md:hidden">
          <span className="text-[10px] font-bold text-text-dim tracking-widest">NAVIGATION</span>
          <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} className="p-1 text-text-muted hover:text-text">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = state.currentPage === item.id;
            return (
              <button key={item.id} onClick={() => handleNav(item.id as Page)}
                className={`w-full flex items-center gap-4 px-4 py-3 transition-colors relative
                  ${isActive ? 'text-accent bg-accent/5' : 'text-text-muted hover:text-text hover:bg-bg-border/20'}`}>
                
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />}
                
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  {item.icon}
                </svg>
                
                <span className="text-[10px] font-mono font-bold tracking-wider whitespace-nowrap opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-75">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-bg-border md:hidden">
           <div className="text-[9px] text-text-dim/50 font-mono text-center">CSAI v1.0 // SECURE</div>
        </div>
      </motion.aside>
    </>
  );
}