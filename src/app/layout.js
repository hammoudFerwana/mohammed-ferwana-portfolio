import { Mona_Sans } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { siteMetadata } from '@/data/siteMetadata';
import { OverlayProvider } from '@/context/OverlayContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommandPalette from '@/components/overlays/CommandPalette';
import MotionProvider from '@/components/shared/MotionProvider';
import './globals.css';

const monaSans = Mona_Sans({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-mona',
});

const metadataBaseUrl = (() => {
  try {
    return new URL(siteMetadata.siteUrl);
  } catch {
    return new URL('http://localhost:3000');
  }
})();

export const metadata = {
  metadataBase: metadataBaseUrl,
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
    'Gaza, Palestine',
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

const themeInitScript = `(function(){try{var t=localStorage.getItem('hz-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;return;}}catch(e){}try{document.documentElement.dataset.theme=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${monaSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript><style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style></noscript>
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased font-sans flex flex-col selection:bg-violet/30 selection:text-ink">
        {/* Skip to Content Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-btn focus:text-btn-fg focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>

        <ThemeProvider>
          <OverlayProvider>
            <MotionProvider>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <CommandPalette />
            </MotionProvider>
          </OverlayProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
