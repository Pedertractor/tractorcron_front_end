import { listActivities } from '@/api/activities-api';
import type { ActivityCatalogItem } from '@/types/activity-catalog-types';
import {
  changePresetActivities,
  listPresetActivities,
} from './db-functions-preset-activities';
import type { RegisterPresetActivities } from './db';

const TYPE_TO_PRESET_TYPE: Record<string, string> = {
  welding: 'SOLDAGEM',
  montage: 'MONTAGEM',
  bend: 'DOBRA',
  machining: 'USINAGEM',
  prepPainting: 'PREP_PINTURA',
  repasseRosca: 'REPASSE_DE_ROSCA',
};

function mapCatalogToPreset(
  activities: ActivityCatalogItem[],
): RegisterPresetActivities[] {
  return activities.map((activity, index) => ({
    id: activity.id,
    name: activity.name,
    classification: activity.classification,
    typeMovimation: activity.typeMovement,
    activityType: activity.activityType,
    sortOrder: activity.sortOrder ?? index,
  }));
}

export async function fetchCatalogActivitiesForPreset(
  presetType: string,
): Promise<RegisterPresetActivities[]> {
  const result = await listActivities({
    presetType,
    includeInactive: false,
  });

  if (!result.status || !result.data) {
    throw new Error(result.message ?? 'Erro ao carregar atividades.');
  }

  return mapCatalogToPreset(result.data);
}

export async function getPresetActivitiesForType(
  typeOfChronoanalysis: string,
): Promise<RegisterPresetActivities[]> {
  const presetType = TYPE_TO_PRESET_TYPE[typeOfChronoanalysis];
  if (!presetType) return [];

  try {
    return await fetchCatalogActivitiesForPreset(presetType);
  } catch (error) {
    const cached = await listPresetActivities();
    if (cached && cached.length > 0) {
      return cached;
    }

    throw error;
  }
}

export async function syncPresetActivitiesFromType(
  typeOfChronoanalysis: string,
) {
  const presets = await getPresetActivitiesForType(typeOfChronoanalysis);
  if (presets.length > 0) {
    await changePresetActivities(presets);
  }
  return presets;
}
