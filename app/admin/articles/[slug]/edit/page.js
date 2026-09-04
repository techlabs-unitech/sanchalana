"use client";

import { useEffect, useState } from "react";
import ArticleForm from "@/components/admin/ArticleForm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function EditArticlePage({ params }) {
  const [article, setArticle] = useState(undefined); // undefined = loading, null = not found
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setArticle(null);
      return;
    }
    supabase
      .from("newsletters")
      .select("*")
      .eq("slug", params.slug)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        setArticle(data || null);
      });
  }, [params.slug]);

  return (
    <main className="admin-main">
      <div className="admin-heading-row">
        <h1>Edit Article</h1>
      </div>
      {error && <div className="admin-alert error">{error}</div>}
      {article === undefined && <p className="hint">Loading…</p>}
      {article === null && !error && <p className="hint">Article not found.</p>}
      {article && <ArticleForm mode="edit" initialData={article} />}
    </main>
  );
}
