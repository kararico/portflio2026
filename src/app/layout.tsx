import type { Metadata } from 'next';
import { Gilda_Display, Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Preloader from '@/components/Preloader/Preloader';
import CursorProvider from '@/components/Cursor/CursorProvider';
import SmoothScrollProvider from '@/components/SmoothScroll/SmoothScrollProvider';
import LandscapeOrientationOverlay from '@/components/LandscapeOrientationOverlay/LandscapeOrientationOverlay';
import ProjectTransitionProvider from '@/components/ProjectTransition/ProjectTransitionProvider';
import { siteConfig } from '@/data/site';
import '@/styles/globals.scss';

const gildaDisplay = Gilda_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gilda',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Jungwon Heo — ${siteConfig.position.title}`,
    template: '%s | Jungwon Heo',
  },
  description: siteConfig.position.seoDescription,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${gildaDisplay.variable} ${inter.variable}`}>
      <body data-cursor-style="default">
        <Preloader />
        <CursorProvider>
          <SmoothScrollProvider>
            <LandscapeOrientationOverlay />
            <ProjectTransitionProvider>
              <Header />
              <div id="main-transition" className="mainTransition">
                <div className="scrollContainer" data-scroll-container id="scroll-container">
                  <main>{children}</main>
                </div>
              </div>
            </ProjectTransitionProvider>
          </SmoothScrollProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
