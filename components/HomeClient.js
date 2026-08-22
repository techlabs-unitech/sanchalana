"use client";

import Link from "next/link";
import Image from "next/image";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import SocialStrip from "@/components/SocialStrip";
import { PlayIcon, CameraIcon, COVER_ICONS } from "@/components/Icons";
import { YOUTUBE_CHANNEL_URL, HERO_VIDEO_URL, VIDEO_CARDS } from "@/lib/siteConfig";
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/youtube";

export default function HomeClient({ latestArticles }) {
  const { t } = useSite();
  const heroEmbedUrl = getYoutubeEmbedUrl(HERO_VIDEO_URL);

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
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t("hero_btn_watch")}
              </a>
              
            </div>
          </div>
          <div className="hero-media">
            <div className="ribbon-frame">
              <div className="video-box">
                {heroEmbedUrl ? (
                  <iframe
                    src={heroEmbedUrl}
                    title="Featured video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="play-btn">
                      <PlayIcon />
                    </div>
                    <div className="ph-label">{t("hero_video_caption")}</div>
                  </>
                )}
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
            {VIDEO_CARDS.map((v) => {
              const thumb = getYoutubeThumbnail(v.url);
              const CardInner = (
                <>
                  <div className="video-box">
                    {thumb ? (
                      <Image src={thumb} alt={t(v.titleKey)} fill style={{ objectFit: "cover" }} sizes="(max-width: 760px) 100vw, 380px" />
                    ) : null}
                    <div className="play-btn" style={{ position: thumb ? "relative" : undefined, zIndex: 1 }}><PlayIcon /></div>
                  </div>
                  <div className="card-body">
                    <span className="tag">{t(v.tagKey)}</span>
                    <h3>{t(v.titleKey)}</h3>
                  </div>
                </>
              );
              return v.url ? (
                <a className="card" key={v.titleKey} href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                  {CardInner}
                </a>
              ) : (
                <article className="card" key={v.titleKey}>
                  {CardInner}
                </article>
              );
            })}
          </div>
          <div className="section-foot">
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
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
