"use client";

import { useState } from "react";
import Link from "next/link";
import { useSite } from "@/context/SiteContext";
import PageShell from "@/components/PageShell";
import { CameraIcon, PlayIcon } from "@/components/Icons";

const ITEMS = [
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

export default function GalleryPage() {
  const { t } = useSite();
  const [filter, setFilter] = useState("all");
  const visible = ITEMS.filter((i) => filter === "all" || i.cat === filter);

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
            {visible.map((item) => (
              <div className={`gallery-item ${item.size}`} key={item.id}>
                <div className="gtype">{t(`filter_${item.cat}`)}</div>
                <div className="img-placeholder">
                  {item.cat === "video" ? (
                    <div className="play-btn" style={{ width: 44, height: 44 }}><PlayIcon /></div>
                  ) : (
                    <CameraIcon />
                  )}
                </div>
              </div>
            ))}
          </div>

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
            Gallery images are placeholders — replace each .img-placeholder with a real
            &lt;Image /&gt;, or fetch them from a Supabase Storage bucket.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
