"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

function AdminChrome({ children }) {
  const { loading, isAuthed, configured, user, signOut } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage && !loading && !isAuthed) {
    if (typeof window !== "undefined") router.replace("/admin/login");
    return null;
  }

  return (
    <div className="admin-shell">
      {!isLoginPage && isAuthed && (
        <div className="admin-topbar">
          <Link href="/admin" className="brand-name">
            SANCHALANA <span>ADMIN</span>
          </Link>
          <div className="admin-topbar-links">
            <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>Articles</Link>
            <Link href="/admin/articles/new" className={pathname === "/admin/articles/new" ? "active" : ""}>New Article</Link>
            <Link href="/" target="_blank">View site ↗</Link>
            {user && <span style={{ color: "var(--text-soft)" }}>{user.email}</span>}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/admin/login");
              }}
              style={{ background: "none", border: "none", color: "var(--text-soft)", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: ".04em", fontSize: 14 }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {!configured && !isLoginPage && (
        <div className="admin-main" style={{ paddingTop: 24 }}>
          <div className="admin-alert error">
            Supabase isn&rsquo;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, run{" "}
            <code>supabase/schema.sql</code> and <code>supabase/002_admin_and_seo.sql</code>, then
            create an admin user under Authentication → Users in the Supabase dashboard.
          </div>
        </div>
      )}

      {(isLoginPage || isAuthed || loading) && children}
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminAuthProvider>
  );
}
