import {
  dbRegisterChronoanalysis,
  type RegisterChronoanalysis,
} from './db';
import {
  deleteChronoanalysisDraft,
  getChronoanalysisDraft,
  saveChronoanalysisDraft,
  type ChronoanalysisDraftPayload,
  type DraftStage,
} from '@/api/chronoanalysis-api';
import { changePresetActivities } from './db-functions-preset-activities';
import { syncPresetActivitiesFromType } from './sync-preset-activities';

const DRAFT_DEBOUNCE_MS = 1500;
let draftSaveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingDraftStage: DraftStage | null = null;

export function clearChronoanalysisSessionStorage() {
  localStorage.removeItem('idRegister');
  localStorage.removeItem('startTime');
  localStorage.removeItem('endTime');
  localStorage.removeItem('chronoStage');
}

export function getChronoanalysisStage(): DraftStage {
  const stage = localStorage.getItem('chronoStage');
  return stage === 'REVIEW' ? 'REVIEW' : 'TIMING';
}

export function setChronoanalysisStage(stage: DraftStage) {
  localStorage.setItem('chronoStage', stage);
}

export async function validateChronoanalysisSession(): Promise<boolean> {
  const registerId = localStorage.getItem('idRegister');
  if (!registerId) return false;

  const register = await dbRegisterChronoanalysis.register.get(registerId);
  return !!register;
}

/** Fecha atividade em andamento (sem endTime) — estado pausado. */
export async function pauseOpenChronoanalysisActivity(
  at = new Date().toISOString()
) {
  const registerId = localStorage.getItem('idRegister');
  if (!registerId) return false;

  const lastActivity = await dbRegisterChronoanalysis.activities
    .where('registerId')
    .equals(registerId)
    .last();

  if (!lastActivity || lastActivity.endTime) return false;

  await dbRegisterChronoanalysis.activities.update(lastActivity.id, {
    endTime: at,
  });
  localStorage.setItem('endTime', at);
  return true;
}

export async function buildChronoanalysisDraftPayload(): Promise<{
  registerId: string;
  stage: DraftStage;
  payload: ChronoanalysisDraftPayload;
} | null> {
  const registerId = localStorage.getItem('idRegister');
  if (!registerId) return null;

  const register = await dbRegisterChronoanalysis.register.get(registerId);
  if (!register) return null;

  const activities = await dbRegisterChronoanalysis.activities
    .where('registerId')
    .equals(registerId)
    .sortBy('id');

  const presetActivities =
    await dbRegisterChronoanalysis.presetActivities.toArray();

  return {
    registerId,
    stage: getChronoanalysisStage(),
    payload: {
      register,
      activities,
      presetActivities,
      session: {
        startTime: localStorage.getItem('startTime'),
        endTime: localStorage.getItem('endTime'),
      },
    },
  };
}

export async function flushChronoanalysisDraft(
  stage?: DraftStage,
  options?: { pauseOpen?: boolean }
) {
  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
  }

  if (stage) {
    setChronoanalysisStage(stage);
  }

  if (options?.pauseOpen) {
    await pauseOpenChronoanalysisActivity();
  }

  const draft = await buildChronoanalysisDraftPayload();
  if (!draft) return { status: false as const };

  if (stage) {
    draft.stage = stage;
  }

  return saveChronoanalysisDraft(draft);
}

export function scheduleChronoanalysisDraftSave(stage?: DraftStage) {
  if (stage) {
    setChronoanalysisStage(stage);
    pendingDraftStage = stage;
  }

  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
  }

  draftSaveTimer = setTimeout(() => {
    void flushChronoanalysisDraft(pendingDraftStage ?? undefined);
    pendingDraftStage = null;
    draftSaveTimer = null;
  }, DRAFT_DEBOUNCE_MS);
}

export async function restoreChronoanalysisFromDraft(draft: {
  registerId: string;
  stage: DraftStage;
  payload: ChronoanalysisDraftPayload;
}) {
  const { payload, stage, registerId } = draft;
  const pausedAt = new Date().toISOString();

  const activities = (payload.activities ?? []).map((activity) => {
    if (activity.endTime) return activity;
    return { ...activity, endTime: pausedAt };
  });

  await dbRegisterChronoanalysis.transaction(
    'rw',
    dbRegisterChronoanalysis.register,
    dbRegisterChronoanalysis.activities,
    dbRegisterChronoanalysis.presetActivities,
    async () => {
      await dbRegisterChronoanalysis.register.clear();
      await dbRegisterChronoanalysis.activities.clear();
      await dbRegisterChronoanalysis.presetActivities.clear();
      await dbRegisterChronoanalysis.register.add(payload.register);

      for (const activity of activities) {
        const { id: _id, ...rest } = activity;
        await dbRegisterChronoanalysis.activities.add(rest);
      }
    }
  );

  if (payload.presetActivities && payload.presetActivities.length > 0) {
    await changePresetActivities(payload.presetActivities);
  } else if (payload.register.typeOfChronoanalysis) {
    await syncPresetActivitiesFromType(payload.register.typeOfChronoanalysis);
  }

  clearChronoanalysisSessionStorage();
  localStorage.setItem('idRegister', registerId);
  localStorage.setItem('startTime', payload.session?.startTime ?? '0');
  localStorage.setItem(
    'endTime',
    payload.session?.endTime && payload.session.endTime !== '0'
      ? payload.session.endTime
      : pausedAt
  );
  setChronoanalysisStage(stage);

  // Garante rascunho remoto já pausado para próximos logins
  await flushChronoanalysisDraft(stage);
}

export async function discardChronoanalysisDraft() {
  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
  }
  await clearLocalChronoanalysisDb();
  await deleteChronoanalysisDraft();
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
  setChronoanalysisStage('TIMING');

  await dbRegisterChronoanalysis.register.add(registerData);
  await flushChronoanalysisDraft('TIMING');
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
    .sortBy('id');

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
  scheduleChronoanalysisDraftSave('TIMING');

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

    scheduleChronoanalysisDraftSave(getChronoanalysisStage());

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
    scheduleChronoanalysisDraftSave(getChronoanalysisStage());
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

  if (updated) {
    scheduleChronoanalysisDraftSave(getChronoanalysisStage());
    if (attTable) attTable(true);
  }
}

export async function editStrikeZone(
  id: number,
  idStrikeZone: number,
  attTable?: (props: boolean) => void
) {
  const updated = await dbRegisterChronoanalysis.activities.update(id, {
    strikeZoneId: idStrikeZone,
  });
  if (updated) {
    scheduleChronoanalysisDraftSave(getChronoanalysisStage());
    if (attTable) attTable(true);
  }
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

  scheduleChronoanalysisDraftSave(getChronoanalysisStage());

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

export async function hasRemoteChronoanalysisDraft() {
  const result = await getChronoanalysisDraft();
  return result.status && result.data ? result.data : null;
}
