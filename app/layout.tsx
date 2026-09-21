import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";

const kanit = Kanit({
  variable: "--font-heading",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

const sarabun = Sarabun({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MathPrep — เตรียมสอบคณิตศาสตร์",
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
      className={`${kanit.variable} ${sarabun.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
        <a
          href="https://ig.me/m/j.3ra_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="สอบถามผ่าน Instagram"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-xs font-bold">IG</span>
          สอบถามพี่ทาง Instagram
        </a>
      </body>
    </html>
  );
}
