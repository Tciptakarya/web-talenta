import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/themeScript";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Talenta Cipta Karya | LPK & LKP Resmi — Temukan Talenta, Ciptakan Karya",
  description:
    "Yayasan Talenta Cipta Karya adalah LPK dan LKP berizin resmi yang menyediakan Pelatihan Barista, Kursus Komputer, Bimbingan Belajar, Digital Marketing, Pelatihan K3, BOSIET, Basic Safety Training, Basic Sea Survival, dan Basic Fire & First Aid.",
  keywords: [
    "LPK",
    "LKP",
    "pelatihan kerja",
    "kursus",
    "barista",
    "Depok",
    "Talenta Cipta Karya",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Talenta Cipta Karya — Temukan Talenta, Ciptakan Karya",
    description:
      "LPK & LKP berizin resmi di Depok, Jawa Barat. Program pelatihan: Barista, Komputer, Digital Marketing, K3, BOSIET, dan lainnya.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://talentaciptakarya.com",
    siteName: "Talenta Cipta Karya",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable}`}
    >
      <body>
        {/* Terapkan tema tersimpan sebelum paint — cegah kedip light→dark.
            Src: lib/themeScript.ts (dipakai juga oleh halaman 404, yang
            tidak merender root layout ini). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
