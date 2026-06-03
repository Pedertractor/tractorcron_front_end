import {
  dbRegisterChronoanalysis,
  type RegisterChronoanalysis,
} from './db';

export function clearChronoanalysisSessionStorage() {
  localStorage.removeItem('idRegister');
  localStorage.removeItem('startTime');
  localStorage.removeItem('endTime');
}

export async function validateChronoanalysisSession(): Promise<boolean> {
  const registerId = localStorage.getItem('idRegister');
  if (!registerId) return false;

  const register = await dbRegisterChronoanalysis.register.get(registerId);
  return !!register;
}

export async function initChronoanalysisSession(
  registerData: RegisterChronoanalysis
) {
  await dbRegisterChronoanalysis.transaction(
    'rw',
    dbRegisterChronoanalysis.register,
    dbRegisterChronoanalysis.activities,
    async () => {
      await dbRegisterChronoanalysis.register.clear();
      await dbRegisterChronoanalysis.activities.clear();
    }
  );

  clearChronoanalysisSessionStorage();
  localStorage.setItem('idRegister', registerData.id);
  localStorage.setItem('startTime', '0');

  await dbRegisterChronoanalysis.register.add(registerData);
}

async function syncStartTimeFromActivities(registerId: string) {
  const activities = await dbRegisterChronoanalysis.activities
    .where('registerId')
    .equals(registerId)
    .toArray();

  if (activities.length < 1) {
    localStorage.setItem('startTime', '0');
    return;
  }

  if (activities.length === 1) {
    localStorage.setItem(
      'startTime',
      new Date(activities[0].startTime).toISOString()
    );
  }
}

export async function listActivities() {
  const registerId = localStorage.getItem('idRegister');

  if (!registerId) {
    alert('Selecione uma atividade e garanta que o registro foi criado.');
    return;
  }

  const activities = await dbRegisterChronoanalysis.activities
    .where('registerId')
    .equals(registerId)
    .toArray();

  return activities.reverse();
}

export async function localizeLastActivities() {
  const registerId = localStorage.getItem('idRegister');

  if (!registerId) {
    alert('Selecione uma atividade e garanta que o registro foi criado.');
    return;
  }

  const lastActivity = await dbRegisterChronoanalysis.activities
    .where('registerId')
    .equals(registerId)
    .last();

  if (lastActivity && !lastActivity.endTime) {
    return {
      now: new Date().toISOString(),
      lastActivitieEndTime: lastActivity,
      registerId,
    };
  }

  return {
    now: new Date().toISOString(),
    lastActivitieEndTime: null,
    registerId,
  };
}

export async function handleAddActivitie(
  name: string,
  activitieId: number,
  attTable: (props: boolean) => void
) {
  const localize = await localizeLastActivities();

  if (!localize) return alert('erro');

  if (localize.lastActivitieEndTime) {
    await dbRegisterChronoanalysis.activities.update(
      localize.lastActivitieEndTime.id,
      {
        endTime: localize.now,
      }
    );
  }

  const statusAddNewActivitie = await dbRegisterChronoanalysis.activities.add({
    registerId: localize.registerId,
    name,
    activitieId,
    startTime: localize.now,
  });

  await syncStartTimeFromActivities(localize.registerId);

  if (statusAddNewActivitie) attTable(true);
}

export async function handleStopActivitie(attTable?: (props: boolean) => void) {
  const localize = await localizeLastActivities();

  if (localize && localize.lastActivitieEndTime) {
    localStorage.setItem('endTime', localize.now);

    await dbRegisterChronoanalysis.activities.update(
      localize.lastActivitieEndTime.id,
      {
        endTime: localize.now,
      }
    );

    if (attTable) attTable(true);
  }
}

export async function handleGetRegister() {
  const registerId = localStorage.getItem('idRegister');
  if (!registerId) return;

  const register = await dbRegisterChronoanalysis.register.get(registerId);

  if (register) return { register, status: true };
  return { status: false };
}

export async function editIdChronoanalysis(oldId: string, newId: string) {
  const updatedNewId = await dbRegisterChronoanalysis.register.update(oldId, {
    id: newId,
  });

  if (updatedNewId) {
    localStorage.setItem('idRegister', newId);
    return true;
  }

  return false;
}

export async function editGoldenZone(
  id: number,
  idGoldenZone: number,
  attTable?: (props: boolean) => void
) {
  const updated = await dbRegisterChronoanalysis.activities.update(id, {
    goldenZoneId: idGoldenZone,
  });

  if (updated && attTable) attTable(true);
}

export async function editStrikeZone(
  id: number,
  idStrikeZone: number,
  attTable?: (props: boolean) => void
) {
  const updated = await dbRegisterChronoanalysis.activities.update(id, {
    strikeZoneId: idStrikeZone,
  });
  if (updated && attTable) attTable(true);
}

export async function deleteActivitie(
  id: number,
  attTable?: (props: boolean) => void
) {
  const registerId = localStorage.getItem('idRegister');
  await dbRegisterChronoanalysis.activities.delete(id);

  if (registerId) {
    await syncStartTimeFromActivities(registerId);
  }

  if (attTable) attTable(true);
}

export async function clearLocalChronoanalysisDb() {
  await dbRegisterChronoanalysis.transaction(
    'rw',
    dbRegisterChronoanalysis.register,
    dbRegisterChronoanalysis.activities,
    dbRegisterChronoanalysis.presetActivities,
    async () => {
      await dbRegisterChronoanalysis.register.clear();
      await dbRegisterChronoanalysis.activities.clear();
      await dbRegisterChronoanalysis.presetActivities.clear();
    }
  );
  clearChronoanalysisSessionStorage();
}
