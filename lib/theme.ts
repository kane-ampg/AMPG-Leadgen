"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "apmg-theme";

/**
 * Wrap a state mutation so browsers that support the View Transitions API
 * cross-fade the change (theme swap, view switch). Degrades to a plain call.
 * Mirrors ui-standards §4.2 / §14.6 (`@/lib/theme/with-view-transition`).
 */
export function withViewTransition(cb: () => void) {
  const doc =
    typeof document !== "undefined"
      ? (document as Document & {
          startViewTransition?: (cb: () => void) => unknown;
        })
      : null;
  if (
    doc?.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    doc.startViewTransition(cb);
  } else {
    cb();
  }
}

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Dark is the default theme; a light toggle is first-class (brief + §4.2). */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    setThemeState(readTheme());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / storage disabled — non-fatal */
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(readTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggle, isDark: theme === "dark" };
}

/**
 * Inline script string injected before paint so the persisted (or default
 * dark) theme is applied with no flash of the wrong theme.
 */
export const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'){t='dark';}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;
