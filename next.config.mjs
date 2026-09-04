/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Covers cover images uploaded to Supabase Storage, whatever your
      // project's <ref>.supabase.co hostname turns out to be.
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};
export default nextConfig;
