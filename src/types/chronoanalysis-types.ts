import { EmployeeProps } from '@/components/add-chronoanalysis-employees';
import type { ChronoanalysisTypeValue } from '@/constants/chronoanalysis-types';

export interface PropsChronoanalysis {
  id?: string;
  clientId: number;
  unit?: string;
  employees: EmployeeProps[];
  sectorId?: number;
  sectorName?: string;
  sectorCostCenter?: string;
  sop: boolean;
  internalCode: string;
  of: string;
  op: string;
  partNumber: string;
  revision: string;
  startTime: string | Date;
  endTime: string | Date;
  howManyParts: number;
  enhancement?: string;
  chronoanalysisType: ChronoanalysisTypeValue;
  isRequest?: boolean;
  firstCron?: boolean;
  isKaizen?: boolean;
  numberKaizen?: string;
}
