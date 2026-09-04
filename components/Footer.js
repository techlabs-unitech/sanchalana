"use client";

import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import { YoutubeIcon, InstagramIcon, FacebookIcon, LinkedinIcon } from "./Icons";

const SOCIALS = [
  { href: "https://www.youtube.com/@SanchalanaNews-kannada", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://www.instagram.com/sanchalana_news", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.facebook.com/895496663636367?ref=NONE_xav_ig_profile_page_web", label: "Facebook", Icon: FacebookIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
];

export default function Footer() {
  const { t } = useSite();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <div className="brand-name">
            SANCHALANA <span style={{ color: "var(--blue-light)" }}>NEWS</span>
          </div>
          <p>{t("footer_about")}</p>
        </div>
        <div className="footer-col">
          <h4>{t("footer_links")}</h4>
          <Link href="/">{t("nav_home")}</Link>
          <Link href="/about">{t("nav_about")}</Link>
          <Link href="/gallery">{t("nav_gallery")}</Link>
          <Link href="/newsletter">{t("nav_newsletter")}</Link>
          <Link href="/contact">{t("nav_contact")}</Link>
        </div>
        <div className="footer-col">
          <h4>{t("footer_contact")}</h4>
          <p>{t("footer_addr")}</p>
          <p>+91 99729 55391</p>
          <p>contact@sanchalananews.com</p>
        </div>
        <div className="footer-col">
          <h4>{t("footer_follow")}</h4>
          <div className="footer-social">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 {t("footer_copy")}</span>
        <span>Made for the people of Karnataka</span>
      </div>
    </footer>
  );
}
