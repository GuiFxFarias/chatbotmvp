// components/charts/receita-mensal-chart.tsx
'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type Props = {
  data: {
    mes: string;
    total_mes: number;
    total_won_mes: number;
    total_lost_mes: number;
  }[];
};

const chartConfig: ChartConfig = {
  total: {
    label: 'Receita total',
    color: '#3b82f6',
  },
  won: {
    label: 'Receita ganha',
    color: '#22c55e',
  },
};

export function ReceitaMensalChart({ data }: Props) {
  const formatted = data.map((item) => ({
    month: item.mes,
    total: item.total_mes,
    won: item.total_won_mes,
    lost: item.total_lost_mes,
  }));

  return (
    <div className='w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-sm font-medium text-slate-50'>Receita mensal</p>
          <p className='text-xs text-slate-300'>
            Total e ganhos por mês (base deals_completos).
          </p>
        </div>
        <div className='flex items-center gap-3 text-xs text-slate-200'>
          <span className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]' />
            Receita total
          </span>
          <span className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]' />
            Receita ganha
          </span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className='h-65 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={formatted}
            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='rgba(148, 163, 184, 0.3)'
            />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'rgba(0, 96, 231, 0.95)', fontSize: 11 }}
              tickFormatter={(value: string) => value.slice(5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'rgba(148, 163, 184, 0.95)', fontSize: 11 }}
              tickFormatter={(value: number) =>
                value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
              }
              domain={[0, 3_000_000]}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='border border-white/20 bg-slate-900/90 backdrop-blur-xl text-xs text-slate-50'
                  labelFormatter={(value) => `Mês: ${value}`}
                  formatter={(value, name) => {
                    const numero = Number(value || 0);

                    const texto =
                      name === 'total'
                        ? ' Receita total'
                        : name === 'won'
                          ? ' Receita ganha'
                          : ' Receita perdida';

                    return [
                      `R$ ${numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                      texto,
                    ];
                  }}
                />
              }
            />

            <defs>
              <linearGradient id='totalGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#3b82f6' stopOpacity={0.5} />{' '}
                {/* azul */}
                <stop offset='100%' stopColor='#3b82f6' stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id='wonGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#22c55e' stopOpacity={0.7} />{' '}
                {/* verde */}
                <stop offset='100%' stopColor='#22c55e' stopOpacity={0.08} />
              </linearGradient>

              <linearGradient id='lostGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#ef4444' stopOpacity={0.7} />{' '}
                {/* vermelho */}
                <stop offset='100%' stopColor='#ef4444' stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <Area
              type='monotone'
              dataKey='total'
              stroke='#3b82f6'
              fill='url(#totalGradient)'
              strokeWidth={2}
            />
            <Area
              type='monotone'
              dataKey='won'
              stroke='#22c55e'
              fill='url(#wonGradient)'
              strokeWidth={2}
            />
            <Area
              type='monotone'
              dataKey='lost'
              stroke='#ef4444'
              fill='url(#lostGradient)'
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
