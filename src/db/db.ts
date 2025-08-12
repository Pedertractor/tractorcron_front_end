import Dexie, { type EntityTable } from 'dexie';

// export interface RegisterChronoanalysis {
//   id: string; //this id i set by uuid()
//   clientId: number; //By select client in input
//   sectorId: number | undefined;
//   employeeId: number | undefined; //The idea is by card and unit i catch id
//   partNumber: string;
//   internalCode: string;
//   revision: string;
//   of: string;
//   op: string;
//   sop: string;
//   name: string;
//   unit: string;
//   sector: string;
//   cardNumber: string;
//   costCenter: string;
//   // userId - send token by header for identification
// }

export interface RegisterChronoanalysis {
  id: string;
  clientId: number;
  employeeUnit: string;
  employeeId: number;
  employeeName: string;
  employeeCardNumber: string;
  sectorId: number;
  sectorName: string;
  sectorCostCenter: string;
  sop: string;
  internalCode: string;
  of: string;
  op: string;
  partNumber: string;
  revision: string;
}

export interface RegisterActivities {
  id: number;
  name: string;
  registerId: string;
  activitieId: number;
  startTime: string | Date;
  endTime?: string | Date;
  goldenZoneId?: number;
  strikeZoneId?: number;
}

export interface RegisterPresetActivities {
  id: number;
  name: string;
  description?: string;
  liked: boolean;
}

export const dbRegisterChronoanalysis = new Dexie('Chronoanalysis') as Dexie & {
  register: EntityTable<RegisterChronoanalysis, 'id'>;
  activities: EntityTable<RegisterActivities, 'id'>;
  presetActivities: EntityTable<RegisterPresetActivities, 'id'>;
};

dbRegisterChronoanalysis.version(1).stores({
  register: 'id',
  activities: '++id, registerId, activitiesId',
  presetActivities: '++id',
});
