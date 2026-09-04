import { getAllGalleryImages } from "@/lib/gallery";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import GalleryClient from "@/components/GalleryClient";

// Gallery items are added/removed from the admin dashboard at any time,
// so this page must fetch fresh on every request rather than being
// statically generated at build time (the default for a Server Component
// with no dynamic data hooks) — otherwise newly added images wouldn't
// show up until the next deploy.
export const revalidate = 0;

const TITLE = "Photo & Video Gallery";
const DESCRIPTION = `Photos and videos from ${SITE_NAME} — coverage, events and behind-the-scenes moments.`;

export async function generateMetadata() {
  const url = `${SITE_URL}/gallery`;
  const items = await getAllGalleryImages();
  const image = items[0]?.image_url || `${SITE_URL}/images/logo.jpg`;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: SITE_NAME,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [image],
    },
  };
}

export default async function GalleryPage() {
  const items = await getAllGalleryImages();

  // ImageGallery structured data — helps individual photos surface in
  // Google Images with the right title/description, on top of the meta
  // tags set in generateMetadata above.
  const jsonLd =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: `${SITE_NAME} — Gallery`,
          url: `${SITE_URL}/gallery`,
          image: items.map((item) => ({
            "@type": "ImageObject",
            contentUrl: item.image_url,
            name: item.alt_text || item.caption || undefined,
            description: item.caption || item.alt_text || undefined,
          })),
        }
      : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <GalleryClient items={items} />
    </>
  );
}
