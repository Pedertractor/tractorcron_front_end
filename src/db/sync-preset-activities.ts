import { seedActivities } from '@/seed/seed-activities';
import { changePresetActivities } from './db-functions-preset-activities';
import type { RegisterPresetActivities } from './db';

const TYPE_TO_ACTIVITY_TYPES: Record<string, string[]> = {
  welding: ['SOLDAGEM', 'GERAL'],
  montage: ['MONTAGEM', 'GERAL'],
  bend: ['DOBRA', 'GERAL'],
  machining: ['USINAGEM', 'GERAL'],
  prepPainting: ['PREP_PINTURA', 'GERAL'],
  repasseRosca: ['REPASSE_DE_ROSCA', 'GERAL'],
};

export function getPresetActivitiesForType(
  typeOfChronoanalysis: string
): RegisterPresetActivities[] {
  const allowed = TYPE_TO_ACTIVITY_TYPES[typeOfChronoanalysis];
  if (!allowed) return [];

  return seedActivities.filter((activity) =>
    allowed.includes(activity.activityType)
  );
}

export async function syncPresetActivitiesFromType(
  typeOfChronoanalysis: string
) {
  const presets = getPresetActivitiesForType(typeOfChronoanalysis);
  if (presets.length > 0) {
    await changePresetActivities(presets);
  }
  return presets;
}
