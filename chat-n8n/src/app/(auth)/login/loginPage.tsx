'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { setCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido.'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

interface IForm {
  email: string;
  senha: string;
}

export default function LoginPageComponente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<IForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  async function onSubmit(values: IForm) {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });

      const resJson = await res.json();

      if (res.ok) {
        const usuario = resJson.usuario;
        const { token, expiration } = resJson.value;

        setCookie('token', token, {
          expires: new Date(expiration),
          path: '/',
          secure: false,
          sameSite: 'lax',
        });

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('usuarioEmail', usuario.email);

        toast.success('Login realizado');
        router.push('/dashboards');
      } else {
        toast.error(`Autenticação falhou: ${resJson?.erro}`);
      }
    } catch {
      toast.error(`Autenticação falhou`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 px-4 py-6'>
      <div className='w-full max-w-md'>
        {/* Título */}
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-50'>
            Bem‑vindo de volta
          </h1>
          <p className='mt-2 text-sm text-slate-400'>
            Acesse o painel do chat conectado ao n8n.
          </p>
        </div>

        {/* Card de login */}
        <div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-6 py-6'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-100'>
                Login na plataforma
              </p>
              <p className='text-xs text-slate-400'>
                Use suas credenciais para entrar.
              </p>
            </div>
            <div className='h-9 w-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-xs font-semibold text-emerald-200'>
              IA
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-xs font-medium text-slate-200'>
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        autoComplete='email'
                        placeholder='voce@empresa.com'
                        className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-300' />
                  </FormItem>
                )}
              />

              <FormField
                name='senha'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-xs font-medium text-slate-200'>
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete='current-password'
                          placeholder='••••••••'
                          className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent pr-10'
                          {...field}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword((prev) => !prev)}
                          className='absolute right-2 top-2.5 text-slate-400 hover:text-slate-200'
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-xs text-red-300' />
                  </FormItem>
                )}
              />

              <div className='mt-1 flex justify-end'>
                <button
                  type='button'
                  className='text-[11px] text-emerald-300 hover:text-emerald-200'
                  // onClick={() => router.push('/forgot-password')}
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type='submit'
                disabled={loading}
                className='mt-2 w-full inline-flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/60 disabled:cursor-not-allowed text-sm font-medium text-white px-4 py-2.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]'
              >
                {loading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='animate-spin' size={18} />
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>

          <div className='mt-5 text-center'>
            <p className='text-xs text-slate-400'>
              Ainda não tem acesso?{' '}
              <Link
                href='/register'
                className='text-emerald-300 hover:text-emerald-200 font-medium'
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <p className='mt-4 text-center text-[11px] text-slate-500'>
          © {new Date().getFullYear()} Statum • Chat IA com Next.js &amp;
          Tailwind
        </p>
      </div>
    </main>
  );
}
