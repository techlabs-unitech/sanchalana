import "./globals.css";
import { SiteProvider } from "@/context/SiteContext";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sanchalana News | ಸಂಚಲನ ನ್ಯೂಸ್",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Sanchalana News — Karnataka's 24x7 Kannada news channel. Watch live, read the latest articles and stay updated.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.jpg`,
  sameAs: ["https://www.youtube.com/@SanchalanaNews-kannada", "https://www.instagram.com/sanchalana_news", "https://www.facebook.com/895496663636367?ref=NONE_xav_ig_profile_page_web", "https://linkedin.com"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="kn" data-lang="kn" data-theme="light">
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}