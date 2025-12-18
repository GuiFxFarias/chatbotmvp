// app/layout.tsx
import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Power Moendas',
  description: 'Dashboards e integrações',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-br'>
      <body className='h-screen antialiased'>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
