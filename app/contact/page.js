"use client";

import { useState } from "react";
import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import { PinIcon, PhoneIcon, MailIcon, ClockIcon, YoutubeIcon, InstagramIcon, FacebookIcon, LinkedinIcon } from "@/components/Icons";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/siteConfig";

const SOCIALS = [
  { href: SOCIAL_LINKS.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SOCIAL_LINKS.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export default function ContactPage() {
  const { t, lang } = useSite();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | not_configured

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else if (data.error === "supabase_not_configured") {
        setStatus("not_configured");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const noteText = {
    sent: lang === "en" ? "Message sent — we'll get back to you soon." : "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ — ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ.",
    error: lang === "en" ? "Something went wrong — please try again." : "ಏನೋ ತಪ್ಪಾಗಿದೆ — ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    not_configured:
      lang === "en"
        ? "Supabase isn't connected yet, so this message wasn't saved — add your project credentials to .env.local (see supabase/schema.sql and the README)."
        : "ಸುಪಾಬೇಸ್ ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ, ಆದ್ದರಿಂದ ಈ ಸಂದೇಶ ಉಳಿಸಲಾಗಿಲ್ಲ — .env.local ಗೆ ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ಕೀಗಳನ್ನು ಸೇರಿಸಿ.",
  }[status];

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">{t("nav_home")}</Link>
            <span className="sep">/</span>
            <span className="current">{t("breadcrumb_contact")}</span>
          </div>
          <span className="eyebrow">{t("contact_eyebrow")}</span>
          <h1>{t("contact_title")}</h1>
          <p style={{ maxWidth: "52ch", marginTop: 10 }}>{t("contact_desc")}</p>
        </div>
      </section>

      <section>
        <div className="wrap contact-grid">
          <div>
            <div className="contact-card">
              <div className="info-row">
                <div className="info-icon"><PinIcon /></div>
                <div>
                  <h4>{t("info_addr_t")}</h4>
                  <p>{t("info_addr")}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon"><PhoneIcon /></div>
                <div>
                  <h4>{t("info_phone_t")}</h4>
                  <p>{CONTACT_INFO.phone}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon"><MailIcon /></div>
                <div>
                  <h4>{t("info_email_t")}</h4>
                  <p>{CONTACT_INFO.email}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon"><ClockIcon /></div>
                <div>
                  <h4>{t("info_hours_t")}</h4>
                  <p>{t("info_hours")}</p>
                </div>
              </div>
            </div>

            <div className="social-icons" style={{ marginTop: 24 }}>
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>

            <div className="map-placeholder">{t("map_label")}</div>
          </div>

          <div className="contact-card">
            <h3 style={{ marginBottom: 20 }}>{t("form_title")}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">{t("form_name")}</label>
                  <input id="name" type="text" required value={form.name} onChange={update("name")} />
                </div>
                <div className="form-field">
                  <label htmlFor="email">{t("form_email")}</label>
                  <input id="email" type="email" required value={form.email} onChange={update("email")} />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="subject">{t("form_subject")}</label>
                <input id="subject" type="text" value={form.subject} onChange={update("subject")} />
              </div>
              <div className="form-field">
                <label htmlFor="message">{t("form_message")}</label>
                <textarea id="message" rows={5} required value={form.message} onChange={update("message")} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "…" : t("form_submit")}
              </button>
              {noteText && (
                <p style={{ marginTop: 14, fontSize: 13.5, color: "var(--text-soft)" }}>{noteText}</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
