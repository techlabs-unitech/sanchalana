"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Uploads a file to the public "gallery-images" Storage bucket (created by
// supabase/004_gallery.sql), inserts a row into gallery_images, and tells
// the parent to refresh its list. Requires an authenticated session — the
// bucket's write policy and the table's insert policy only allow signed-in
// admins.
export default function GalleryUploader({ onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState("photo");
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [size, setSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function resetForm() {
    setFile(null);
    setPreviewUrl(null);
    setMediaType("photo");
    setVideoUrl("");
    setCaption("");
    setAltText("");
    setSize("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Choose an image file to upload first — for videos, this is used as the thumbnail.");
      return;
    }
    if (mediaType === "video" && !videoUrl.trim()) {
      setError("Add the video URL (e.g. a YouTube link) for a video item.");
      return;
    }
    if (!altText.trim()) {
      setError("Add alt text describing the image — this is what search engines and screen readers use.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase isn't configured yet.");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("gallery-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("gallery-images").getPublicUrl(path);

    // New items go to the front of the gallery.
    const { data: maxRow } = await supabase
      .from("gallery_images")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

    const { error: insertError } = await supabase.from("gallery_images").insert({
      image_url: publicUrlData.publicUrl,
      media_type: mediaType,
      video_url: mediaType === "video" ? videoUrl.trim() : null,
      caption: caption.trim() || null,
      alt_text: altText.trim(),
      size,
      sort_order: nextSortOrder,
    });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    resetForm();
    onUploaded?.();
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2 style={{ marginTop: 0 }}>Add to gallery</h2>

      <div className="admin-field">
        <label>Image file</label>
        <div className="admin-cover-preview">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Selected preview" />
          ) : (
            <span>Choose a photo, or a thumbnail image for a video</span>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        <p className="hint">JPG/PNG/WebP recommended, under ~2MB.</p>
      </div>

      <div className="admin-field">
        <label>Alt text</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe what's in the image, e.g. Volunteers distributing water at flood relief camp"
          disabled={uploading}
        />
        <p className="hint">Required — this is what shows up in Google Images and screen readers, so be specific.</p>
      </div>

      <div className="admin-field">
        <label>Type</label>
        <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} disabled={uploading}>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </div>

      {mediaType === "video" && (
        <div className="admin-field">
          <label>Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            disabled={uploading}
          />
        </div>
      )}

      <div className="admin-field">
        <label>Caption (optional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Short description shown with the item"
          disabled={uploading}
        />
      </div>

      <div className="admin-field">
        <label>Grid size</label>
        <select value={size} onChange={(e) => setSize(e.target.value)} disabled={uploading}>
          <option value="">Normal</option>
          <option value="wide">Wide (spans 2 columns)</option>
          <option value="tall">Tall (spans 2 rows)</option>
        </select>
      </div>

      {error && <p className="hint" style={{ color: "var(--red)" }}>{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={uploading}>
        {uploading ? "Uploading…" : "Add to gallery"}
      </button>
    </form>
  );
}
