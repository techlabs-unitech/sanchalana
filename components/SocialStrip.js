"use client";

import { useSite } from "@/context/SiteContext";
import { YoutubeIcon, InstagramIcon, FacebookIcon, LinkedinIcon } from "./Icons";
import { SOCIAL_LINKS } from "@/lib/siteConfig";

const SOCIALS = [
  { href: SOCIAL_LINKS.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SOCIAL_LINKS.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
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
