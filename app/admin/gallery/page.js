"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { PlayIcon } from "@/components/Icons";

export default function AdminGalleryPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setItems([]);
      return;
    }
    const { data, error: fetchError } = await supabase
      .from("gallery_images")
      .select("id, image_url, media_type, video_url, caption, alt_text, size, sort_order")
      .order("sort_order", { ascending: false });
    if (fetchError) setError(fetchError.message);
    setItems(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!window.confirm("Remove this item from the gallery? This can't be undone.")) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setBusyId(id);
    const { error: deleteError } = await supabase.from("gallery_images").delete().eq("id", id);
    setBusyId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleMove(index, direction) {
    if (!items) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const a = items[index];
    const b = items[targetIndex];
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setBusyId(a.id);
    const [{ error: err1 }, { error: err2 }] = await Promise.all([
      supabase.from("gallery_images").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("gallery_images").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    setBusyId(null);

    if (err1 || err2) {
      setError((err1 || err2).message);
      return;
    }

    const next = [...items];
    next[index] = { ...b, sort_order: a.sort_order };
    next[targetIndex] = { ...a, sort_order: b.sort_order };
    setItems(next);
  }

  return (
    <main className="admin-main">
      <div className="admin-heading-row">
        <h1>Gallery</h1>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      <GalleryUploader onUploaded={load} />

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {items === null ? (
          <p style={{ padding: 24 }} className="hint">Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ padding: 24 }} className="hint">
            No gallery items yet. Use the form above to add your first photo or video.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
              padding: 20,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="admin-card"
                style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}
              >
                <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 6, overflow: "hidden", background: "var(--surface)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.alt_text || item.caption || "Gallery item"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {item.media_type === "video" && (
                    <div
                      className="play-btn"
                      style={{ position: "absolute", inset: 0, margin: "auto", width: 36, height: 36 }}
                    >
                      <PlayIcon />
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 13, color: "var(--text-soft)" }}>
                  {item.media_type === "video" ? "Video" : "Photo"}
                  {item.size ? ` · ${item.size}` : ""}
                </div>
                {item.caption && <div style={{ fontSize: 14 }}>{item.caption}</div>}
                {item.alt_text && (
                  <div style={{ fontSize: 12.5, color: "var(--text-soft)" }}>Alt: {item.alt_text}</div>
                )}

                <div className="admin-actions" style={{ marginTop: "auto" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "6px 10px", fontSize: 13 }}
                    onClick={() => handleMove(index, -1)}
                    disabled={busyId === item.id || index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "6px 10px", fontSize: 13 }}
                    onClick={() => handleMove(index, 1)}
                    disabled={busyId === item.id || index === items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "6px 10px", fontSize: 13, color: "var(--red)" }}
                    onClick={() => handleDelete(item.id)}
                    disabled={busyId === item.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
