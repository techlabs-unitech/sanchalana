"use client";

import { useSite } from "@/context/SiteContext";
import { WhatsappIcon } from "./Icons";
import { WHATSAPP_NUMBER } from "@/lib/siteConfig";

export default function WhatsAppFab() {
  const { t } = useSite();
  return (
    <a
      className="whatsapp-fab"
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp_label")}
    >
      <WhatsappIcon />
    </a>
  );
}
