// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar'; // Import the new Navbar component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'V-Market',
  description: 'Shopkeeper Product Transfer Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Render the Navbar component here */}
        <main className="container mx-auto py-8">
          {children}
        </main>
      </body>
    </html>
  );
}