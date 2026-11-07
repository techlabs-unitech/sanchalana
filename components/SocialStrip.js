"use client";

import { useSite } from "@/context/SiteContext";
import { YoutubeIcon, InstagramIcon, FacebookIcon, LinkedinIcon, XIcon } from "./Icons";

const SOCIALS = [
  { href: "https://www.youtube.com/@SanchalanaNews-kannada", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://www.instagram.com/sanchalana_news", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.facebook.com/895496663636367?ref=NONE_xav_ig_profile_page_web", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.linkedin.com/company/sanchalana-news/", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://x.com/SanchalanaNews", label: "X", Icon: XIcon },
];

export default function SocialStrip() {
  const { t } = useSite();
  return (
    <section className="social-strip">
      <div className="wrap">
        <div>
          <h3>{t("social_title")}</h3>
          <p>{t("social_desc")}</p>
        </div>
        <div className="social-icons">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
