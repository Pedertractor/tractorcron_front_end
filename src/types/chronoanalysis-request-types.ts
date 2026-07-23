export type RequestStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type TimingType = 'FIRST_CRON' | 'KAIZEN' | 'TIME_REVIEW';

export type ProductionTime = 'UNDER_3H' | 'OVER_3H';

export type ChronoanalysisRequestItem = {
  id: string;
  employeeId: number;
  employeeName: string;
  employeeCardNumber: string;
  employeeUnit: 'PEDERTRACTOR' | 'TRACTOR';
  employeeEmail: string | null;
  sectorId: number;
  sectorName: string;
  sectorCostCenter: string;
  internalCode: string;
  partNumber: string;
  operation: string;
  manufacturingStartDate: string;
  chronoanalysisType: string;
  productionTime: ProductionTime;
  timingType: TimingType;
  observation: string | null;
  status: RequestStatus;
  isOverdue: boolean;
  acceptedByUserId: number | null;
  acceptedAt: string | null;
  registerChronoanalysisId: string | null;
  createdAt: string;
  updatedAt: string;
  acceptedBy?: {
    id: number;
    employeeName: string;
    email: string;
  } | null;
};

export type CreateChronoanalysisRequestPayload = {
  employeeCardNumber: string;
  employeeUnit: 'PEDERTRACTOR' | 'TRACTOR';
  employeeEmail: string;
  sectorId: number;
  sectorName: string;
  sectorCostCenter: string;
  internalCode: string;
  partNumber: string;
  operation: string;
  manufacturingStartDate: string;
  chronoanalysisType: string;
  productionTime: ProductionTime;
  timingType: TimingType;
  observation?: string | null;
};

export type ListChronoanalysisRequestsParams = {
  status?: RequestStatus;
  internalCode?: string;
  costCenter?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export type ListChronoanalysisRequestsResponse = {
  items: ChronoanalysisRequestItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ChronoanalysisRequestStats = {
  totals: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    planned: number;
    fulfillmentRate: number;
  };
  byChronoanalysisType: Array<{
    chronoanalysisType: string;
    count: number;
  }>;
  byTimingType: Array<{
    timingType: TimingType;
    count: number;
  }>;
  byRequester: Array<{
    employeeId: number;
    employeeName: string;
    count: number;
  }>;
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

export const TIMING_TYPE_LABELS: Record<TimingType, string> = {
  FIRST_CRON: 'Primeira cronometragem',
  KAIZEN: 'Kaizen',
  TIME_REVIEW: 'Revisão de tempo',
};

export const PRODUCTION_TIME_LABELS: Record<ProductionTime, string> = {
  UNDER_3H: 'Inferior a 3 horas',
  OVER_3H: 'Superior a 3 horas',
};
