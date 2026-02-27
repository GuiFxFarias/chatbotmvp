// lib.ts

export type ReceitaMensal = {
  mes: string;
  total_mes: number;
  total_won_mes: number;
  total_lost_mes: number;
};

export type DealsResumo = {
  totalDeals: number;
  totalAmount: number;
  wins: number;
  losses: number;
};

export type DealAbertaKPI = {
  id: string;
  name_conta: string;
  user_name: string;
  amount_montly: number | string;
  amount_unique: number | string;
  amount_total: number | string;
  deal_stage_name: string;
  updated_at: string;
};

export type VendedorOption = {
  user_id: string;
  user_name: string;
};

export type EstagioOption = {
  deal_stage_id: string;
  deal_stage_name: string;
};

export type PipelineOption = {
  deal_pipeline_id: string;
  deal_pipeline_name: string;
};

// --- filtros reutilizáveis para os relatórios ---
export type FilterDash = {
  user_id?: string;
  stage_id?: string;
  pipeline_id?: string;
  status?: 'won' | 'lost' | 'all';
  created_start?: string;
  created_end?: string;
  updated_start?: string;
  updated_end?: string;
  closed_start?: string;
  closed_end?: string;
};

function buildQuery(params?: FilterDash) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params || {}).filter(
        ([, v]) => v !== undefined && v !== '',
      ),
    ),
  ).toString();

  return query ? `?${query}` : '';
}

const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

// --- resumo geral (cards superiores) ---
export async function fetchDealsResumo(): Promise<DealsResumo> {
  if (!baseUrl) {
    throw new Error('API_URL / NEXT_PUBLIC_API_URL não configurada');
  }

  const res = await fetch(`${baseUrl}/resumo`, {
    cache: 'no-store',
  });

  const json = await res.json();

  if (!res.ok || !json.sucesso) {
    throw new Error(json.erro || 'Erro ao buscar resumo de deals');
  }

  return json.data as DealsResumo;
}

// --- receita mensal com filtros ---
export async function fetchReceitaMensal(
  params?: FilterDash,
): Promise<ReceitaMensal[]> {
  if (!baseUrl) {
    throw new Error('API_URL / NEXT_PUBLIC_API_URL não configurada');
  }

  const res = await fetch(`${baseUrl}/receita-mensal${buildQuery(params)}`, {
    cache: 'no-store',
  });

  const json = await res.json();

  if (!res.ok || !json.sucesso) {
    throw new Error(json.erro || 'Erro ao buscar receita mensal');
  }

  return json.data as ReceitaMensal[];
}

// --- maiores deals abertas com filtros ---
export async function fetchMaioresDealsAbertas(
  params?: FilterDash,
): Promise<DealAbertaKPI[]> {
  if (!baseUrl) {
    throw new Error('API_URL / NEXT_PUBLIC_API_URL não configurada');
  }

  const res = await fetch(`${baseUrl}/maiores-abertas${buildQuery(params)}`, {
    cache: 'no-store',
  });

  const json = await res.json();

  if (!res.ok || !json.sucesso) {
    throw new Error(json.erro || 'Erro ao buscar maiores deals abertas');
  }

  return json.data as DealAbertaKPI[];
}

// --- opções de filtros (vendedores / estágios) ---
async function getJson<T>(path: string): Promise<T> {
  if (!baseUrl)
    throw new Error('API_URL / NEXT_PUBLIC_API_URL não configurada');

  const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
  const text = await res.text();

  try {
    const json = JSON.parse(text);
    if (!res.ok || !json.sucesso) {
      throw new Error(json.erro || `Erro na chamada ${path}`);
    }
    return json.data as T;
  } catch {
    console.error(`Resposta inesperada em ${path}:`, text);
    throw new Error(`Endpoint ${path} está retornando HTML ou JSON inválido`);
  }
}

export async function fetchVendedores(filters?: FilterDash) {
  return getJson<VendedorOption[]>(`/vendedores${buildQuery(filters)}`);
}

export async function fetchEstagios(filters?: FilterDash) {
  return getJson<EstagioOption[]>(`/estagios${buildQuery(filters)}`);
}

export async function fetchPipelines(filters?: FilterDash) {
  return getJson<PipelineOption[]>(`/pipelines${buildQuery(filters)}`);
}
