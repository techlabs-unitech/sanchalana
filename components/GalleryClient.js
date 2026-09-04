"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import { CameraIcon, PlayIcon } from "@/components/Icons";

const PLACEHOLDER_ITEMS = [
  { id: 1, cat: "photo", size: "tall" },
  { id: 2, cat: "video", size: "" },
  { id: 3, cat: "photo", size: "wide" },
  { id: 4, cat: "photo", size: "" },
  { id: 5, cat: "video", size: "" },
  { id: 6, cat: "video", size: "tall" },
  { id: 7, cat: "photo", size: "" },
  { id: 8, cat: "photo", size: "wide" },
  { id: 9, cat: "video", size: "" },
];

export default function GalleryClient({ items }) {
  const { t } = useSite();
  const [filter, setFilter] = useState("all");

  const usingPlaceholders = !items || items.length === 0;
  const source = usingPlaceholders
    ? PLACEHOLDER_ITEMS
    : items.map((row) => ({
        id: row.id,
        cat: row.media_type,
        size: row.size || "",
        imageUrl: row.image_url,
        videoUrl: row.video_url,
        caption: row.caption,
        altText: row.alt_text,
      }));

  const visible = source.filter((i) => filter === "all" || i.cat === filter);

  return (
    <PageShell>
      <section className="page-hero" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">{t("nav_home")}</Link>
            <span className="sep">/</span>
            <span className="current">{t("breadcrumb_gallery")}</span>
          </div>
          <span className="eyebrow">{t("gallery_eyebrow")}</span>
          <h1>{t("gallery_title")}</h1>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="filter-tabs">
            {["all", "photo", "video"].map((f) => (
              <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
                {t(`filter_${f}`)}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {visible.map((item) => {
              const content = item.imageUrl ? (
                <div className="img-placeholder" style={{ position: "relative" }}>
                  <Image
                    src={item.imageUrl}
                    alt={item.altText || item.caption || t("gallery_title")}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                  {item.cat === "video" && (
                    <a
                      href={item.videoUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="play-btn"
                      style={{ width: 44, height: 44, position: "absolute", inset: 0, margin: "auto" }}
                      aria-label={item.altText || item.caption || "Play video"}
                    >
                      <PlayIcon />
                    </a>
                  )}
                </div>
              ) : (
                <div className="img-placeholder">
                  {item.cat === "video" ? (
                    <div className="play-btn" style={{ width: 44, height: 44 }}><PlayIcon /></div>
                  ) : (
                    <CameraIcon />
                  )}
                </div>
              );

              return (
                <div className={`gallery-item ${item.size}`} key={item.id}>
                  <div className="gtype">{t(`filter_${item.cat}`)}</div>
                  {content}
                </div>
              );
            })}
          </div>

          {usingPlaceholders && (
            <p
              style={{
                marginTop: 24,
                fontSize: 13.5,
                textAlign: "center",
                fontFamily: "var(--font-label)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                color: "var(--text-soft)",
              }}
            >
              Showing placeholders — add photos and videos from the admin dashboard&rsquo;s Gallery tab.
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
