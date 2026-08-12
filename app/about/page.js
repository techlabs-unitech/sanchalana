"use client";

import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import SocialStrip from "@/components/SocialStrip";
import { ShieldIcon, BoltIcon, PeopleIcon, PersonIcon, SignalIcon } from "@/components/Icons";

const TEAM = [
  { nameKey: "team_1_n", roleKey: "team_1_r" },
  { nameKey: "team_2_n", roleKey: "team_2_r" },
  { nameKey: "team_3_n", roleKey: "team_3_r" },
  { nameKey: "team_4_n", roleKey: "team_4_r" },
];

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
          <div className="ribbon-frame">
            <div className="img-placeholder" style={{ aspectRatio: "4/3" }}>
              <SignalIcon width={34} height={34} />
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
          <div className="grid grid-4">
            {TEAM.map((member) => (
              <div className="card team-card" key={member.nameKey}>
                <div className="img-placeholder"><PersonIcon /></div>
                <div className="card-body">
                  <h3>{t(member.nameKey)}</h3>
                  <div className="role">{t(member.roleKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialStrip />
    </PageShell>
  );
}
