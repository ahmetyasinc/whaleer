import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://whaleer.com"),  // 🌐 Mutlaka mutlak URL olmalı
  title: "Whaleer",
  description: "Whaleer platformu",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Whaleer",
    description: "Algoritmik alım-satım dünyasında strateji geliştirme, test etme ve paylaşma platformu",
    url: "https://whaleer.com",
    siteName: "Whaleer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Whaleer Platform",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whaleer",
    description: "Algoritmik alım-satım dünyasında strateji geliştirme, test etme ve paylaşma platformu",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
