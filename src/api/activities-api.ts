import { authFetch } from './http';
import type {
  ActivityCatalogItem,
  CreateActivityPayload,
  ListActivitiesParams,
  ReorderActivitiesPayload,
} from '@/types/activity-catalog-types';

const url = import.meta.env.VITE_BASE_URL_API;

export interface activitiesDataChartsProps {
  typeMovementChartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
  classificationChartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
  activityNameChartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
  totalGoldenZone: {
    name: string;
    total: number;
  }[];
  totalStrikeZone: {
    name: string;
    total: number;
  }[];
}

export type MovementChartsData = Pick<
  activitiesDataChartsProps,
  'activityNameChartData' | 'classificationChartData' | 'typeMovementChartData'
>;

export async function listActivities(params: ListActivitiesParams = {}) {
  try {
    const searchParams = new URLSearchParams();

    if (params.activityType) {
      const types = Array.isArray(params.activityType)
        ? params.activityType
        : [params.activityType];
      searchParams.set('activityType', types.join(','));
    }

    if (params.includeInactive) {
      searchParams.set('includeInactive', 'true');
    }

    if (params.presetType) {
      searchParams.set('presetType', params.presetType);
    }

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';

    const response = await authFetch(`${url}/activities/list${suffix}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (response.status !== 200) {
      return {
        status: false as const,
        message: (data.message ?? 'Erro ao listar atividades.') as string,
        data: null,
      };
    }

    return {
      status: true as const,
      message: null,
      data: data as ActivityCatalogItem[],
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao listar atividades.',
      data: null,
    };
  }
}

export async function createActivity(payload: CreateActivityPayload) {
  try {
    const response = await authFetch(`${url}/activities/create`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status !== 201) {
      return {
        status: false as const,
        message: (data.message ??
          data.error ??
          'Erro ao criar atividade.') as string,
        data: null,
      };
    }

    return {
      status: true as const,
      message: (data.message ?? 'Atividade criada com sucesso!') as string,
      data: (data.data ?? null) as ActivityCatalogItem | null,
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao criar atividade.',
      data: null,
    };
  }
}

export async function setActivityActive(id: number, isActive: boolean) {
  try {
    const response = await authFetch(`${url}/activities/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      return {
        status: false as const,
        message: (data.message ?? 'Erro ao atualizar atividade.') as string,
        data: null,
      };
    }

    return {
      status: true as const,
      message: (data.message ?? 'Atividade atualizada com sucesso!') as string,
      data: (data.data ?? null) as ActivityCatalogItem | null,
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao atualizar atividade.',
      data: null,
    };
  }
}

export async function reorderActivities(payload: ReorderActivitiesPayload) {
  try {
    const response = await authFetch(`${url}/activities/reorder`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status !== 200) {
      return {
        status: false as const,
        message: (data.message ?? 'Erro ao reordenar atividades.') as string,
      };
    }

    return {
      status: true as const,
      message: (data.message ??
        'Ordem das atividades atualizada com sucesso!') as string,
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao reordenar atividades.',
    };
  }
}

export async function getActivitiesDataCharts(
  registerChronoanalysisId: string,
  setIsloading: (loading: boolean) => void
) {
  setIsloading(true);

  const response = await authFetch(
    `${url}/activities/graph/${registerChronoanalysisId}`,
    {
      method: 'GET',
    }
  );

  const data = await response.json();
  setIsloading(false);

  if (response.status !== 200)
    return {
      status: false,
      error: data.error,
      data: null,
    };

  return {
    status: true,
    error: null,
    data,
  };
}

export async function getActivitiesChartsForDashboard(
  firstDate: Date,
  secondDate: Date,
  userId?: number | null,
  chronoanalysisType?: string | null,
) {
  const searchParams = new URLSearchParams();
  if (userId != null && userId > 0) {
    searchParams.set('userId', String(userId));
  }
  if (chronoanalysisType) {
    searchParams.set('chronoanalysisType', chronoanalysisType);
  }
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  const response = await authFetch(
    `${url}/activities/graph/dashboard/${firstDate.toISOString()}/${secondDate.toISOString()}${suffix}`,
    {
      method: 'GET',
    },
  );

  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false,
      error: (data.message ?? data.error ?? 'Erro ao carregar gráficos') as string,
      data: null as MovementChartsData | null,
    };
  }

  return {
    status: true,
    error: null,
    data: data as MovementChartsData,
  };
}
