import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Empire State Roofing Co. | NYC Roofing Experts',
  description: 'Roof repair, replacement, inspections and gutter services across NYC, Long Island, Westchester and Northern New Jersey.',
  metadataBase: new URL('https://empirestateroofing.com'),
  openGraph: {
    title: 'Empire State Roofing Co. | A Stronger Roof. A Safer Home.',
    description: '18 years of trusted roofing expertise across NYC and the surrounding region.',
    type: 'website',
    images: [{ url: '/og.png', width: 1733, height: 909, alt: 'Empire State Roofing Co. — A stronger roof. A safer home.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empire State Roofing Co. | A Stronger Roof. A Safer Home.',
    description: '18 years of trusted roofing expertise across NYC and the surrounding region.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
