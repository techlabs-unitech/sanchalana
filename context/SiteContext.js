"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { DICTIONARY, DEFAULT_LANG } from "@/lib/dictionary";

const SiteContext = createContext(null);

const THEME_KEY = "sanchalana-theme";
const LANG_KEY = "sanchalana-lang";

export function SiteProvider({ children }) {
  // Server-rendered defaults — kept identical to the initial <html>
  // attributes in layout.js to avoid a hydration mismatch. The real
  // preference (saved choice, or OS dark-mode) is applied a tick later
  // in the effect below, exactly like a normal "flash of default theme"
  // trade-off most sites accept in exchange for a simple client-only hook.
  const [theme, setThemeState] = useState("light");
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const savedLang = window.localStorage.getItem(LANG_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    const initialLang = savedLang || DEFAULT_LANG;

    setThemeState(initialTheme);
    setLangState(initialLang);
    document.documentElement.setAttribute("data-theme", initialTheme);
    document.documentElement.setAttribute("data-lang", initialLang);
    document.documentElement.setAttribute("lang", initialLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const setLang = useCallback((next) => {
    setLangState(next);
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.setAttribute("lang", next);
    window.localStorage.setItem(LANG_KEY, next);
  }, []);

  const t = useCallback(
    (key) => {
      const dict = DICTIONARY[lang] || DICTIONARY[DEFAULT_LANG];
      return dict[key] !== undefined ? dict[key] : key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ theme, lang, toggleTheme, setLang, t }),
    [theme, lang, toggleTheme, setLang, t]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
