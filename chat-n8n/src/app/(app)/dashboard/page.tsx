export default function DashboardPage() {
  return (
    <main className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-6'>
      <div className='w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-6'>
        <h1 className='text-xl font-semibold text-slate-50 mb-2'>Dashboard</h1>
        <p className='text-sm text-slate-400'>
          Aqui você pode colocar métricas, histórico de conversas, funil, etc.
        </p>
      </div>
    </main>
  );
}
