// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Query from './layoutCliente'; // client component

export const metadata = {
  title: 'HubAI',
  description: 'Dashboards e integrações',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-br'>
      <body className='h-screen'>
        <Query>{children}</Query>
      </body>
    </html>
  );
}
