'use client';

import { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // npm i uuid

type Message = {
  id: number;
  role: 'user' | 'bot';
  content: string;
  createdAt: string;
};

const WEBHOOK_URL =
  'https://guifariasstatum.app.n8n.cloud/webhook-test/send-message';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  function addMessage(role: 'user' | 'bot', content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: idCounter,
        role,
        content,
        createdAt: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setIdCounter((prev) => prev + 1);
  }

  useEffect(() => {
    // roda só no cliente
    let stored = localStorage.getItem('chatSessionId');
    if (!stored) {
      stored = uuidv4();
      localStorage.setItem('chatSessionId', stored);
    }
    setSessionId(stored);
  }, []);

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    if (!input.trim() || loading || !sessionId) return;

    const text = input.trim();
    setInput('');
    addMessage('user', text);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('Content-Type') || '';
      let replyText = '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        replyText =
          data.reply ||
          data.message ||
          data.text ||
          JSON.stringify(data, null, 2);
      } else {
        replyText = await res.text();
      }

      addMessage('bot', replyText || '[Resposta vazia]');
    } catch {
      addMessage('bot', `Erro ao chamar o webhook: `);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 px-4 py-6'>
      <div className='w-full max-w-4xl mx-auto'>
        {/* Cabeçalho da página */}
        <header className='mb-4 text-center'>
          <h1 className='text-2xl font-semibold text-slate-50 tracking-tight'>
            Chat IA • n8n Webhook
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Envie perguntas e visualize as respostas como um chat em tempo real.
          </p>
        </header>

        {/* Card principal */}
        <div className='relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[75vh]'>
          {/* Topbar */}
          <div className='px-5 py-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/10 via-white/5 to-transparent'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 text-lg font-semibold'>
                IA
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium text-slate-50'>
                  Assistente conectado ao n8n
                </p>
                <p className='text-xs text-slate-400'>
                  Webhook:{' '}
                  <span className='text-emerald-300'>/send-message</span>
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={`h-2 w-2 rounded-full ${
                  loading ? 'bg-emerald-300 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <span className='text-xs text-slate-300'>
                {loading ? 'Gerando resposta...' : 'Online'}
              </span>
            </div>
          </div>

          {/* Área de mensagens */}
          <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-slate-950/40 via-slate-900/40 to-slate-950/60'>
            {messages.length === 0 && !loading && (
              <div className='h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400'>
                <div className='flex -space-x-1 mb-1'>
                  <span className='h-2 w-2 rounded-full bg-emerald-400' />
                  <span className='h-2 w-2 rounded-full bg-emerald-300' />
                  <span className='h-2 w-2 rounded-full bg-emerald-200' />
                </div>
                <p className='text-sm'>
                  Comece perguntando algo como{' '}
                  <span className='text-emerald-300'>
                    &quot;Explique meu funil de vendas de hoje&quot;
                  </span>
                  .
                </p>
                <p className='text-xs text-slate-500'>
                  Pressione Enter para enviar, Shift + Enter para quebrar linha.
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className='flex max-w-[80%] items-end gap-2'>
                  {m.role === 'bot' && (
                    <div className='h-7 w-7 rounded-xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-[11px] text-emerald-300 font-semibold'>
                      IA
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-sm'
                        : 'bg-slate-800/80 text-slate-50 border border-white/5 rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                    <div
                      className={`mt-1 text-[10px] ${
                        m.role === 'user'
                          ? 'text-emerald-100/70'
                          : 'text-slate-400/80'
                      }`}
                    >
                      {m.createdAt}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className='flex justify-start'>
                <div className='flex max-w-[70%] items-center gap-2 rounded-2xl px-3 py-2 text-sm bg-slate-800/80 text-slate-300 border border-white/5 rounded-bl-sm'>
                  <span className='relative flex h-2 w-6'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/30' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-300 mr-1' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-200 mr-1' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-100' />
                  </span>
                  <span className='italic text-xs'>
                    Gerando resposta para a sua pergunta…
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Área de input */}
          <form
            onSubmit={handleSubmit}
            className='border-t border-white/10 bg-slate-950/70 px-4 py-3'
          >
            <div className='flex items-end gap-3'>
              <div className='flex-1 relative'>
                <textarea
                  rows={2}
                  className='w-full resize-none rounded-2xl bg-slate-900/80 border border-slate-700/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent shadow-inner'
                  placeholder='Digite sua mensagem...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <button
                type='submit'
                disabled={loading || !input.trim()}
                className='inline-flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.97]'
              >
                {loading ? (
                  <span className='flex items-center gap-2'>
                    <span className='h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                    Gerando…
                  </span>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
