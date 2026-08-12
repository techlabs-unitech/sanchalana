"use client";

import { useSite } from "@/context/SiteContext";

// Minutes are computed server-side from the real word count (see
// lib/newsletters.js:readMinutes) and passed in as a plain number —
// this component only adds the localized suffix so it stays correct
// when the reader switches language.
export default function ReadingTime({ minutes }) {
  const { t } = useSite();
  return <>{minutes} {t("read_time_suffix")}</>;
}
