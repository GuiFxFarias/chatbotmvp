import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Statum Chat IA',
  description: 'Chat conectado ao n8n com Next.js e Tailwind.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body className='min-h-screen bg-slate-950 text-slate-50 antialiased'>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
