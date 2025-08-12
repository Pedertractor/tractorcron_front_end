export interface PropsChronoanalysis {
  id?: string;
  clientId: number;
  unit?: string;
  employeeId?: number;
  employeeName?: string;
  employeeCardNumber: string;
  sectorId?: number;
  sectorName?: string;
  sectorCostCenter?: string;
  sop: string;
  internalCode: string;
  of: string;
  op: string;
  partNumber: string;
  revision: string;
  startTime: string | Date;
  endTime: string | Date;
}
