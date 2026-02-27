// components/charts/DashboardFiltersWrapper.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  fetchVendedores,
  fetchEstagios,
  fetchPipelines,
  type VendedorOption,
  type EstagioOption,
  type PipelineOption,
  type FilterDash,
} from '@/lib/api/deals';
import { DashboardFilters } from './DashboardFilters';

type Props = {
  initialFilters: FilterDash;
};

export function DashboardFiltersWrapper({ initialFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterDash>(initialFilters);

  const [pipelines, setPipelines] = useState<PipelineOption[]>([]);
  const [vendedores, setVendedores] = useState<VendedorOption[]>([]);
  const [estagios, setEstagios] = useState<EstagioOption[]>([]);

  // sempre que filters mudar, refaz as opções baseadas nos filtros atuais
  useEffect(() => {
    let cancelado = false;

    Promise.all([
      fetchVendedores(filters),
      fetchEstagios(filters),
      fetchPipelines(filters),
    ])
      .then(([v, e, p]) => {
        if (cancelado) return;
        setVendedores(v);
        setEstagios(e);
        setPipelines(p);
      })
      .catch(console.error);

    return () => {
      cancelado = true;
    };
  }, [filters]);

  function handleChange(nextFilters: FilterDash) {
    setFilters(nextFilters);

    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    const qs = params.toString();
    router.replace(`/dashboard${qs ? `?${qs}` : ''}`, { scroll: false });
  }

  return (
    <DashboardFilters
      initialFilters={filters}
      onChange={handleChange}
      vendedores={vendedores}
      estagios={estagios}
      pipelines={pipelines}
    />
  );
}
