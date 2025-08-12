import { dbRegisterChronoanalysis, type RegisterPresetActivities } from './db';

export async function listPinedActivities() {
  const presetActivities =
    await dbRegisterChronoanalysis.presetActivities.toArray();

  if (presetActivities) return presetActivities;
}

export async function pinedActivitie(
  presetActivitieId: number,
  setAttListPinedActivities: (props: boolean) => void
) {
  const item = await dbRegisterChronoanalysis.presetActivities.get(
    presetActivitieId
  );
  const statusPined = await dbRegisterChronoanalysis.presetActivities.update(
    presetActivitieId,
    {
      liked: !item?.liked,
    }
  );

  if (statusPined) {
    //i use this functions for att my list
    setAttListPinedActivities(true);
  }
}

export async function syncPresetActivities(
  activitiesApi: Omit<RegisterPresetActivities, 'liked'>[]
) {
  const dataToInsert: RegisterPresetActivities[] = activitiesApi.map(
    (activity) => ({
      ...activity,
      liked: false,
    })
  );

  try {
    await dbRegisterChronoanalysis.presetActivities.bulkPut(dataToInsert);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
