'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const THEME_COLOR: Record<Theme, string> = { dark: '#060914', light: '#F2F4FB' };

// The saved theme lives on <html data-theme>; with none saved, follow the OS setting.
export function getTheme(): Theme {
  const saved = document.documentElement.getAttribute('data-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(next: Theme) {
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => { mo.disconnect(); mq.removeEventListener('change', onChange); };
}

// Current theme, re-rendering on toggle or OS change. `null` during server render.
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getTheme, () => null);
}

export function syncThemeColor(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}
