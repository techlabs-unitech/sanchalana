"use client";

import { useSite } from "@/context/SiteContext";
import { WhatsappIcon } from "./Icons";

export default function WhatsAppFab() {
  const { t } = useSite();
  return (
    <a
      className="whatsapp-fab"
      href="https://wa.me/919972955391"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp_label")}
    >
      <WhatsappIcon />
    </a>
  );
}
