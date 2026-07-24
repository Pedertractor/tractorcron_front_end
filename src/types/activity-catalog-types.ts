export type ActivityClassification = 'NVAA' | 'VAA' | 'SVAA';

export type ActivityTypeMovement =
  | 'SOLDAR'
  | 'MONTAR'
  | 'CAMINHAR'
  | 'LIMPAR'
  | 'AJUSTAR'
  | 'PEGAR'
  | 'RETRABALHAR'
  | 'INSPECIONAR'
  | 'IDENTIFICAR'
  | 'POSICIONAR'
  | 'DOBRAR'
  | 'USINAR'
  | 'MEDIR'
  | 'OUTROS'
  | 'MASCARAR'
  | 'CALAFETAR'
  | 'REPASAR'
  | 'CALIBRAR';

export type ActivityCatalogType =
  | 'SOLDAGEM'
  | 'USINAGEM'
  | 'DOBRA'
  | 'MONTAGEM'
  | 'GERAL'
  | 'AMBOS'
  | 'PREP_PINTURA'
  | 'REPASSE_DE_ROSCA';

export interface ActivityCatalogItem {
  id: number;
  name: string;
  classification: ActivityClassification;
  typeMovement: ActivityTypeMovement;
  activityType: ActivityCatalogType;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActivityPayload {
  name: string;
  classification: ActivityClassification;
  typeMovement: ActivityTypeMovement;
  activityType: ActivityCatalogType;
}

export interface ListActivitiesParams {
  activityType?: string | string[];
  includeInactive?: boolean;
  presetType?: string;
}

export interface ReorderActivitiesPayload {
  presetType: string;
  orderedIds: number[];
}
