"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { signIn, isAuthed, configured } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthed && typeof window !== "undefined") {
    router.replace("/admin");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-card">
        <h1 style={{ fontFamily: "var(--font-display-latin)", fontSize: 22, marginTop: 0 }}>
          SANCHALANA <span style={{ color: "var(--red)" }}>ADMIN</span>
        </h1>
        <p className="hint" style={{ marginBottom: 20 }}>Sign in to manage articles.</p>

        {!configured && (
          <div className="admin-alert error">
            Supabase isn&rsquo;t configured yet — add your project keys to <code>.env.local</code> first.
          </div>
        )}
        {error && <div className="admin-alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="hint" style={{ marginTop: 18 }}>
          No account yet? Create one from your Supabase dashboard under Authentication → Users → Add User.
        </p>
      </div>
    </div>
  );
}
