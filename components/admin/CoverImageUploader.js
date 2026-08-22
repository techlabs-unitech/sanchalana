"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Uploads a file to the public "article-covers" Storage bucket (created
// by supabase/002_admin_and_seo.sql) and returns its public URL via
// onChange. Requires an authenticated session — the bucket's write
// policy only allows signed-in admins.
export default function CoverImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase isn't configured yet.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("article-covers").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("article-covers").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="admin-field">
      <label>Cover image</label>
      <div className="admin-cover-preview">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Cover preview" />
        ) : (
          <span>No image uploaded — the tag icon will be used instead</span>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {value && (
        <button
          type="button"
          className="btn btn-outline"
          style={{ marginTop: 10, padding: "8px 14px", fontSize: 13 }}
          onClick={() => {
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          Remove image
        </button>
      )}
      {uploading && <p className="hint">Uploading…</p>}
      {error && <p className="hint" style={{ color: "var(--red)" }}>{error}</p>}
      <p className="hint">JPG/PNG/WebP recommended, under ~2MB. Also used as the Open Graph share image.</p>
    </div>
  );
}
