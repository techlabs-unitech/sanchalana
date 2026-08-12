"use client";

import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import SocialStrip from "@/components/SocialStrip";
import { PlayIcon, CameraIcon } from "@/components/Icons";

export default function HomePage() {
  const { t } = useSite();

  return (
    <PageShell>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{t("hero_eyebrow")}</span>
            <h1>
              <span>{t("hero_title_1")}</span>
              <em>{t("hero_title_em")}</em>
              <span>{t("hero_title_2")}</span>
            </h1>
            <p>{t("hero_desc")}</p>
            <div className="hero-actions">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t("hero_btn_watch")}
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {t("hero_btn_subscribe")}
              </a>
            </div>
          </div>
          <div className="hero-media">
            <div className="ribbon-frame">
              <div className="video-box">
                {/* VIDEO PLACEHOLDER: swap for
                    <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="..." allowFullScreen /> */}
                <div className="play-btn">
                  <PlayIcon />
                </div>
                <div className="ph-label">{t("hero_video_caption")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-num">2.5L+</div><div className="stat-label">{t("stat_subs")}</div></div>
          <div className="stat-card"><div className="stat-num">10M+</div><div className="stat-label">{t("stat_views")}</div></div>
          <div className="stat-card"><div className="stat-num">5+</div><div className="stat-label">{t("stat_years")}</div></div>
          <div className="stat-card"><div className="stat-num">40+</div><div className="stat-label">{t("stat_team")}</div></div>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="videos">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t("videos_eyebrow")}</span>
            <h2>{t("videos_title")}</h2>
          </div>
          <div className="grid grid-3">
            {[
              { tagKey: "video_1_tag", titleKey: "video_1_title" },
              { tagKey: "video_2_tag", titleKey: "video_2_title" },
              { tagKey: "video_3_tag", titleKey: "video_3_title" },
            ].map((v) => (
              <article className="card" key={v.titleKey}>
                <div className="video-box">
                  <div className="play-btn"><PlayIcon /></div>
                </div>
                <div className="card-body">
                  <span className="tag">{t(v.tagKey)}</span>
                  <h3>{t(v.titleKey)}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="section-foot">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {t("videos_btn")}
            </a>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="articles" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t("articles_eyebrow")}</span>
            <h2>{t("articles_title")}</h2>
          </div>
          <div className="grid grid-3">
            {[
              { tagKey: "art_1_tag", titleKey: "art_1_title", descKey: "art_1_desc" },
              { tagKey: "art_2_tag", titleKey: "art_2_title", descKey: "art_2_desc" },
              { tagKey: "art_3_tag", titleKey: "art_3_title", descKey: "art_3_desc" },
            ].map((a) => (
              <article className="card" key={a.titleKey}>
                <div className="img-placeholder"><CameraIcon /></div>
                <div className="card-body">
                  <span className="tag">{t(a.tagKey)}</span>
                  <h3>{t(a.titleKey)}</h3>
                  <p>{t(a.descKey)}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="section-foot">
            <Link href="/newsletter" className="btn btn-outline">{t("articles_btn")}</Link>
          </div>
        </div>
      </section>

      {/* SOCIAL STRIP */}
      <SocialStrip />
    </PageShell>
  );
}
