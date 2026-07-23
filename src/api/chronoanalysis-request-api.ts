import { authFetch } from './http';
import type {
  CreateChronoanalysisRequestPayload,
  ChronoanalysisRequestItem,
  ChronoanalysisRequestStats,
  ListChronoanalysisRequestsParams,
  ListChronoanalysisRequestsResponse,
} from '@/types/chronoanalysis-request-types';

const url = import.meta.env.VITE_BASE_URL_API;

export async function createChronoanalysisRequest(
  payload: CreateChronoanalysisRequestPayload,
) {
  try {
    const response = await fetch(`${url}/chronoanalysis-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status !== 201) {
      return {
        status: false as const,
        message: data.message ?? 'Erro ao criar solicitação',
        data: null,
      };
    }
    return {
      status: true as const,
      message: data.message as string,
      data: data.data as ChronoanalysisRequestItem,
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao criar solicitação',
      data: null,
    };
  }
}

export async function getRequesterContact(
  employeeUnit: 'PEDERTRACTOR' | 'TRACTOR',
  employeeCardNumber: string,
) {
  try {
    const searchParams = new URLSearchParams({
      employeeUnit,
      employeeCardNumber,
    });
    const response = await fetch(
      `${url}/chronoanalysis-requests/requester-contact?${searchParams.toString()}`,
    );
    const data = await response.json();
    if (response.status !== 200) {
      return {
        status: false as const,
        email: null as string | null,
        employeeName: null as string | null,
      };
    }
    return {
      status: true as const,
      email: (data.email as string | null) ?? null,
      employeeName: (data.employeeName as string | null) ?? null,
    };
  } catch {
    return {
      status: false as const,
      email: null as string | null,
      employeeName: null as string | null,
    };
  }
}

export async function getPublicChronoanalysisRequest(id: string) {
  try {
    const response = await fetch(
      `${url}/chronoanalysis-requests/public/${encodeURIComponent(id)}`,
    );
    const data = await response.json();
    if (response.status !== 200) {
      return {
        status: false as const,
        message: (data.message as string) ?? 'Ticket não encontrado',
        data: null,
      };
    }
    return {
      status: true as const,
      message: null,
      data: data.data as ChronoanalysisRequestItem,
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao carregar o ticket',
      data: null,
    };
  }
}

export async function checkPartHasChronoanalysis(internalCode: string) {
  try {
    const response = await fetch(
      `${url}/chronoanalysis-requests/part-exists/${encodeURIComponent(internalCode)}`,
    );
    const data = await response.json();
    if (response.status !== 200) {
      return { status: false as const, exists: false };
    }
    return { status: true as const, exists: Boolean(data.exists) };
  } catch {
    return { status: false as const, exists: false };
  }
}

export async function listChronoanalysisRequests(
  params: ListChronoanalysisRequestsParams = {},
) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set('status', params.status);
  if (params.internalCode) searchParams.set('internalCode', params.internalCode);
  if (params.costCenter) searchParams.set('costCenter', params.costCenter);
  if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom);
  if (params.dateTo) searchParams.set('dateTo', params.dateTo);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const query = searchParams.toString();
  const response = await authFetch(
    `${url}/chronoanalysis-requests${query ? `?${query}` : ''}`,
    { method: 'GET' },
  );
  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false as const,
      message: data.message ?? 'Erro ao listar solicitações',
      data: null,
    };
  }

  return {
    status: true as const,
    message: null,
    data: data as ListChronoanalysisRequestsResponse,
  };
}

export async function getChronoanalysisRequestStats(params: {
  dateFrom?: string;
  dateTo?: string;
} = {}) {
  const searchParams = new URLSearchParams();
  if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom);
  if (params.dateTo) searchParams.set('dateTo', params.dateTo);

  const query = searchParams.toString();
  const response = await authFetch(
    `${url}/chronoanalysis-requests/stats${query ? `?${query}` : ''}`,
    { method: 'GET' },
  );
  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false as const,
      message: data.message ?? 'Erro ao carregar estatísticas de solicitações',
      data: null,
    };
  }

  return {
    status: true as const,
    message: null,
    data: data as ChronoanalysisRequestStats,
  };
}

export async function getChronoanalysisRequest(id: string) {
  const response = await authFetch(`${url}/chronoanalysis-requests/${id}`, {
    method: 'GET',
  });
  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false as const,
      message: data.message ?? 'Erro ao buscar solicitação',
      data: null,
    };
  }

  return {
    status: true as const,
    message: null,
    data: data.data as ChronoanalysisRequestItem,
  };
}

export async function acceptChronoanalysisRequest(id: string) {
  const response = await authFetch(
    `${url}/chronoanalysis-requests/${id}/accept`,
    { method: 'PUT' },
  );
  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false as const,
      message: data.message ?? 'Erro ao aceitar solicitação',
      data: null,
    };
  }

  return {
    status: true as const,
    message: data.message as string,
    data: data.data as ChronoanalysisRequestItem,
  };
}

export async function cancelChronoanalysisRequest(id: string) {
  const response = await authFetch(
    `${url}/chronoanalysis-requests/${id}/cancel`,
    { method: 'PUT' },
  );
  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false as const,
      message: data.message ?? 'Erro ao cancelar solicitação',
      data: null,
    };
  }

  return {
    status: true as const,
    message: data.message as string,
    data: data.data as ChronoanalysisRequestItem,
  };
}
