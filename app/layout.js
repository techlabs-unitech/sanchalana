import "./globals.css";
import { SiteProvider } from "@/context/SiteContext";

export const metadata = {
  title: "Sanchalana News | ಸಂಚಲನ ನ್ಯೂಸ್",
  description:
    "Sanchalana News — Karnataka's 24x7 Kannada news channel. Watch live, read the latest articles and stay updated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kn" data-lang="kn" data-theme="light">
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
