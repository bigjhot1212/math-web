import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-thai/500.css";
import "@fontsource/ibm-plex-sans-thai/600.css";
import "@fontsource/ibm-plex-sans-thai/700.css";
import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/500.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/700.css";
import "@fontsource/stix-two-text/400.css";
import "@fontsource/stix-two-text/500.css";
import "@fontsource/stix-two-text/600.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import Nav from "./components/nav";
import { BRAND_FULL_NAME } from "@/lib/brand";

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
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav>{children}</Nav>
      </body>
    </html>
  );
}
