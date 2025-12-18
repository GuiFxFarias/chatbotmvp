'use client';

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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { apiCadastrarUsuario } from './api/apiCadastraUsuario';
import { FormattedInput } from '@/components/ui/patternFormatComp';
import Link from 'next/link';

const formSchema = z.object({
  nome: z.string().min(3, 'Informe um nome válido'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Informe um telefone válido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      senha: '',
    },
  });

  const { mutate: cadastrar, isPending } = useMutation({
    mutationFn: apiCadastrarUsuario,
    onSuccess: () => {
      toast.success('Usuário cadastrado com sucesso!');
      toast.success('Redirecionando para o login');
      setTimeout(() => router.push('/login'), 1500);
    },
    onError: (error) => {
      toast.error(error?.message || 'Erro ao cadastrar usuário');
    },
  });

  const onSubmit = (values: FormValues) => {
    cadastrar(values);
  };

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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-1'>
                <FormField
                  control={form.control}
                  name='nome'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-xs font-medium text-slate-200'>
                        Nome
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Digite seu nome'
                          className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-1'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-xs font-medium text-slate-200'>
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                          placeholder='exemplo@email.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-1'>
                <FormField
                  control={form.control}
                  name='telefone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-xs font-medium text-slate-200'>
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <FormattedInput
                          {...field}
                          className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                          format='(##) #####-####'
                          onValueChange={(values: { value: unknown }) => {
                            field.onChange(values.value);
                          }}
                          placeholder='(11) 91234-5678'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-1'>
                <FormField
                  control={form.control}
                  name='senha'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-xs font-medium text-slate-200'>
                        Senha
                      </FormLabel>
                      <div className='relative'>
                        <FormControl>
                          <Input
                            type={mostrarSenha ? 'text' : 'password'}
                            placeholder='Crie uma senha'
                            {...field}
                            className='w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent'
                          />
                        </FormControl>
                        <button
                          type='button'
                          onClick={() => setMostrarSenha((prev) => !prev)}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                        >
                          {mostrarSenha ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='submit'
                className='mt-2 w-full inline-flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/60 disabled:cursor-not-allowed text-sm font-medium text-white px-4 py-2.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]'
                disabled={isPending}
              >
                {isPending ? (
                  <span className='flex items-center gap-2'>
                    <span className='h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                    Criando conta...
                  </span>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>
          </Form>

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
