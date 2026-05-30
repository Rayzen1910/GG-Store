import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, User, Sun, Moon, LogIn, Globe, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage, Language } from '../context/LanguageContext.tsx';

const languagesList = [
  { code: 'en' as Language, name: 'English' },
  { code: 'id' as Language, name: 'Indonesia' },
  { code: 'zh' as Language, name: 'Mandarin' },
];

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useApp();
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (collectionsRef.current && !collectionsRef.current.contains(event.target as Node)) {
        setCollectionsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive avatar initials when logged in
  const fullName: string = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const currentLang = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-50 transition-all glass text-text-primary">
      <div className="flex items-center justify-between px-6 h-20 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-black px-4 py-1 border-2 uppercase tracking-tighter italic transition-all bg-brand-red text-brand-dark border-brand-dark dark:border-brand-red group-hover:bg-text-primary group-hover:text-bg-primary group-hover:border-text-primary">
              GG STORE
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {/* Hardware Link */}
            <Link 
              to="/catalog" 
              className={`text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors ${location.pathname === '/catalog' && !location.search ? 'text-brand-red' : ''}`}
            >
              {t('hardware')}
            </Link>

            {/* Collections Dropdown Link */}
            <div className="relative" ref={collectionsRef}>
              <button
                onClick={() => setCollectionsDropdownOpen(!collectionsDropdownOpen)}
                onMouseEnter={() => setCollectionsDropdownOpen(true)}
                className="flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors cursor-pointer"
              >
                <span>{t('collections')}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${collectionsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {collectionsDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-bg-secondary border border-border-subtle rounded-sm shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setCollectionsDropdownOpen(false)}
                >
                  <Link
                    to="/catalog?category=keyboard"
                    onClick={() => setCollectionsDropdownOpen(false)}
                    className="block px-4 py-3 text-left text-xs font-mono font-bold hover:bg-brand-red hover:text-brand-dark transition-all text-text-primary border-b border-white/5"
                  >
                    ⌨️ {language === 'id' ? 'Keyboard Mekanik' : language === 'zh' ? '机械轴体键盘' : 'Mechanical Keyboards'}
                  </Link>
                  <Link
                    to="/catalog?category=mouse"
                    onClick={() => setCollectionsDropdownOpen(false)}
                    className="block px-4 py-3 text-left text-xs font-mono font-bold hover:bg-brand-red hover:text-brand-dark transition-all text-text-primary border-b border-white/5"
                  >
                    🖱️ {language === 'id' ? 'Mouse Gaming' : language === 'zh' ? '专业游戏鼠标' : 'Gaming Mice'}
                  </Link>
                  <Link
                    to="/catalog?category=audio"
                    onClick={() => setCollectionsDropdownOpen(false)}
                    className="block px-4 py-3 text-left text-xs font-mono font-bold hover:bg-brand-red hover:text-brand-dark transition-all text-text-primary border-b border-white/5"
                  >
                    🎧 {language === 'id' ? 'Headset & Audio' : language === 'zh' ? '顶级电竞耳机' : 'Pro Gaming Audio'}
                  </Link>
                  <Link
                    to="/catalog?category=accessory"
                    onClick={() => setCollectionsDropdownOpen(false)}
                    className="block px-4 py-3 text-left text-xs font-mono font-bold hover:bg-brand-red hover:text-brand-dark transition-all text-text-primary"
                  >
                    🎒 {language === 'id' ? 'Aksesoris Desk' : language === 'zh' ? '极客周边配件' : 'Desk Accessories'}
                  </Link>
                </div>
              )}
            </div>

            {/* Support Link */}
            <Link
              to="/support"
              className={`text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors cursor-pointer ${location.pathname === '/support' ? 'text-brand-red' : ''}`}
            >
              {t('support')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm hover:bg-white/5 border border-border-subtle/50 text-xs font-mono font-bold uppercase transition-all tracking-wider cursor-pointer z-30 relative"
            >
              <Globe size={14} className="opacity-80" />
              <span>{language.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-bg-secondary border border-border-subtle rounded-sm shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-xs font-mono font-bold hover:bg-brand-red hover:text-brand-dark transition-all cursor-pointer ${
                      language === lang.code ? 'bg-white/5 text-brand-red' : 'text-text-primary'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="opacity-60 text-[10px]">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 hover:text-brand-red transition-colors rounded-full cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={22} strokeWidth={2.5} /> : <Sun size={22} strokeWidth={2.5} />}
          </button>
          
          {/* Auth-aware account icon */}
          {user ? (
            <Link 
              to="/account" 
              className={`hover:text-brand-red transition-colors relative group ${location.pathname === '/account' ? 'text-brand-red' : ''}`}
              title={fullName}
            >
              {initials ? (
                <div className="w-8 h-8 rounded-full bg-brand-red text-brand-dark text-[11px] font-black flex items-center justify-center border-2 border-transparent group-hover:border-text-primary transition-all">
                  {initials}
                </div>
              ) : (
                <User size={22} strokeWidth={2.5} />
              )}
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors ${location.pathname === '/auth' ? 'text-brand-red' : ''}`}
            >
              <LogIn size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">{t('login')}</span>
            </Link>
          )}

          <Link to="/cart" className={`relative hover:text-brand-red transition-colors ${location.pathname === '/cart' ? 'text-brand-red' : ''}`}>
            <ShoppingBag size={22} strokeWidth={2.5} />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-red text-brand-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-bg-primary transition-colors">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
