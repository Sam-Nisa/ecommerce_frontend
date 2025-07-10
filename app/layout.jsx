import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Font configuration
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Optional but helps avoid flash of unstyled text
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'E-Commerces',
  description: 'A secure admin dashboard built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning hides React's hydration mismatch warning on <html>/<body> level */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
