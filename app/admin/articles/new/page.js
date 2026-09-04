"use client";

import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <main className="admin-main">
      <div className="admin-heading-row">
        <h1>New Article</h1>
      </div>
      <ArticleForm mode="new" />
    </main>
  );
}
