// components/dashboard/DashboardFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import type {
  FilterDash,
  VendedorOption,
  PipelineOption,
  EstagioOption,
} from '@/lib/api/deals';

type Props = {
  initialFilters?: FilterDash;
  onChange: (filters: FilterDash) => void;
  vendedores: VendedorOption[];
  estagios: EstagioOption[];
  pipelines: PipelineOption[];
};

export function DashboardFilters({
  initialFilters,
  onChange,
  vendedores,
  estagios,
  pipelines,
}: Props) {
  const [filters, setFilters] = useState<FilterDash>(
    initialFilters || {
      user_id: '',
      pipeline_id: '',
      stage_id: '',
      closed_start: '',
      closed_end: '',
    },
  );

  function update(partial: Partial<FilterDash>) {
    const next = { ...filters, ...partial };
    setFilters(next);
    onChange(next);
  }

  return (
    <div className='mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3'>
      {/* Vendedor */}
      <div className='flex flex-col gap-1'>
        <label className='text-[11px] uppercase text-slate-400'>Vendedor</label>
        <select
          className='h-8 rounded-lg bg-slate-950/70 border border-slate-700/70 px-2 text-xs text-slate-100'
          value={filters.user_id}
          onChange={(e) => update({ user_id: e.target.value || '' })}
        >
          <option value=''>Todos</option>
          {vendedores.map((v) => (
            <option key={v.user_id} value={v.user_id}>
              {v.user_name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-[11px] uppercase text-slate-400'>Funil</label>
        <select
          className='h-8 rounded-lg bg-slate-950/70 border border-slate-700/70 px-2 text-xs text-slate-100'
          value={filters.pipeline_id || ''}
          onChange={(e) => update({ pipeline_id: e.target.value || '' })}
        >
          <option value=''>Todos funis</option>
          {pipelines.map((p) => (
            <option key={p.deal_pipeline_id} value={p.deal_pipeline_id}>
              {p.deal_pipeline_name}
            </option>
          ))}
        </select>
      </div>

      {/* Estágio */}
      <div className='flex flex-col gap-1'>
        <label className='text-[11px] uppercase text-slate-400'>Estágio</label>
        <select
          className='h-8 rounded-lg bg-slate-950/70 border border-slate-700/70 px-2 text-xs text-slate-100'
          value={filters.stage_id}
          onChange={(e) => update({ stage_id: e.target.value || '' })}
        >
          <option value=''>Todos estágios</option>
          {estagios.map((s) => (
            <option key={s.deal_stage_id} value={s.deal_stage_id}>
              {s.deal_stage_name}
            </option>
          ))}
        </select>
      </div>

      {/* Período de fechamento */}
      <div className='flex flex-col gap-1'>
        <label className='text-[11px] uppercase text-slate-400'>
          Fechamento de
        </label>
        <input
          type='date'
          className='h-8 rounded-lg bg-slate-950/70 border border-slate-700/70 px-2 text-xs text-slate-100'
          value={filters.closed_start || ''}
          onChange={(e) => update({ closed_start: e.target.value || '' })}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-[11px] uppercase text-slate-400'>até</label>
        <input
          type='date'
          className='h-8 rounded-lg bg-slate-950/70 border border-slate-700/70 px-2 text-xs text-slate-100'
          value={filters.closed_end || ''}
          onChange={(e) => update({ closed_end: e.target.value || '' })}
        />
      </div>
    </div>
  );
}
