import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { siteMetadata } from '@/data/siteMetadata';
import { OverlayProvider } from '@/context/OverlayContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommandPalette from '@/components/overlays/CommandPalette';
import MiniTerminal from '@/components/overlays/MiniTerminal';
import './globals.css';

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: `${siteMetadata.name} | ${siteMetadata.title}`,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  keywords: [
    'Mohammed Ferwana',
    'Backend Engineer',
    'Software Engineer',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'System Architecture',
    'REST APIs',
    'Palestine',
  ],
  authors: [{ name: siteMetadata.name, url: siteMetadata.siteUrl }],
  creator: siteMetadata.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteMetadata.siteUrl,
    title: `${siteMetadata.name} | ${siteMetadata.title}`,
    description: siteMetadata.description,
    siteName: siteMetadata.name,
    images: [
      {
        url: siteMetadata.ogImage,
        width: 800,
        height: 800,
        alt: `${siteMetadata.name} — ${siteMetadata.title}`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `${siteMetadata.name} | ${siteMetadata.title}`,
    description: siteMetadata.description,
    images: [siteMetadata.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased font-sans flex flex-col selection:bg-accent/30 selection:text-white">
        {/* Skip to Content Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <OverlayProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <MiniTerminal />
        </OverlayProvider>
      </body>
    </html>
  );
}
