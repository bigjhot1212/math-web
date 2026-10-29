import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Sans_Thai, Noto_Sans_Thai, STIX_Two_Text } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import Nav from "./components/nav";
import { BRAND_FULL_NAME } from "@/lib/brand";

const heading = IBM_Plex_Sans_Thai({
  variable: "--font-heading",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

const body = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const stix = STIX_Two_Text({
  variable: "--font-math",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: `${BRAND_FULL_NAME} — เตรียมสอบคณิตศาสตร์`,
  description: "ฝึกโจทย์และสอบจำลอง ONET · A-Level · PAT1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${heading.variable} ${body.variable} ${stix.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav>{children}</Nav>
      </body>
    </html>
  );
}
