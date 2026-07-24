import { dbRegisterChronoanalysis, type RegisterPresetActivities } from './db';

function sortByPresetOrder(activities: RegisterPresetActivities[]) {
  return [...activities].sort((a, b) => {
    const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });
}

export async function listPresetActivities() {
  const presetActivities =
    await dbRegisterChronoanalysis.presetActivities.toArray();

  if (presetActivities) return sortByPresetOrder(presetActivities);
}

export async function changePresetActivities(
  activitiesApi: RegisterPresetActivities[],
) {
  try {
    const tableExists = dbRegisterChronoanalysis.tables.some(
      (table) => table.name === 'presetActivities',
    );

    if (tableExists) await dbRegisterChronoanalysis.presetActivities.clear();

    // Garante sortOrder sequencial na ordem recebida da API
    const withOrder = activitiesApi.map((activity, index) => ({
      ...activity,
      sortOrder: activity.sortOrder ?? index,
    }));

    await dbRegisterChronoanalysis.presetActivities.bulkPut(withOrder);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
