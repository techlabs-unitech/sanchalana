"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugify, textToBlocks, blocksToText } from "@/lib/bodyParser";
import CoverImageUploader from "./CoverImageUploader";
import SeoPreview from "./SeoPreview";
import { COVER_ICONS } from "@/components/Icons";

const ICON_OPTIONS = Object.keys(COVER_ICONS);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ArticleForm({ mode, initialData }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [tag, setTag] = useState(initialData?.tag || "");
  const [dek, setDek] = useState(initialData?.dek || "");
  const [publishedAt, setPublishedAt] = useState(initialData?.published_at || todayISO());
  const [coverIcon, setCoverIcon] = useState(initialData?.cover_icon || "camera");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || null);
  const [bodyText, setBodyText] = useState(blocksToText(initialData?.body) || "");
  const [author, setAuthor] = useState(initialData?.author || "Sanchalana News");
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
  const [keywords, setKeywords] = useState(initialData?.keywords || "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  function handleTitleChange(v) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !slug.trim() || !dek.trim() || !bodyText.trim()) {
      setError("Title, slug, summary and body are all required.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase isn't configured yet — add your project keys to .env.local first.");
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      tag: tag.trim() || "News",
      dek: dek.trim(),
      published_at: publishedAt,
      cover_icon: coverIcon,
      cover_image_url: coverImageUrl,
      author: author.trim() || "Sanchalana News",
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      keywords: keywords.trim() || null,
      body: textToBlocks(bodyText),
    };

    const query = isEdit
      ? supabase.from("newsletters").update(payload).eq("slug", initialData.slug)
      : supabase.from("newsletters").insert(payload);

    const { error: saveError } = await query;
    setSaving(false);

    if (saveError) {
      if (saveError.code === "23505") {
        setError("That URL slug is already taken by another article — try a different one.");
      } else if (saveError.code === "42501") {
        setError("You don't have permission to save this — make sure you're signed in.");
      } else {
        setError(saveError.message);
      }
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!window.confirm(`Delete "${initialData.title}"? This can't be undone.`)) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setDeleting(true);
    const { error: deleteError } = await supabase.from("newsletters").delete().eq("slug", initialData.slug);
    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const descLen = metaDescription.length;

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-card">
        <div className="admin-field">
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>

        <div className="admin-field">
          <label htmlFor="slug">URL slug</label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
          />
          <p className="hint">
            Published at /newsletter/{slug || "…"}. Kannada titles won&rsquo;t auto-romanize — set a
            readable slug yourself for the best SEO.
          </p>
        </div>

        <div className="admin-row-2">
          <div className="admin-field">
            <label htmlFor="tag">Category / tag</label>
            <input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="ರಾಜ್ಯ, ಕ್ರೀಡೆ, ರಾಷ್ಟ್ರೀಯ…" required />
          </div>
          <div className="admin-field">
            <label htmlFor="published_at">Published date</label>
            <input id="published_at" type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} required />
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="dek">Summary (shown on cards, and used as the default SEO description)</label>
          <textarea id="dek" rows={2} value={dek} onChange={(e) => setDek(e.target.value)} required />
        </div>

        <CoverImageUploader value={coverImageUrl} onChange={setCoverImageUrl} />

        <div className="admin-field">
          <label htmlFor="coverIcon">Fallback icon (used until you upload a cover image)</label>
          <select id="coverIcon" value={coverIcon} onChange={(e) => setCoverIcon(e.target.value)}>
            {ICON_OPTIONS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="body">Article body</label>
          <textarea id="body" rows={14} value={bodyText} onChange={(e) => setBodyText(e.target.value)} required />
          <p className="hint">
            Plain paragraphs by default. Start a line with <code>## </code> for a subheading, or{" "}
            <code>{"> "}</code> for a pull quote. Leave a blank line between paragraphs.
          </p>
        </div>

        <div className="admin-field">
          <label htmlFor="author">Author</label>
          <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0, marginBottom: 4 }}>SEO</h3>
        <p className="hint" style={{ marginBottom: 18 }}>
          Controls the title/description search engines and social shares show. Leave blank to fall
          back to the title and summary above.
        </p>

        <div className="admin-field">
          <label htmlFor="metaTitle">Meta title</label>
          <input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={title || "Defaults to the title above"}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="metaDescription">Meta description</label>
          <textarea
            id="metaDescription"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder={dek || "Defaults to the summary above"}
          />
          <p className={`char-count${descLen > 160 ? " warn" : ""}`}>{descLen} / ~155 characters</p>
        </div>

        <div className="admin-field">
          <label htmlFor="keywords">Keywords (comma-separated, optional)</label>
          <input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="ಬೆಂಗಳೂರು ಮೆಟ್ರೋ, karnataka news, ..." />
        </div>

        <div className="admin-field">
          <label>Search result preview</label>
          <SeoPreview slug={slug} metaTitle={metaTitle || title} metaDescription={metaDescription || dek} />
        </div>
      </div>

      <div className="admin-heading-row" style={{ marginTop: 24, marginBottom: 0 }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish article"}
        </button>
        {isEdit && (
          <button type="button" className="admin-btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete article"}
          </button>
        )}
      </div>
    </form>
  );
}
