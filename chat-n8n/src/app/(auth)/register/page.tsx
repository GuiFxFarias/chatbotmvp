'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      // Aqui você pode chamar /api/register ou um webhook no n8n
      await new Promise((res) => setTimeout(res, 1000));

      // Exemplo: redireciona para login depois de "cadastrar"
      window.location.href = '/login';
    } catch {
      setError('Não foi possível criar sua conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 px-4 py-6'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-50'>
            Criar conta
          </h1>
          <p className='mt-2 text-sm text-slate-400'>
            Cadastre-se para usar o chat e o dashboard.
          </p>
        </div>

        <div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-6 py-6'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-100'>
                Informações básicas
              </p>
              <p className='text-xs text-slate-400'>
                Preencha seus dados para criar o acesso.
              </p>
            </div>
            <div className='h-9 w-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-xs font-semibold text-emerald-200'>
              New
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-1'>
              <label
                htmlFor='name'
                className='block text-xs font-medium text-slate-200'
              >
                Nome completo
              </label>
              <input
                id='name'
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                placeholder='Seu nome'
              />
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='email'
                className='block text-xs font-medium text-slate-200'
              >
                E-mail corporativo
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                placeholder='voce@empresa.com'
              />
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='password'
                className='block text-xs font-medium text-slate-200'
              >
                Senha
              </label>
              <input
                id='password'
                type='password'
                autoComplete='new-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                placeholder='Mínimo 8 caracteres'
              />
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='confirm'
                className='block text-xs font-medium text-slate-200'
              >
                Confirmar senha
              </label>
              <input
                id='confirm'
                type='password'
                autoComplete='new-password'
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                placeholder='Repita a senha'
              />
            </div>

            {error && (
              <div className='rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='mt-2 w-full inline-flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/60 disabled:cursor-not-allowed text-sm font-medium text-white px-4 py-2.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]'
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <span className='h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                  Criando conta...
                </span>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          <div className='mt-5 text-center'>
            <p className='text-xs text-slate-400'>
              Já tem conta?{' '}
              <Link
                href='/login'
                className='text-emerald-300 hover:text-emerald-200 font-medium'
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <p className='mt-4 text-center text-[11px] text-slate-500'>
          Seus dados são usados apenas para autenticação interna.
        </p>
      </div>
    </main>
  );
}
