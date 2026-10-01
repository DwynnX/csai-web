import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

// --- ФОН МАТРИЦЫ (Без изменений) ---
function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14; let columns = Math.floor(canvas.width / fontSize); let drops: number[] = Array(columns).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(8, 8, 10, 0.08)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(0, 232, 143, ${Math.random() * 0.6 + 0.2})`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'blur(1.5px)' }} />;
}

export default function AuthPage() {
  const { state, dispatch } = useStore();
  
  // Стейты для управления потоком авторизации
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [verifyType, setVerifyType] = useState<'email' | '2fa'>('email');
  const [pendingUser, setPendingUser] = useState<any>(null); // Храним данные юзера между шагами
  const [emailCode, setEmailCode] = useState('');
  
  // Стейт формы регистрации/входа
  const [f, setF] = useState({ u: '', p: '', fn: '', ln: '', e: '', d: '' });

  const reset = () => { 
    setF({ u: '', p: '', fn: '', ln: '', e: '', d: '' }); 
    setErr(''); setStep('form'); setEmailCode(''); setPendingUser(null); 
  };

  const onDate = (v: string) => {
    let x = v.replace(/\D/g, '');
    if (x.length > 2) x = x.slice(0, 2) + '/' + x.slice(2);
    if (x.length > 5) x = x.slice(0, 5) + '/' + x.slice(5, 9);
    setF(prev => ({ ...prev, d: x }));
  };

  // --- ЛОГИКА РЕГИСТРАЦИИ ---
  const reg = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!f.u || !f.p || !f.fn || !f.ln || !f.e || f.d.length < 10) { 
      setErr('ERR: ALL FIELDS REQUIRED'); return; 
    }
    setLoading(true);
    try {
      const res = await fetch('/api/register.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: f.u, firstName: f.fn, lastName: f.ln, 
          email: f.e, birthDate: f.d, password: f.p 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Успех -> переходим к вводу кода из почты
      setStep('verify');
      setVerifyType('email');
    } catch (error: any) {
      setErr(error.message || 'ERR: CONNECTION FAILED');
    } finally { setLoading(false); }
  };

  // --- ЛОГИКА ВХОДА ---
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/login.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: f.u, password: f.p })
      });
      const text = await res.text(); let data;
      try { data = JSON.parse(text); } catch { throw new Error(`SERVER ERROR`); }
      
      // Статус 202 означает, что сервер ждет 2FA код
      if (res.status === 202 && data.message === '2FA_CODE_SENT') {
        setPendingUser(data); // Сохраняем email, который пришел с бэкенда
        setStep('verify');
        setVerifyType('2fa');
        setErr('');
      } else if (!res.ok) {
        throw new Error(data.error || 'AUTH FAILED');
      } else {
        // Обычный вход без 2FA
        dispatch({ type: 'LOGIN', payload: { ...data, token: 'jwt-' + Date.now() } });
      }
    } catch (error: any) { setErr(error.message || 'ERR: CONNECTION FAILED'); } 
    finally { setLoading(false); }
  };

  // --- УНИВЕРСАЛЬНАЯ ПРОВЕРКА КОДА (И для регистрации, и для 2FA) ---
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (emailCode.length !== 6) { setErr('ERR: INVALID CODE FORMAT'); return; }
    
    setLoading(true);
    try {
      // Выбираем нужный API endpoint в зависимости от типа верификации
      const endpoint = verifyType === 'email' ? '/api/verify_email.php' : '/api/verify_2fa.php';
      
      const payload = verifyType === 'email' 
        ? { email: f.e, code: emailCode }
        : { email: pendingUser?.email, code: emailCode };
        
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (verifyType === 'email') {
        // Почта подтверждена -> идем на логин
        reset(); 
        dispatch({ type: 'SET_AUTH_PAGE', payload: 'login' });
      } else {
        // 2FA подтверждена -> полноценный вход
        dispatch({ type: 'LOGIN', payload: { ...pendingUser, token: 'jwt-' + Date.now() } });
      }
    } catch (error: any) { setErr(error.message || 'ERR: VERIFICATION FAILED'); } 
    finally { setLoading(false); }
  };

  const isL = state.authPage === 'login';
  const inp = "w-full bg-bg/90 border border-bg-border rounded px-3 py-3 text-xs text-text font-mono outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-dim/40";

  return (
    <div className="h-full w-full flex items-center justify-center bg-bg p-3 sm:p-6 relative overflow-hidden">
      <MatrixBackground />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-sm sm:max-w-md bg-bg-panel/95 backdrop-blur-md border border-bg-border rounded-lg p-5 sm:p-8 shadow-2xl relative z-10">
        
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-bg-border/50">
          <div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="ml-2 text-[9px] text-text-dim font-mono tracking-[0.2em] uppercase">Secure Terminal // DB Active</span>
        </div>

        {/* Динамический заголовок */}
        <h1 className="text-base font-bold text-text-bright font-mono tracking-wide mb-1">
          {'>'} {isL ? 'ACCESS_TERMINAL' : step === 'verify' ? (verifyType === 'email' ? 'VERIFY_EMAIL' : '2FA_AUTH') : 'CREATE_IDENTITY'}
        </h1>
        
        {/* Динамическое описание */}
        <p className="text-[10px] text-text-dim font-mono mb-5 leading-relaxed">
          {isL ? 'Enter credentials to initialize session.' : 
           step === 'verify' ? `Code sent to ${verifyType === 'email' ? f.e : pendingUser?.email}. Enter 6-digit code.` : 
           'Register new operator profile.'}
        </p>

        {/* ЭКРАН ВВОДА КОДА */}
        {step === 'verify' ? (
          <form onSubmit={verifyCode} className="space-y-4">
             <input type="text" maxLength={6} value={emailCode} onChange={e => setEmailCode(e.target.value.replace(/\D/g,''))} 
               className={`${inp} text-center tracking-[0.5em] text-lg`} placeholder="000000" autoFocus />
             {err && <div className="text-[10px] text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded p-2">{err}</div>}
             <button disabled={loading} className="w-full bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-mono text-xs py-3 rounded transition-all disabled:opacity-50">
               {loading ? 'VERIFYING...' : 'CONFIRM_ACCESS'}
             </button>
             <button type="button" onClick={() => { setStep('form'); setErr(''); }} className="w-full text-[10px] text-text-dim hover:text-accent font-mono mt-2">[ BACK_TO_FORM ]</button>
          </form>
        ) : !isL ? (
           /* ФОРМА РЕГИСТРАЦИИ */
           <form onSubmit={reg} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={f.fn} onChange={e => setF(p => ({...p, fn: e.target.value}))} className={inp} placeholder="FIRST NAME" />
                <input type="text" value={f.ln} onChange={e => setF(p => ({...p, ln: e.target.value}))} className={inp} placeholder="LAST NAME" />
              </div>
              <input type="email" value={f.e} onChange={e => setF(p => ({...p, e: e.target.value}))} className={inp} placeholder="EMAIL ADDRESS" />
              <input type="text" value={f.d} onChange={e => onDate(e.target.value)} maxLength={10} className={inp} placeholder="DD/MM/YYYY" />
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/50 font-mono text-[10px] select-none pointer-events-none">ID:</span>
                <input type="text" value={f.u} onChange={e => setF(p => ({...p, u: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')}))} className={`${inp} pl-10`} placeholder="OPERATOR_ID" autoFocus />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/50 font-mono text-[10px] select-none pointer-events-none">KEY:</span>
                <input type="password" value={f.p} onChange={e => setF(p => ({...p, p: e.target.value}))} className={`${inp} pl-10`} placeholder="ACCESS_KEY" />
              </div>
              
              {err && <div className="text-[10px] text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded p-2">{err}</div>}
              <button disabled={loading} className="w-full mt-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-mono text-xs py-3 rounded transition-all disabled:opacity-50">
                {loading ? 'PROCESSING...' : 'EXECUTE_REGISTER'}
              </button>
              <button type="button" onClick={() => dispatch({type:'SET_AUTH_PAGE', payload:'login'})} className="w-full text-[10px] text-text-dim hover:text-accent font-mono mt-2">[ ALREADY_REGISTERED? LOGIN ]</button>
           </form>
        ) : (
          /* ФОРМА ВХОДА */
          <form onSubmit={login} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/50 font-mono text-[10px] select-none pointer-events-none">ID:</span>
              <input type="text" value={f.u} onChange={e => setF(p => ({...p, u: e.target.value.toLowerCase()}))} className={`${inp} pl-10`} placeholder="OPERATOR_ID" autoFocus />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/50 font-mono text-[10px] select-none pointer-events-none">KEY:</span>
              <input type="password" value={f.p} onChange={e => setF(p => ({...p, p: e.target.value}))} className={`${inp} pl-10`} placeholder="ACCESS_KEY" />
            </div>
            {err && <div className="text-[10px] text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded p-2">{err}</div>}
            <button disabled={loading} className="w-full mt-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-mono text-xs py-3 rounded transition-all disabled:opacity-50">
              {loading ? 'AUTHENTICATING...' : 'EXECUTE_LOGIN'}
            </button>
            <button type="button" onClick={() => dispatch({type:'SET_AUTH_PAGE', payload:'register'})} className="w-full text-[10px] text-text-dim hover:text-accent font-mono mt-2">[ NEW_OPERATOR? REGISTER ]</button>
          </form>
        )}
        
        <div className="mt-6 text-[8px] text-text-dim/40 font-mono text-center leading-relaxed uppercase tracking-wider">
          CSAI Secure Shell v1.0<br/>Connected to MySQL Cluster
        </div>
      </motion.div>
    </div>
  );
}