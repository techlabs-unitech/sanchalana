"use client";

import { useState } from "react";
import { useSite } from "@/context/SiteContext";

export default function ShareButtons({ title }) {
  const { t } = useSite();
  const [copied, setCopied] = useState(false);

  function shareWhatsApp() {
    const text = encodeURIComponent(`${title} — ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard API unavailable — silently ignore, the URL is visible in the address bar
    }
  }

  return (
    <div className="reader-share">
      <span>{t("share_label")}</span>
      <button className="btn btn-outline" style={{ padding: "9px 16px", fontSize: 13 }} onClick={shareWhatsApp}>
        WhatsApp
      </button>
      <button className="btn btn-outline" style={{ padding: "9px 16px", fontSize: 13 }} onClick={copyLink}>
        {copied ? "Link Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
