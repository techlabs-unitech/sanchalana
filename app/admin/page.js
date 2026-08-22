"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setItems([]);
      return;
    }
    supabase
      .from("newsletters")
      .select("slug, title, tag, published_at, updated_at, cover_image_url")
      .order("published_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        setItems(data || []);
      });
  }, []);

  return (
    <main className="admin-main">
      <div className="admin-heading-row">
        <h1>Articles</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">+ New Article</Link>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {items === null ? (
          <p style={{ padding: 24 }} className="hint">Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ padding: 24 }} className="hint">
            No articles yet. Click &ldquo;New Article&rdquo; to publish your first one.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tag</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug}>
                  <td>{item.title}</td>
                  <td>{item.tag}</td>
                  <td>{item.published_at}</td>
                  <td className="admin-actions">
                    <Link href={`/admin/articles/${item.slug}/edit`} className="btn btn-outline" style={{ padding: "7px 14px", fontSize: 13 }}>
                      Edit
                    </Link>
                    <Link href={`/newsletter/${item.slug}`} target="_blank" className="btn btn-outline" style={{ padding: "7px 14px", fontSize: 13 }}>
                      View ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
