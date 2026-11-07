"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import SocialStrip from "@/components/SocialStrip";
import { PlayIcon, CameraIcon, COVER_ICONS } from "@/components/Icons";

const CATEGORY_ITEMS = [
  { key: "politics", accent: "red" },
  { key: "economy", accent: "blue" },
  { key: "sports", accent: "red" },
  { key: "culture", accent: "blue" },
];

const VIDEO_REPORTS = [
  { tagKey: "video_1_tag", titleKey: "video_1_title", href: "https://www.youtube.com/@SanchalanaNews-kannada" },
  { tagKey: "video_2_tag", titleKey: "video_2_title", href: "https://www.youtube.com/@SanchalanaNews-kannada" },
  { tagKey: "video_3_tag", titleKey: "video_3_title", href: "https://www.youtube.com/@SanchalanaNews-kannada" },
];

export default function HomeClient({ latestArticles }) {
  const { t } = useSite();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play();
    setIsPlaying(true);
  };

  const featuredArticle = latestArticles[0] || null;
  const trendingArticles = latestArticles.slice(1, 4);
  const visibleArticles = latestArticles.filter((article) => {
    const haystack = `${article.title} ${article.dek} ${article.tag}`.toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  return (
    <PageShell>
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

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-num">2.5L+</div><div className="stat-label">{t("stat_subs")}</div></div>
          <div className="stat-card"><div className="stat-num">10M+</div><div className="stat-label">{t("stat_views")}</div></div>
          <div className="stat-card"><div className="stat-num">5+</div><div className="stat-label">{t("stat_years")}</div></div>
          <div className="stat-card"><div className="stat-num">40+</div><div className="stat-label">{t("stat_team")}</div></div>
        </div>
      </section>

      <section className="spotlight">
        <div className="wrap spotlight-grid">
          <article className="feature-story card">
            <div className="feature-media">
              {featuredArticle?.cover_image_url ? (
                <Image
                  src={featuredArticle.cover_image_url}
                  alt={featuredArticle.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 760px) 100vw, 720px"
                />
              ) : (
                <div className="feature-placeholder">
                  <CameraIcon />
                </div>
              )}
            </div>
            <div className="feature-body">
              <span className="tag">{featuredArticle?.tag || t("featured_story_tag")}</span>
              <h2>{featuredArticle?.title || t("featured_story_title")}</h2>
              <p>{featuredArticle?.dek || t("featured_story_desc")}</p>
              <div className="feature-meta">
                <span>{featuredArticle?.author || "Sanchalana News"}</span>
                <span>{featuredArticle?.published_at ? new Date(featuredArticle.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today"}</span>
              </div>
              {featuredArticle && <Link href={`/newsletter/${featuredArticle.slug}`} className="btn btn-primary">{t("read_story")}</Link>}
            </div>
          </article>

          <aside className="feature-rail card">
            <div className="rail-header">
              <span className="eyebrow">{t("trending_eyebrow")}</span>
            </div>
            {trendingArticles.length > 0 ? (
              trendingArticles.map((article) => (
                <Link href={`/newsletter/${article.slug}`} className="news-brief" key={article.slug}>
                  <span className="news-brief__tag">{article.tag}</span>
                  <h3>{article.title}</h3>
                  <p>{article.dek}</p>
                </Link>
              ))
            ) : (
              <p className="empty-state">{t("no_results")}</p>
            )}
          </aside>
        </div>
      </section>

      <section className="categories">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t("category_eyebrow")}</span>
            <h2>{t("category_title")}</h2>
          </div>
          <div className="category-grid">
            {CATEGORY_ITEMS.map(({ key, accent }) => (
              <div className={`category-card ${accent}`} key={key}>
                <span className="category-kicker">{t(`${key}_label`)}</span>
                <h3>{t(`${key}_title`)}</h3>
                <p>{t(`${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="articles" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t("articles_eyebrow")}</span>
            <h2>{t("articles_title")}</h2>
          </div>

          <div className="news-tools">
            <label className="sr-only" htmlFor="story-search">{t("search_news")}</label>
            <input
              id="story-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("search_news")}
            />
          </div>

          {visibleArticles.length > 0 ? (
            <div className="grid grid-3">
              {visibleArticles.map((a) => {
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
          ) : (
            <div className="empty-state">{t("no_results")}</div>
          )}
        </div>
      </section>

      <section className="videos">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t("videos_eyebrow")}</span>
            <h2>{t("videos_title")}</h2>
          </div>
          <div className="grid grid-3">
            {VIDEO_REPORTS.map(({ tagKey, titleKey, href }) => (
              <article className="card video-card" key={titleKey}>
                <div className="video-box">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="play-btn" aria-label={t(titleKey)}>
                    <PlayIcon />
                  </a>
                </div>
                <div className="card-body">
                  <span className="tag">{t(tagKey)}</span>
                  <h3>{t(titleKey)}</h3>
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

      <SocialStrip />
    </PageShell>
  );
}
