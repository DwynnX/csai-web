import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Page } from '../types';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'chat',
    label: 'Chat',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: 'new',
    label: 'New Session',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
  {
    id: 'models',
    label: 'Models',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'help',
    label: 'Help',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { state, dispatch } = useStore();

  const handleNav = (page: Page) => {
    if (page === 'new') {
      dispatch({ type: 'NEW_SESSION' });
    } else {
      dispatch({ type: 'SET_PAGE', payload: page });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {state.sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: state.sidebarOpen ? '100%' : undefined,
        }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-56 bg-bg-panel border-r border-bg-border
          flex flex-col
          transition-transform duration-300 ease-out
          ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map((item, i) => {
            const isActive = state.currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-accent-glow text-text-bright'
                    : 'text-text-muted hover:text-text hover:bg-bg-panelAlt'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-accent rounded-r"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`transition-colors ${isActive ? 'text-accent' : 'text-text-dim group-hover:text-text-muted'}`}>
                  {item.icon}
                </span>
                <span className="font-medium tracking-wide">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-3 py-4 border-t border-bg-border">
          <div className="text-[10px] text-text-dim tracking-widest uppercase leading-relaxed">
            <div className="text-text-muted font-medium">CSAI</div>
            <div>AI Console</div>
            <div className="mt-1 text-text-dim/50">v1.0.0-alpha</div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}