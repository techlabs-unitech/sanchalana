"use client";

import Link from "next/link";
import Image from "next/image";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import ReadingTime from "@/components/ReadingTime";
import ReadAloudButton from "@/components/ReadAloudButton";
import ShareButtons from "@/components/ShareButtons";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { ClockIcon, CalendarIcon, LockIcon, COVER_ICONS, CameraIcon } from "@/components/Icons";

function fmtDate(iso, lang) {
  try {
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-IN" : "kn-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function Block({ block }) {
  if (block.type === "h2") return <h2>{block.text}</h2>;
  if (block.type === "quote") return <blockquote>“{block.text}”</blockquote>;
  return <p>{block.text}</p>;
}

// Locked-theme reader page: Header is rendered with `locked`, which hides
// the dark/light toggle, and the .reader-page class (see globals.css)
// redefines every theme CSS variable locally so the page looks identical
// to every reader no matter what theme they'd chosen on the rest of the site.
export default function NewsletterReader({ newsletter, minutes }) {
  const { t, lang } = useSite();
  const Icon = COVER_ICONS[newsletter.cover_icon] || CameraIcon;
  const plainText = newsletter.body.map((b) => b.text).join(" ");
  const videoEmbedUrl = getYoutubeEmbedUrl(newsletter.youtube_url);

  return (
    <PageShell locked bodyClassName="reader-page">
      <section className="reader-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">{t("nav_home")}</Link>
            <span className="sep">/</span>
            <Link href="/newsletter">{t("nav_newsletter")}</Link>
            <span className="sep">/</span>
            <span className="current">{newsletter.title}</span>
          </div>
          <div className="reader-kicker">
            <span className="tag">{newsletter.tag}</span>
          </div>
          <h1 className="reader-title">{newsletter.title}</h1>

          {videoEmbedUrl && (
            <div className="reader-video">
              <iframe
                src={videoEmbedUrl}
                title={newsletter.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <p className="reader-dek">{newsletter.dek}</p>

          <div className="reader-toolbar">
            <div className="reader-meta">
              <span><ClockIcon width={16} height={16} /> <ReadingTime minutes={minutes} /></span>
              <span><CalendarIcon width={16} height={16} /> {t("published_on")}: {fmtDate(newsletter.published_at, lang)}</span>
            </div>
            <ReadAloudButton text={plainText} />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 12 }}>
        <div className="wrap">
          <div className="reader-cover">
            {newsletter.cover_image_url ? (
              <Image
                src={newsletter.cover_image_url}
                alt={newsletter.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 720px) 100vw, 720px"
              />
            ) : (
              <Icon width={40} height={40} />
            )}
          </div>

          <div className="article-content">
            {newsletter.body.map((block, i) => (
              <Block block={block} key={i} />
            ))}
          </div>

          <ShareButtons title={newsletter.title} />

          <p className="locked-theme-note">
            <LockIcon />
            <span>{t("locked_theme_note")}</span>
          </p>

          <div className="reader-related">
            <Link href="/newsletter" className="btn btn-primary">{t("back_to_newsletter")}</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
