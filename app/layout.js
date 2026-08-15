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
  metadataBase: new URL('https://saipadmini-vamsi-wedding.vercel.app'),
  title: "Vamsi Krishna & Sai Padmini's Wedding Celebration",
  description: "Join us in celebrating the Wedding Ceremony of Vamsi Krishna Chinthala & Sai Padmini Papineni.",
  openGraph: {
    title: "Vamsi Krishna & Sai Padmini's Wedding Celebration",
    description: "Join us in celebrating the Wedding Ceremony of Vamsi Krishna Chinthala & Sai Padmini Papineni.",
    url: 'https://saipadmini-vamsi-wedding.vercel.app',
    siteName: 'Sai & Vamsi Wedding Invitation',
    images: [
      {
        url: '/wedding-preview.png',
        width: 1200,
        height: 630,
        alt: 'Wedding Ceremony Invitation Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vamsi Krishna & Sai Padmini's Wedding Celebration",
    description: "Join us in celebrating the Wedding Ceremony of Vamsi Krishna Chinthala & Sai Padmini Papineni.",
    images: ['/wedding-preview.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}