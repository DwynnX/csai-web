import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function ProfilePage() {
  const { state, dispatch } = useStore();
  const user = state.user!;

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<{t:'s'|'e', m:string}|null>(null);

  const onDateChange = (v: string) => {
    let x = v.replace(/\D/g, '');
    if (x.length > 2) x = x.slice(0, 2) + '/' + x.slice(2);
    if (x.length > 5) x = x.slice(0, 5) + '/' + x.slice(5, 9);
    setBirthDate(x);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    
    if (!username || !email || !firstName || !lastName) { 
      setMsg({t:'e', m:'ERR: FIELDS REQUIRED'}); return; 
    }

    try {
      const res = await fetch('/api/profile.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          firstName, lastName, email, birthDate
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      dispatch({ type: 'UPDATE_PROFILE', payload: { firstName, lastName, email, username, birthDate } });
      setMsg({t:'s', m:'IDENTITY UPDATED'});
      
    } catch (err: any) {
      setMsg({t:'e', m: err.message || 'ERR: CONNECTION FAILED'});
    }
    setTimeout(()=>setMsg(null), 3000);
  };

  const changePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (currentPassword !== user.passwordHash) { 
      setMsg({t:'e', m:'ERR: CURRENT KEY INVALID'}); return; 
    }
    if (newPassword.length < 4) { 
      setMsg({t:'e', m:'ERR: KEY TOO SHORT'}); return; 
    }

    try {
      const res = await fetch('/api/profile.php', {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id: user.id, newPassword })
      });
      
      const data = await res.json();
      if(!res.ok) throw new Error(data.error);
      
      dispatch({ type: 'UPDATE_PROFILE', payload: { passwordHash: newPassword } });
      setCurrentPassword(''); setNewPassword('');
      setMsg({t:'s', m:'ACCESS KEY CHANGED'});
      
    } catch(err:any) { 
      setMsg({t:'e', m: err.message}); 
    }
    setTimeout(()=>setMsg(null), 3000);
  };

  const inp = "w-full bg-bg border border-bg-border rounded px-3 py-2.5 text-xs text-text font-mono outline-none focus:border-accent/50 transition-colors";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="mb-4"><h2 className="text-xs font-bold text-text-bright tracking-widest uppercase">Operator Profile</h2></div>

        {msg && <div className={`text-[10px] font-mono border rounded p-2 ${msg.t==='e'?'text-red-400 bg-red-500/10 border-red-500/20':'text-accent bg-accent-glow border-accent/20'}`}>{msg.m}</div>}

        <form onSubmit={updateProfile} className="bg-bg-panel border border-bg-border rounded p-4 space-y-3">
          <div className="text-[9px] text-text-dim uppercase tracking-widest mb-1 border-b border-bg-border/50 pb-1">Identity Data</div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} className={inp} placeholder="First Name" />
            <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} className={inp} placeholder="Last Name" />
          </div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className={inp} placeholder="Email" />
          <input type="text" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))} className={inp} placeholder="Operator ID" />
          <input type="text" value={birthDate} onChange={e=>onDateChange(e.target.value)} maxLength={10} className={inp} placeholder="DD/MM/YYYY" />
          <button type="submit" className="w-full mt-1 px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono rounded hover:bg-accent/20 transition-all uppercase">Update Identity</button>
        </form>

        <form onSubmit={changePass} className="bg-bg-panel border border-bg-border rounded p-4 space-y-3">
          <div className="text-[9px] text-text-dim uppercase tracking-widest mb-1 border-b border-bg-border/50 pb-1">Security: Access Key</div>
          <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className={inp} placeholder="Current Key" />
          <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className={inp} placeholder="New Key" />
          <button type="submit" className="w-full mt-1 px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono rounded hover:bg-accent/20 transition-all uppercase">Change Key</button>
        </form>

        <div className="bg-bg-panel border border-bg-border rounded p-4">
          <div className="text-[9px] text-text-dim uppercase tracking-widest mb-2 border-b border-bg-border/50 pb-1">Two-Factor Auth</div>
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono">Status: <span className={user.twoFactorEnabled?'text-accent':'text-text-dim'}>{user.twoFactorEnabled?'ENABLED':'DISABLED'}</span></div>
            <button onClick={()=>dispatch({type:'TOGGLE_2FA', payload:!user.twoFactorEnabled})} className={`w-9 h-4 rounded-full transition-all relative ${user.twoFactorEnabled?'bg-accent/30':'bg-bg-border'}`}>
              <motion.div animate={{x:user.twoFactorEnabled?18:2}} className="absolute top-0.5 w-3 h-3 rounded-full bg-accent" />
            </button>
          </div>
          {user.twoFactorEnabled && <div className="mt-2 text-[9px] text-text-dim font-mono">Secret: <span className="text-accent tracking-widest">{user.twoFactorSecret}</span></div>}
        </div>
      </div>
    </motion.div>
  );
}