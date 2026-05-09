import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Dynastica — Historical Genealogy & Dynasty Database",
    template: "%s · Dynastica",
  },
  description:
    "Explore historical dynasties, royal family trees, and biographies of the figures who shaped them.",
  openGraph: {
    siteName: "Dynastica",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-stone-200 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-500 flex flex-col sm:flex-row sm:justify-between gap-2">
            <p>© {new Date().getFullYear()} Dynastica. Historical content for educational use.</p>
            <nav aria-label="Footer">
              <ul className="flex gap-4">
                <li><Link href="/dynasties" className="hover:underline">Dynasties</Link></li>
                <li><Link href="/about" className="hover:underline">About</Link></li>
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
