import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.tsx';
import { Sun, Moon } from 'lucide-react';

type Tab = 'login' | 'register';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [tab, setTab] = useState<Tab>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (tab === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        navigate('/account');
      }
    } else {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        setSuccess('Account created successfully! You can now sign in immediately.');
        setLoading(false);
        setTab('login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid — pointer-events-none so it never blocks clicks */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Red accent orb */}
      <div className="absolute -top-64 -right-64 w-[600px] h-[600px] rounded-full bg-brand-red/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-64 -left-64 w-[600px] h-[600px] rounded-full bg-brand-red/5 blur-[120px] pointer-events-none" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 hover:text-brand-red transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Logo */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-10 text-2xl font-black px-4 py-1 border-2 uppercase tracking-tighter italic bg-brand-red text-brand-dark border-brand-dark dark:border-brand-red"
      >
        GG STORE
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="relative z-20 pointer-events-auto bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden shadow-2xl">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 border-b border-border-subtle relative z-20">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`py-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer relative z-20 ${
                  tab === t
                    ? 'bg-brand-red text-brand-dark'
                    : 'text-gray-500 hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                {tab === 'login' ? 'Welcome Back' : 'Join GG Store'}
              </h1>
              <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">
                {tab === 'login' ? 'Enter your credentials to continue.' : 'Create your account to start shopping.'}
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 bg-brand-red/10 border border-brand-red/40 p-4 rounded-sm"
                >
                  <AlertCircle size={16} className="text-brand-red mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-mono text-brand-red leading-relaxed">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-sm"
                >
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-mono text-emerald-400 leading-relaxed">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>            <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
              <AnimatePresence>
                {tab === 'register' && (
                  <motion.div
                    key="fullname"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required={tab === 'register'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-transparent border-b-2 border-border-subtle py-3 px-2 focus:outline-none focus:border-brand-red transition-colors font-sans text-text-primary placeholder:text-text-secondary rounded-sm relative z-20 cursor-text"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b-2 border-border-subtle py-3 px-2 focus:outline-none focus:border-brand-red transition-colors font-sans text-text-primary placeholder:text-text-secondary rounded-sm relative z-20 cursor-text"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-transparent border-b-2 border-border-subtle py-3 px-2 pr-12 focus:outline-none focus:border-brand-red transition-colors font-sans text-text-primary placeholder:text-text-secondary rounded-sm relative z-20 cursor-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-text-primary transition-colors cursor-pointer z-35"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-red text-brand-dark py-4 font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:opacity-90 transition-all rounded-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-20"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : tab === 'login' ? (
                  <><LogIn size={18} /> Sign In</>
                ) : (
                  <><UserPlus size={18} /> Create Account</>
                )}
              </button>
            </form>

            <p className="text-center text-[10px] font-mono text-gray-600 uppercase tracking-widest relative z-20">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                className="text-brand-red hover:underline font-bold cursor-pointer relative z-30 ml-1"
              >
                {tab === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
