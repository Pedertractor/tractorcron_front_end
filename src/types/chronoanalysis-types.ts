import { EmployeeProps } from '@/components/add-chronoanalysis-employees';

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
}
