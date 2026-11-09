import type { Metadata, Viewport } from "next";
import { Inter_Tight, Mulish } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterGate } from "@/components/layout/FooterGate";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Analytics } from "@/components/layout/Analytics";
import { SITE_URL } from "@/data/site";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IRPIN BRIDGE — креативна студія, мерч і кастомізація одягу",
    template: "%s — IRPIN BRIDGE",
  },
  description:
    "Креативна студія та соціальне підприємство з Ірпеня: власне виробництво одягу, корпоративний мерч, арт-колаборації з митцями, DTF-друк і машинна вишивка.",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "IRPIN BRIDGE",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${interTight.variable} ${mulish.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Перейти до змісту
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <FooterGate>
          <Footer />
        </FooterGate>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
