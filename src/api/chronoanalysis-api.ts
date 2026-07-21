import { EmployeeProps } from '@/components/add-chronoanalysis-employees';
import type { PropsActivities } from '../types/activities-types';
import type { PropsChronoanalysis } from '../types/chronoanalysis-types';
import type { PropsWorkPaceAssessment } from '../types/work-pace-assessment-types';
import type { RegisterActivities, RegisterChronoanalysis } from '@/db/db';
import type { RegisterPresetActivities } from '@/db/db';
import { authFetch } from './http';

const url = import.meta.env.VITE_BASE_URL_API;

export type DraftStage = 'TIMING' | 'REVIEW';

export interface ChronoanalysisDraftPayload {
  register: RegisterChronoanalysis;
  activities: RegisterActivities[];
  presetActivities?: RegisterPresetActivities[];
  session: {
    startTime: string | null;
    endTime: string | null;
  };
  workPaceAssessment?: unknown | null;
}

export interface ChronoanalysisDraftResponse {
  registerId: string;
  stage: DraftStage;
  payload: ChronoanalysisDraftPayload;
  updatedAt: string;
}

export interface updatedChronoanalysisProps {
  id: string;
  partNumber: string;
  internalCode: string;
  revision: string;
  of: string;
  op: string;
  sop: boolean;
  sectorName: string;
  sectorId?: number;
  isRequest: boolean;
  firstCron: boolean;
  numberKaizen?: string | null;
  sectorCostCenter: string;
  isKaizen: boolean;
  howManyParts: number;
  enhancement?: string | null;
  chronoanalysisEmployee: EmployeeProps[];
  clientId: number;
  workPaceAssessment: {
    hability: string;
    habilityPorcent: number;
    effort: string;
    effortPorcent: number;
    efficiency: number;
    timeCalculate: string;
    standardTime: string;
    standardTimeDecimal: number;
    standardTimeDecimalByNumberOfParts: number;
  };
}

export interface ChronoanalysisListItem {
  id: string;
  partNumber: string;
  internalCode: string;
  op: string;
  startDate: string;
  isSend: boolean;
  chronoanalysisType?: string;
  chronoanalysisEmployee: EmployeeProps[];
  client: {
    id: number;
    name?: string | null;
  };
  user: {
    id?: number;
    employeeName: string;
    employeeId: number;
  };
  workPaceAssessment: {
    standardTimeDecimal: number;
    standardTimeDecimalByNumberOfParts: number;
  } | null;
}

export interface ListChronoanalysisParams {
  page?: number;
  pageSize?: number;
  partNumber?: string;
  internalCode?: string;
  costCenter?: string;
  unit?: string;
  cardNumber?: string;
  userChronoanalistId?: string;
  clientId?: string;
  isKaizen?: boolean;
  isSend?: boolean;
  dateFrom?: string;
  dateTo?: string;
  chronoanalysisType?: string;
}

export interface ListChronoanalysisResponse {
  items: ChronoanalysisListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ChronoanalistFromRecordsProps {
  id: number;
  employeeName: string;
  employeeId: number;
}

export interface listChronoanalysisProps {
  id: string;
  partNumber: string;
  internalCode: string;
  revision: string;
  of: string;
  op: string;
  sop: boolean;
  sectorName: string;
  sectorId: number;
  isRequest: boolean;
  firstCron: boolean;
  numberKaizen?: string;
  sectorCostCenter: string;
  isKaizen: boolean;
  isSend: boolean;
  startDate: string;
  endDate: string;
  howManyParts: number;
  enhancement?: string;
  chronoanalysisEmployee: EmployeeProps[];
  client: {
    id: number;
    name?: string;
  };
  user: {
    id?: number;
    employeeName: string;
    employeeId: number;
  };
  activities: {
    startTime: string;
    endTime: string;
    id: number;
    name: string;
    registerId: string;
    activitieId: number;
    goldenZoneId: number;
    strikeZoneId: number;
  }[];
  workPaceAssessment: {
    createdAt: string;
    updatedAt: string;
    timeCalculate: string;
    standardTime: string;
    efficiencyPorcent: number;
    effort: string;
    effortPorcent: number;
    hability: string;
    habilityPorcent: number;
    standardTimeDecimal: number;
    standardTimeDecimalByNumberOfParts: number;
  };
}

export interface DashboardDataProps {
  costCenterInformations: { costcenter: string; value: number }[];
  clientsInformations: { name: string; value: number }[];
}

export interface PropsFinalData {
  chronoanalysis: PropsChronoanalysis;
  activities: PropsActivities[];
  workPaceAssessment: PropsWorkPaceAssessment;
}

// export async function exportPDFReport(uuid: string) {
//   const token = localStorage.getItem('token');
//   const response = await fetch(`${url}/chronoanalysis/report/${uuid}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   const blob = await response.blob();

//   return { blob, status: response.status };
// }

export async function listDatasInformationsForDashBoard(
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
    `${url}/chronoanalysis/dashboard/${firstDate.toISOString()}/${secondDate.toISOString()}${suffix}`,
    {
      method: 'GET',
    },
  );

  const data = await response.json();

  if (response.status !== 200)
    return {
      status: false,
      error: data.message,
      data: null,
    };

  return {
    status: true,
    error: null,
    data,
  };
}

export async function listChronoanalistsFromRecords() {
  const response = await authFetch(`${url}/chronoanalysis/list/chronoanalists`, {
    method: 'GET',
  });

  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false as const,
      error: data.error ?? data.message ?? 'Erro ao listar cronoanalistas',
      data: null,
    };
  }

  return {
    status: true as const,
    error: null,
    data: data as ChronoanalistFromRecordsProps[],
  };
}

export async function listChronoanalysis(
  params: ListChronoanalysisParams = {},
  signal?: AbortSignal,
) {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.pageSize != null)
    searchParams.set('pageSize', String(params.pageSize));
  if (params.partNumber) searchParams.set('partNumber', params.partNumber);
  if (params.internalCode)
    searchParams.set('internalCode', params.internalCode);
  if (params.costCenter) searchParams.set('costCenter', params.costCenter);
  if (params.unit) searchParams.set('unit', params.unit);
  if (params.cardNumber) searchParams.set('cardNumber', params.cardNumber);
  if (params.userChronoanalistId)
    searchParams.set('userChronoanalistId', params.userChronoanalistId);
  if (params.clientId) searchParams.set('clientId', params.clientId);
  if (params.isKaizen === true) searchParams.set('isKaizen', 'true');
  if (params.isSend === true) searchParams.set('isSend', 'true');
  if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom);
  if (params.dateTo) searchParams.set('dateTo', params.dateTo);
  if (params.chronoanalysisType)
    searchParams.set('chronoanalysisType', params.chronoanalysisType);

  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  try {
    const response = await authFetch(`${url}/chronoanalysis/list${suffix}`, {
      method: 'GET',
      signal,
    });

    const data = await response.json();

    if (response.status !== 200)
      return {
        status: false as const,
        error: data.error ?? data.message ?? 'Erro ao listar cronoanálises',
        data: null,
        aborted: false as const,
      };

    return {
      status: true as const,
      error: null,
      data: data as ListChronoanalysisResponse,
      aborted: false as const,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: false as const,
        error: null,
        data: null,
        aborted: true as const,
      };
    }
    throw error;
  }
}

export type VerifyUuidResult =
  | { result: 'available' }
  | { result: 'taken' }
  | { result: 'error'; message: string };

export async function registerNewChronoanalysis(finalData: PropsFinalData) {
  try {
    const response = await authFetch(`${url}/chronoanalysis/create`, {
      method: 'POST',
      body: JSON.stringify(finalData),
    });
    const data = await response.json();

    if (response.status !== 201) {
      return {
        status: false as const,
        error: data.message ?? 'Erro ao criar cronoanálise',
        message: null,
      };
    }

    return {
      status: true as const,
      error: null,
      message: data.message,
    };
  } catch {
    return {
      status: false as const,
      error: 'Erro de conexão ao enviar cronoanálise',
      message: null,
    };
  }
}

export async function verifyUuidRegister(
  uuid: string
): Promise<VerifyUuidResult> {
  try {
    const response = await authFetch(
      `${url}/chronoanalysis/verifyuuid/${uuid}`,
      {
        method: 'GET',
      },
    );

    if (response.status === 200) return { result: 'available' };
    if (response.status === 400) return { result: 'taken' };

    const data = await response.json().catch(() => ({}));
    return {
      result: 'error',
      message:
        data.error ?? data.message ?? 'Erro ao verificar identificação',
    };
  } catch {
    return {
      result: 'error',
      message: 'Erro de conexão ao verificar identificação',
    };
  }
}

export async function changeSendStatus(idChronoanalysis: string) {
  const response = await authFetch(
    `${url}/chronoanalysis/send/${idChronoanalysis}`,
    {
      method: 'PUT',
    },
  );

  const data = await response.json();

  return { status: response.status, message: data.message };
}

export async function deleteChrono(idChronoanalysis: string) {
  const response = await authFetch(`${url}/chronoanalysis/${idChronoanalysis}`, {
    method: 'DELETE',
  });

  return { status: response.status };
}

export async function updateChrono(
  updateData: updatedChronoanalysisProps,
  idChrono: string,
) {
  const response = await authFetch(`${url}/chronoanalysis/${idChrono}`, {
    method: 'PUT',
    body: JSON.stringify({ updateData }),
  });

  const data = await response.json();

  if (response.status !== 201)
    return {
      status: false,
      error: data.error,
      data: null,
    };

  return {
    status: true,
    error: null,
    data: data.message,
  };
}

export async function getUnique(idChrono: string) {
  const response = await authFetch(`${url}/chronoanalysis/${idChrono}`, {
    method: 'GET',
  });

  const data = await response.json();

  if (response.status !== 200)
    return {
      status: false,
      error: data.error,
      data: null,
    };

  return {
    status: true,
    error: null,
    data: data.chronoanalysis,
  };
}

export async function saveChronoanalysisDraft(input: {
  registerId: string;
  stage: DraftStage;
  payload: ChronoanalysisDraftPayload;
}) {
  const response = await authFetch(`${url}/chronoanalysis/draft`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return {
      status: false as const,
      error: data.message ?? 'Erro ao salvar rascunho',
      data: null,
    };
  }

  const data = (await response.json()) as ChronoanalysisDraftResponse;
  return { status: true as const, error: null, data };
}

export async function getChronoanalysisDraft() {
  const response = await authFetch(`${url}/chronoanalysis/draft`, {
    method: 'GET',
  });

  if (response.status === 404) {
    return { status: false as const, error: null, data: null };
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return {
      status: false as const,
      error: data.message ?? 'Erro ao buscar rascunho',
      data: null,
    };
  }

  const data = (await response.json()) as ChronoanalysisDraftResponse;
  return { status: true as const, error: null, data };
}

export async function deleteChronoanalysisDraft() {
  const response = await authFetch(`${url}/chronoanalysis/draft`, {
    method: 'DELETE',
  });

  return { status: response.ok };
}
