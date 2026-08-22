// ============================================================
// EDIT THIS FILE to fill in your real links — every page picks these
// values up automatically, nothing else needs to change.
// ============================================================

// Your channel/page URLs. Used in the footer, the "Follow us" section,
// and the Contact page.
export const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@SanchalanaNews-kannada",
  instagram: "https://www.instagram.com/sanchalana_news",
  facebook: "https://www.facebook.com/895496663636367?ref=NONE_xav_ig_profile_page_web",
  linkedin: "https://www.linkedin.com/company/sanchalana-news",
};

// The two "Watch Live" / "Subscribe" buttons in the homepage hero, and
// the "Watch All Videos" button — point these at your channel or a
// specific playlist.
export const YOUTUBE_CHANNEL_URL = SOCIAL_LINKS.youtube;

// WhatsApp number for the floating chat button (bottom-right on every
// page). Digits only, with country code, no "+", no spaces or dashes.
// Example: +91 98765 43210 -> "919876543210"
export const WHATSAPP_NUMBER = "919876543210";

// The homepage hero's featured video. Paste any normal YouTube URL —
// youtu.be/XXXX, youtube.com/watch?v=XXXX, youtube.com/shorts/XXXX all
// work. Leave empty ("") to keep showing the placeholder box.
export const HERO_VIDEO_URL = "https://youtu.be/A1xioPeTU9U?si=eTahWLL7iM8ObHJy";

// The 3 cards under "Latest Video Reports" on the homepage. Leave `url`
// empty to keep that card's placeholder box; fill it in to show a real
// YouTube thumbnail that links out to the video.
export const VIDEO_CARDS = [
  { tagKey: "video_1_tag", titleKey: "video_1_title", url: "https://youtu.be/Ra3pbAwmxXs?si=Q7MPEoP4FkCbjs2J" },
  { tagKey: "video_2_tag", titleKey: "video_2_title", url: "https://youtu.be/0uE3IxYobG0?si=SXTldqiDfF28d8Qt" },
  { tagKey: "video_3_tag", titleKey: "video_3_title", url: "https://youtu.be/aLVES7EZGd0?si=9SqA_ff6-wmXc2Q8" },
];

// Shown in the footer and on the Contact page. (Address and office hours
// are bilingual, so they live in lib/dictionary.js instead — search for
// "info_addr" / "footer_addr" / "info_hours" there to edit them.)
export const CONTACT_INFO = {
  phone: "+919876543210",
  email: "contact@sanchalananews.com",
};
