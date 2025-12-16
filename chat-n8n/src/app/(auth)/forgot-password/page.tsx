'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(false);
    setLoading(true);

    try {
      // Aqui você chama /api/forgot-password ou webhook do n8n
      // para enviar o e-mail de reset com token.
      await new Promise((res) => setTimeout(res, 1000));

      setSent(true);
    } catch {
      setError('Não foi possível enviar o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 px-4 py-6'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-50'>
            Esqueceu a senha?
          </h1>
          <p className='mt-2 text-sm text-slate-400'>
            Informe seu e-mail para receber um link de redefinição.
          </p>
        </div>

        <div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-6 py-6'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-100'>
                Recuperar acesso
              </p>
              <p className='text-xs text-slate-400'>
                Enviaremos um link seguro para o seu e-mail.
              </p>
            </div>
            <div className='h-9 w-9 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-xs font-semibold text-amber-200'>
              ?
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-1'>
              <label
                htmlFor='email'
                className='block text-xs font-medium text-slate-200'
              >
                E-mail cadastrado
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
              <p className='mt-1 text-[11px] text-slate-500'>
                Verifique também a caixa de spam após enviar o pedido.
              </p>
            </div>

            {error && (
              <div className='rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
                {error}
              </div>
            )}

            {sent && !error && (
              <div className='rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200'>
                Enviamos um link de redefinição para{' '}
                <span className='font-semibold'>{email}</span>. Siga as
                instruções no e-mail para criar uma nova senha.
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
                  Enviando link...
                </span>
              ) : (
                'Enviar link de redefinição'
              )}
            </button>
          </form>

          <div className='mt-5 text-center space-y-1'>
            <p className='text-xs text-slate-400'>
              Lembrou a senha?{' '}
              <Link
                href='/login'
                className='text-emerald-300 hover:text-emerald-200 font-medium'
              >
                Voltar para o login
              </Link>
            </p>
            <p className='text-[11px] text-slate-500'>
              Se não receber o e-mail em alguns minutos, fale com o
              administrador.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
