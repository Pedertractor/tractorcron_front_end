import Dexie, { type EntityTable } from 'dexie';

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
  sop: boolean;
  internalCode: string;
  of: string;
  op: string;
  partNumber: string;
  revision: string;
  typeOfChronoanalysis: string;
  isKaizen: boolean;
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
  activityType: string;
  classification: string;
  name: string;
  typeMovimation: string;
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
