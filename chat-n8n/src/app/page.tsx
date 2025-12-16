'use client';

import { FormEvent, KeyboardEvent, useState } from 'react';

type Message = {
  id: number;
  role: 'user' | 'bot';
  content: string;
};

const WEBHOOK_URL =
  'https://guifariasstatum.app.n8n.cloud/webhook-test/send-message';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [idCounter, setIdCounter] = useState(0);

  function addMessage(role: 'user' | 'bot', content: string) {
    setMessages((prev) => [...prev, { id: idCounter, role, content }]);
    setIdCounter((prev) => prev + 1);
  }

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

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
        body: JSON.stringify({ message: text }), // ajuste o campo para o que o n8n espera
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // aqui assumo que o n8n retorna um JSON { reply: "texto" }
      // ajuste para o formato exato que seu workflow estiver devolvendo
      let replyText = '';

      const contentType = res.headers.get('Content-Type') || '';
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
    <main className='min-h-screen flex flex-col items-center justify-center px-4'>
      <div className='w-full max-w-2xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl flex flex-col h-[80vh]'>
        {/* Header */}
        <div className='px-4 py-3 border-b border-slate-700 flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-semibold text-slate-50'>
              Chat n8n Webhook
            </h1>
            <p className='text-xs text-slate-400'>
              Enviando para {WEBHOOK_URL}
            </p>
          </div>
          <span className='text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'>
            {loading ? 'Gerando resposta...' : 'Online'}
          </span>
        </div>

        {/* Chat */}
        <div className='flex-1 overflow-y-auto px-4 py-3 space-y-3'>
          {messages.length === 0 && (
            <p className='text-sm text-slate-500 text-center mt-4'>
              Comece a conversa digitando sua pergunta abaixo.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className='flex justify-start'>
              <div className='max-w-[80%] rounded-2xl px-3 py-2 text-sm bg-slate-800 text-slate-300 rounded-bl-sm italic'>
                Gerando resposta...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className='border-t border-slate-700 px-3 py-3'
        >
          <div className='flex gap-2 items-end'>
            <textarea
              className='flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
              rows={2}
              placeholder='Digite sua mensagem e pressione Enter para enviar...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type='submit'
              disabled={loading || !input.trim()}
              className='inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 transition-colors'
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
