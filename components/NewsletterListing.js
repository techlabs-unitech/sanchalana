"use client";

import Link from "next/link";
import Image from "next/image";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import ReadingTime from "@/components/ReadingTime";
import { COVER_ICONS, CameraIcon } from "@/components/Icons";

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

export default function NewsletterListing({ items }) {
  const { t, lang } = useSite();

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">{t("nav_home")}</Link>
            <span className="sep">/</span>
            <span className="current">{t("breadcrumb_newsletter")}</span>
          </div>
          <span className="eyebrow">{t("newsletter_eyebrow")}</span>
          <h1>{t("newsletter_title")}</h1>
          <p style={{ maxWidth: "60ch", marginTop: 10 }}>{t("newsletter_desc")}</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="grid grid-3">
            {items.map((item) => {
              const Icon = COVER_ICONS[item.cover_icon] || CameraIcon;
              return (
                <article className="card newsletter-card" key={item.slug}>
                  <div className="img-placeholder" style={{ position: "relative" }}>
                    {item.cover_image_url ? (
                      <Image
                        src={item.cover_image_url}
                        alt={item.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 760px) 100vw, 380px"
                      />
                    ) : (
                      <Icon />
                    )}
                  </div>
                  <div className="card-body">
                    <span className="tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.dek}</p>
                    <div className="newsletter-meta-row">
                      <span>{fmtDate(item.published_at, lang)}</span>
                      <span className="dot" />
                      <span><ReadingTime minutes={item.minutes} /></span>
                    </div>
                    <Link
                      href={`/newsletter/${item.slug}`}
                      className="btn btn-outline"
                      style={{ marginTop: 16, alignSelf: "flex-start" }}
                    >
                      {t("view_newsletter")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <p
            style={{
              marginTop: 32,
              fontSize: 13.5,
              textAlign: "center",
              fontFamily: "var(--font-label)",
              textTransform: "uppercase",
              letterSpacing: ".05em",
              color: "var(--text-soft)",
            }}
          >
            Each issue is a row in the Supabase <code>newsletters</code> table — insert a new row
            to publish a new issue at its own URL, no redeploy required.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
