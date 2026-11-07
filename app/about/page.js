"use client";

import Link from "next/link";
import Image from "next/image";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import SocialStrip from "@/components/SocialStrip";
import { ShieldIcon, BoltIcon, PeopleIcon } from "@/components/Icons";

const TIMELINE = [1, 2, 3, 4];

export default function AboutPage() {
  const { t } = useSite();

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">{t("nav_home")}</Link>
            <span className="sep">/</span>
            <span className="current">{t("breadcrumb_about")}</span>
          </div>
          <span className="eyebrow">{t("about_eyebrow")}</span>
          <h1>{t("about_title")}</h1>
        </div>
      </section>

      <section>
        <div className="wrap about-grid">
          <div>
            <p>{t("about_p1")}</p>
            <p>{t("about_p2")}</p>
            <div className="card" style={{ padding: 24, borderColor: "var(--blue)", marginTop: 24 }}>
              <h3 style={{ color: "var(--red)" }}>{t("about_mission_title")}</h3>
              <p style={{ margin: 0 }}>{t("about_mission")}</p>
            </div>
          </div>
          <div className="founder-profile">
            <div className="founder-photo-frame">
              <Image
                src="/images/founder/sai-swami-founder.jpg"
                alt={t("founder_name")}
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "50% 40%" }}
              />
            </div>
            <div className="founder-caption">
              <span className="eyebrow">{t("founder_heading")}</span>
              <h2>{t("founder_name")}</h2>
              <p>{t("founder_role")}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="section-head" style={{ margin: "0 auto 44px", textAlign: "center" }}>
            <span className="eyebrow" style={{ display: "inline-flex" }}>{t("timeline_title")}</span>
          </div>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div className="timeline">
              {TIMELINE.map((n) => (
                <div className="timeline-item" key={n}>
                  <div className="timeline-year">{t(`tl_${n}_y`)}</div>
                  <h4>{t(`tl_${n}_t`)}</h4>
                  <p style={{ margin: 0 }}>{t(`tl_${n}_d`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow" style={{ display: "inline-flex" }}>{t("values_title")}</span>
          </div>
          <div className="value-grid">
            <div className="value-card">
              <ShieldIcon />
              <h3>{t("val_1_t")}</h3>
              <p>{t("val_1_d")}</p>
            </div>
            <div className="value-card">
              <BoltIcon />
              <h3>{t("val_2_t")}</h3>
              <p>{t("val_2_d")}</p>
            </div>
            <div className="value-card">
              <PeopleIcon />
              <h3>{t("val_3_t")}</h3>
              <p>{t("val_3_d")}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow" style={{ display: "inline-flex" }}>{t("team_title")}</span>
          </div>
          <div className="team-founder-card">
            <div className="team-founder-photo">
              <div className="team-founder-photo-frame">
                <Image
                  src="/images/founder/sai-swami-founder.jpg"
                  alt={t("founder_name")}
                  fill
                  sizes="(max-width: 760px) 280px, (max-width: 980px) 45vw, 360px"
                  style={{ objectFit: "cover", objectPosition: "50% 40%" }}
                />
              </div>
            </div>
            <div className="team-founder-copy">
              <span className="eyebrow">{t("founder_heading")}</span>
              <h2>{t("founder_name")}</h2>
              <p>{t("founder_role")}</p>
            </div>
          </div>
        </div>
      </section>

      <SocialStrip />
    </PageShell>
  );
}
