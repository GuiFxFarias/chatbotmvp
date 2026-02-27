// components/dashboard/KpiOpenDeals.tsx
import type { DealAbertaKPI } from '@/lib/api/deals';

type Props = {
  deals: DealAbertaKPI[];
};

export function KpiOpenDeals({ deals }: Props) {
  return (
    <div className='rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 h-full'>
      <p className='text-xs font-medium text-slate-200 mb-2'>
        Top deals em andamento
      </p>

      <div className='max-h-64 overflow-y-auto pr-1'>
        {' '}
        {/* ~10 linhas */}
        <table className='w-full text-xs text-left text-slate-300'>
          <thead className='text-[11px] uppercase text-slate-500 border-b border-white/10'>
            <tr>
              <th className='py-1 pr-3'>Conta</th>
              <th className='py-1 pr-3'>Vendedor</th>
              <th className='py-1 pr-3 text-right'>Recorrente</th>
              <th className='py-1 pr-3 text-right'>Total</th>
              <th className='py-1 pr-0'>Estágio</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal.id}
                className='border-b border-white/5 last:border-b-0'
              >
                <td className='py-1.5 pr-3 truncate max-w-30'>
                  {deal.name_conta}
                </td>
                <td className='py-1.5 pr-3 truncate max-w-25'>
                  {deal.user_name}
                </td>
                <td className='py-1.5 pr-3 text-right'>
                  R{' '}
                  {Number(deal.amount_montly || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className='py-1.5 pr-3 text-right font-semibold text-slate-50'>
                  R{' '}
                  {Number(deal.amount_total || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className='py-1.5 pr-0 truncate max-w-22.5'>
                  {deal.deal_stage_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
