export const metadata = {
  title: "Sai & Vamsi's Haldi and Sangeeth Event",
  description: "Join us to celebrate the Haldi and Sangeeth Ceremony of Sai Padmini & Vamsi Krishna on Friday, August 28, 2026.",
  openGraph: {
    title: "Sai & Vamsi's Haldi and Sangeeth Event",
    description: "Join us to celebrate the Haldi and Sangeeth Ceremony of Sai Padmini & Vamsi Krishna on Friday, August 28, 2026.",
    url: '/events',
    siteName: 'Sai & Vamsi Events',
    images: [
      {
        url: '/events-preview.png',
        width: 1200,
        height: 630,
        alt: 'Haldi & Sangeeth Event Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sai & Vamsi's Haldi and Sangeeth Event",
    description: "Join us to celebrate the Haldi and Sangeeth Ceremony of Sai Padmini & Vamsi Krishna.",
    images: ['/events-preview.png'],
  },
};

export default function EventsLayout({ children }) {
  return <>{children}</>;
}