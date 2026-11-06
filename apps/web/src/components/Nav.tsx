import { Link, NavLink } from 'react-router-dom';
import { useNazar, useT } from '../store';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const lang = useNazar((s) => s.lang);
  const setLang = useNazar((s) => s.setLang);
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className={`shrink-0 whitespace-nowrap rounded-full border hairline px-2.5 py-1.5 text-[13px] transition sm:px-3 sm:text-sm hover:border-teal ${lang === 'en' ? 'font-arabic' : ''} ${className}`}
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      data-testid="lang-toggle"
    >
      {t.language}
    </button>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-display text-xl font-semibold tracking-[0.14em] text-ivory sm:text-2xl sm:tracking-[0.18em]">NAZAR</span>
      {!compact && <span className="ar-display hidden text-xl text-gold sm:inline" lang="ar">نَظَر</span>}
    </span>
  );
}

export function Nav({ overlay = false }: { overlay?: boolean }) {
  const t = useT();
  const link = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-full px-2 py-1.5 text-[13px] transition sm:px-3 sm:text-sm ${isActive ? 'bg-ivory/10 text-ivory' : 'text-ivory/70 hover:text-ivory'}`;
  return (
    <header className={`${overlay ? 'absolute inset-x-0 top-0 z-40' : 'relative'} flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6`}>
      <Link to="/" aria-label="NAZAR home" className="shrink-0">
        <Wordmark />
      </Link>
      <nav aria-label="Main" className="flex items-center gap-1 overflow-x-auto">
        <NavLink to="/experience" className={link}>
          {t.experience}
        </NavLink>
        <NavLink to="/pitch-demo" className={link}>
          {t.pitch}
        </NavLink>
        <NavLink to="/privacy" className={`${link({ isActive: false })} hidden sm:inline-flex`}>
          {t.privacy}
        </NavLink>
        <LanguageToggle className="ms-1" />
      </nav>
    </header>
  );
}
