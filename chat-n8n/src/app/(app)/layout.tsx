// app/layout.tsx
import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'HubAI',
  description: 'Dashboards e integrações',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
