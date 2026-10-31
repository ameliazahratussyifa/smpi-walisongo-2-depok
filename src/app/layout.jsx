import './globals.css';

export const metadata = {
  title: 'SMP Islam Walisongo 2 Depok - Beriman, Cerdas, dan Berakhlakul Karimah',
  description:
    'Website Resmi SMP Islam Walisongo 2 Depok. Sekolah Menengah Pertama Islam Berakreditasi A di Cilodong Depok, naungan Yayasan Pondok Pesantren Hj. Dardjah Amin. PPDB Online 2026/2027.',
  icons: {
    icon: '/static/images/logo-sekolah.png',
    apple: '/static/images/logo-sekolah.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0284c7',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
