"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSite } from "@/context/SiteContext";
import { SunIcon, MoonIcon, GlobeIcon, MenuIcon } from "./Icons";

const NAV = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/gallery", key: "nav_gallery" },
  { href: "/newsletter", key: "nav_newsletter" },
  { href: "/contact", key: "nav_contact" },
];

// `locked` hides the theme toggle — used on newsletter reader pages,
// which are intentionally locked to one fixed theme for every reader
// (see .reader-page in globals.css for how the lock itself works).
export default function Header({ locked = false }) {
  const { theme, lang, toggleTheme, setLang, t } = useSite();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="brand">
          <div className="logo-badge">
            <Image src="/images/logo.jpg" alt="Sanchalana News logo" width={48} height={48} priority />
          </div>
          <div className="brand-text">
            <div className="brand-name">
              SANCHALANA <span>NEWS</span>
            </div>
            <div className="brand-tagline">{t("brand_tagline")}</div>
          </div>
        </Link>

        <nav className={`main-nav${navOpen ? " open" : ""}`} id="main-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => setNavOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <div className="lang-switch">
            <button
              className="lang-btn"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
            >
              <GlobeIcon width={16} height={16} />
              <span className="current-lang">{lang.toUpperCase()}</span>
            </button>
            <div className={`lang-menu${langOpen ? " open" : ""}`} role="menu">
              <button aria-checked={lang === "kn"} onClick={() => { setLang("kn"); setLangOpen(false); }}>
                ಕನ್ನಡ (Kannada)
              </button>
              <button aria-checked={lang === "en"} onClick={() => { setLang("en"); setLangOpen(false); }}>
                English
              </button>
            </div>
          </div>

          {!locked && (
            <button
              className="theme-toggle"
              aria-pressed={theme === "dark"}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              <MoonIcon className="icon-moon" />
              <SunIcon className="icon-sun" />
            </button>
          )}

          <button className="nav-toggle" aria-label="Menu" aria-controls="main-nav" onClick={() => setNavOpen((v) => !v)}>
            <MenuIcon />
          </button>
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-label">{t("ticker_label")}</div>
        <div className="ticker-track-wrap">
          <div className="ticker-track">
            <span>{t("ticker_1")}</span>
            <span>{t("ticker_2")}</span>
            <span>{t("ticker_3")}</span>
            <span>{t("ticker_4")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
