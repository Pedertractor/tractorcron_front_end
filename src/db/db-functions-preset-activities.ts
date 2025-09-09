import { dbRegisterChronoanalysis, type RegisterPresetActivities } from './db';

export async function listPresetActivities() {
  const presetActivities =
    await dbRegisterChronoanalysis.presetActivities.toArray();

  if (presetActivities) return presetActivities;
}

export async function changePresetActivities(
  activitiesApi: RegisterPresetActivities[]
) {
  try {
    const tableExists = dbRegisterChronoanalysis.tables.some(
      (table) => table.name === 'presetActivities'
    );

    if (tableExists) await dbRegisterChronoanalysis.presetActivities.clear();

    await dbRegisterChronoanalysis.presetActivities.bulkPut(activitiesApi);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
