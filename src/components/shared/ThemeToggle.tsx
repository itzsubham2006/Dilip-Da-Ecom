'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function getInitialDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitialDark);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('dilip-da-theme', next ? 'dark' : 'light');
  }

  return (
    <button className="icon-button-z" type="button" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
