"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import SocialStrip from "@/components/SocialStrip";
import { PlayIcon, CameraIcon, COVER_ICONS } from "@/components/Icons";

const ThreeScene = dynamic(() => import("@/components/3d/ThreeScene"), {
  ssr: false,
});

export default function HomeClient({ latestArticles }) {
  const { t } = useSite();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play();
    setIsPlaying(true);
  };

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
                <video
                  ref={videoRef}
                  className="hero-video"
                  src="/hero.mp4"
                  poster="/images/hero-poster.jpg"
                  controls={isPlaying}
                  playsInline
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button
                    type="button"
                    className="play-btn play-btn--overlay"
                    aria-label={t("hero_btn_watch")}
                    onClick={handlePlay}
                  >
                    <PlayIcon />
                  </button>
                )}
                {!isPlaying && <div className="ph-label">{t("hero_video_caption")}</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
            {/* 3D NEWS VISUAL */}
      <section className="three-d-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">EXPLORE</span>
            <h2>Experience News in 3D</h2>
          </div>

          <ThreeScene />
        </div>
      </section>
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

      {/* ARTICLES — pulled live from Supabase (the admin dashboard writes
          here); falls back to the bundled sample content until you've
          published anything yourself. */}
      <section className="articles" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t("articles_eyebrow")}</span>
            <h2>{t("articles_title")}</h2>
          </div>
          <div className="grid grid-3">
            {latestArticles.map((a) => {
              const Icon = COVER_ICONS[a.cover_icon] || CameraIcon;
              return (
                <article className="card" key={a.slug}>
                  <div className="img-placeholder" style={{ position: "relative" }}>
                    {a.cover_image_url ? (
                      <Image
                        src={a.cover_image_url}
                        alt={a.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 760px) 100vw, 380px"
                      />
                    ) : (
                      <Icon />
                    )}
                  </div>
                  <div className="card-body">
                    <span className="tag">{a.tag}</span>
                    <h3>{a.title}</h3>
                    <p>{a.dek}</p>
                  </div>
                  <Link href={`/newsletter/${a.slug}`} style={{ position: "absolute", inset: 0 }} aria-label={a.title} />
                </article>
              );
            })}
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
