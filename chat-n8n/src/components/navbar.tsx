'use client';

import { apiLogout } from '@/app/(auth)/login/api/apiLogout';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Chatbot', href: '/chatbot' },
  { name: 'Dashboard', href: '/dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await apiLogout();
      toast.success('Sessão encerrada');
      router.push('/login');
    } catch {
      toast.error('Erro ao sair');
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className='sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-2xl bg-emerald-500/20 border border-emerald-400/70 flex items-center justify-center text-[11px] font-semibold text-emerald-200'>
            IA
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-slate-50'>
              Statum • Chat IA
            </span>
            <span className='text-[11px] text-slate-400'>
              n8n Webhook integrado
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className='flex items-center gap-6'>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? 'text-emerald-300'
                    : 'text-slate-300 hover:text-emerald-200'
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <button
            type='button'
            onClick={handleLogout}
            disabled={loading}
            className='text-xs cursor-pointer font-medium px-3 py-1.5 rounded-2xl border border-emerald-400/70 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </div>
    </nav>
  );
}
