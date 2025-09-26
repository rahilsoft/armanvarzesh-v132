import React, { useEffect, useState } from 'react';
const THEME_KEY = 'theme';
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem(THEME_KEY)) as 'light'|'dark'|null;
    const initial = saved || 'light';
    setTheme(initial);
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', initial);
  }, []);
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', next);
    if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, next);
  };
  return <button aria-label="toggle theme" onClick={toggle} className="btn-toggle">{theme === 'light' ? '🌙' : '☀️'}</button>;
}
