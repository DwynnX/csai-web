import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function AuthPage() {
  const { state, dispatch } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('ERR: Credentials required');
      return;
    }

    setIsLoading(true);
    
    // Имитация запроса к серверу
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password.length < 3) {
      setError('ERR: Invalid access key');
      setIsLoading(false);
      return;
    }

    dispatch({ 
      type: 'LOGIN', 
      payload: { username: username.trim(), token: 'fake-jwt-token-' + Date.now() } 
    });
    setIsLoading(false);
  };

  const isLogin = state.authPage === 'login';

  return (
    <div className="h-full w-full flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00e88f 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-bg-panel border border-bg-border rounded-lg p-8 shadow-2xl relative z-10"
      >
        {/* Заголовок терминала */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-bg-border">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          <span className="ml-2 text-xs text-text-dim font-mono tracking-wider">SECURE TERMINAL // AUTH</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-bright font-mono tracking-tight mb-1">
            {isLogin ? '> ACCESS_TERMINAL' : '> CREATE_IDENTITY'}
          </h1>
          <p className="text-xs text-text-dim font-mono">
            {isLogin ? 'Enter credentials to initialize session.' : 'Register new operator profile.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-text-dim font-mono ml-1">Operator ID</label>
            <div className="relative">
              {/* Исправлено: используем {'>'} вместо просто > */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-mono text-sm">{'> '}</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg border border-bg-border rounded pl-7 pr-3 py-2.5 text-sm text-text font-mono focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all placeholder:text-text-dim/30"
                placeholder="username"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-text-dim font-mono ml-1">Access Key</label>
            <div className="relative">
              {/* Исправлено: используем {'#'} вместо просто # (хотя # обычно ок, но для надежности) */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-mono text-sm">{'#'}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-bg-border rounded pl-7 pr-3 py-2.5 text-sm text-text font-mono focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all placeholder:text-text-dim/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded p-2"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 text-accent font-mono text-sm py-2.5 rounded transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                AUTHENTICATING...
              </>
            ) : (
              <>
                EXECUTE_{isLogin ? 'LOGIN' : 'REGISTER'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-bg-border text-center">
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_PAGE', payload: isLogin ? 'register' : 'login' })}
            className="text-xs text-text-dim hover:text-accent font-mono transition-colors"
          >
            {isLogin ? '[ NEW_OPERATOR? REGISTER_HERE ]' : '[ EXISTING_OPERATOR? LOGIN_HERE ]'}
          </button>
        </div>
        
        <div className="mt-8 text-[10px] text-text-dim/50 font-mono text-center leading-relaxed">
          CSAI SECURE SHELL v1.0<br/>
          UNAUTHORIZED ACCESS IS PROHIBITED
        </div>
      </motion.div>
    </div>
  );
}