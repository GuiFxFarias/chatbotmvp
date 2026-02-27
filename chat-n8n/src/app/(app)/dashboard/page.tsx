import {
  fetchDealsResumo,
  fetchReceitaMensal,
  fetchMaioresDealsAbertas,
  FilterDash,
} from '@/lib/api/deals';

import { ReceitaMensalChart } from '@/components/charts/receita-mensal-chart';
import { KpiOpenDeals } from '@/components/charts/kpi-open-deals';
import { DashboardFiltersWrapper } from '@/components/charts/DashboardFiltersWrapper';

type DashboardPageProps = {
  searchParams: Promise<FilterDash>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const sp = await searchParams;

  const filters: FilterDash = {
    user_id: sp.user_id,
    stage_id: sp.stage_id,
    status: sp.status,
    closed_start: sp.closed_start,
    closed_end: sp.closed_end,
  };
  const [resumo, receitaMensal, maioresAbertas] = await Promise.all([
    fetchDealsResumo(),
    fetchReceitaMensal(filters),
    fetchMaioresDealsAbertas(filters),
  ]);

  return (
    <main className='min-h-screen flex items-stretch justify-center bg-linear-to-br from-slate-950 via-slate-900 to-emerald-900 px-4 py-6'>
      <div className='w-full  flex flex-col'>
        {/* Cabeçalho da página */}
        <header className='mb-4'>
          <DashboardFiltersWrapper initialFilters={filters} />
          <h1 className='text-2xl font-semibold text-slate-50 tracking-tight'>
            Dashboard • Deals & Receita
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Métricas do funil, receita mensal e performance do time.
          </p>
        </header>

        {/* Card principal ocupando quase a tela toda */}
        <div className='relative flex-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col'>
          {/* Topbar */}
          <div className='px-5 py-3 border-b border-white/10 flex items-center justify-between bg-linear-to-r from-white/10 via-white/5 to-transparent'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 text-lg font-semibold'>
                DR
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium text-slate-50'>
                  Dashboard de vendas
                </p>
                <p className='text-xs text-slate-400'>
                  Base:{' '}
                  <span className='text-emerald-300'>deals_completos</span>
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo do dashboard – ocupa o resto da altura */}
          <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-linear-to-b from-slate-950/40 via-slate-900/40 to-slate-950/60'>
            {/* Cards de resumo */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3'>
                <p className='text-xs text-slate-400 mb-1'>Total de deals</p>
                <p className='text-2xl font-semibold text-slate-50'>
                  {resumo.totalDeals}
                </p>
              </div>

              <div className='rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3'>
                <p className='text-xs text-slate-400 mb-1'>Receita total</p>
                <p className='text-2xl font-semibold text-slate-50'>
                  {resumo.totalAmount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>

              <div className='rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3'>
                <p className='text-xs text-slate-400 mb-1'>Deals ganhos</p>
                <p className='text-2xl font-semibold text-emerald-400'>
                  {resumo.wins}
                </p>
              </div>

              <div className='rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3'>
                <p className='text-xs text-slate-400 mb-1'>Deals perdidos</p>
                <p className='text-2xl font-semibold text-rose-400'>
                  {resumo.losses}
                </p>
              </div>
            </div>

            {/* Gráfico de receita mensal – mais alto */}
            <div className='mt-2 h-85'>
              <ReceitaMensalChart data={receitaMensal} />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
              <KpiOpenDeals deals={maioresAbertas} />
              {/* aqui depois entram KPI 2 e KPI 3 */}
            </div>

            {/* aqui depois você pode adicionar outros gráficos em linhas/colunas */}
          </div>
        </div>
      </div>
    </main>
  );
}
