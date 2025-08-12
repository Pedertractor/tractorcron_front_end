import { dbRegisterChronoanalysis } from './db';

export async function listActivities() {
  const registerId = localStorage.getItem('idRegister');

  if (!registerId) {
    alert('Selecione uma atividade e garanta que o registro foi criado.');
    return;
  }

  if (registerId) {
    const activities = await dbRegisterChronoanalysis.activities
      .where('registerId')
      .equals(registerId)
      .toArray();

    if (activities.length < 1) {
      localStorage.setItem('startTime', '0');
    }

    if (activities.length === 1) {
      localStorage.setItem(
        'startTime',
        new Date(activities[0].startTime).toISOString()
      );
    }

    return activities.reverse();
  }
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
    .last(); // pega o último item com base na ordem de inserção (se id for autoincremental)

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

//this function working add activies and reset view table activities
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

  //this state controll re-render table of activities
  if (statusAddNewActivitie) attTable(true);
}

//this function stop study time and timer for activities
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

    //this state controll re-render table of activities
    if (attTable) attTable(true);
  }
}

//this function i can use for send all informations chronoanalysis
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

//this function change the goldenzone
export async function editGoldenZone(
  id: number,
  idGoldenZone: number,
  attTable?: (props: boolean) => void
) {
  const updated = await dbRegisterChronoanalysis.activities.update(id, {
    goldenZoneId: idGoldenZone,
  });

  //this state controll re-render table of activities
  if (updated && attTable) attTable(true);
}

//this function edit the strikezone
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

//this function delete activitie
export async function deleteActivitie(
  id: number,
  attTable?: (props: boolean) => void
) {
  await dbRegisterChronoanalysis.activities.delete(id);
  if (attTable) attTable(true);
}

export async function clearLocalChronoanalysisDb() {
  await dbRegisterChronoanalysis.transaction(
    'rw',
    dbRegisterChronoanalysis.register,
    dbRegisterChronoanalysis.activities,
    // dbRegisterChronoanalysis.presetActivities,
    async () => {
      await dbRegisterChronoanalysis.register.clear();
      await dbRegisterChronoanalysis.activities.clear();
      // await dbRegisterChronoanalysis.presetActivities.clear();
    }
  );
}
