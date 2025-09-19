import { EmployeeProps } from '@/components/add-chronoanalysis-employees';
import type { PropsActivities } from '../types/activities-types';
import type { PropsChronoanalysis } from '../types/chronoanalysis-types';
import type { PropsWorkPaceAssessment } from '../types/work-pace-assessment-types';

const url = import.meta.env.VITE_BASE_URL_API;

export interface listChronoanalysisProps {
  id: string;
  partNumber: string;
  internalCode: string;
  revision: string;
  of: string;
  op: string;
  sop: boolean;
  sectorName: string;
  sectorCostCenter: string;
  isKaizen: boolean;
  isSend: boolean;
  startDate: string;
  endDate: string;
  howManyParts: number;
  enhancement?: string;
  chronoanalysisEmployee: EmployeeProps[];
  client: {
    id: number;
    name: string;
  };
  user: {
    employeeName: string;
    employeeId: number;
  };
  activities: {
    startTime: string;
    endTime: string;
    id: number;
    name: string;
    registerId: string;
    activitieId: number;
    goldenZoneId: number;
    strikeZoneId: number;
  }[];
  workPaceAssessment: {
    createdAt: string;
    updatedAt: string;
    timeCalculate: string;
    standardTime: string;
    efficiencyPorcent: number;
    effort: string;
    effortPorcent: number;
    hability: string;
    habilityPorcent: number;
    standardTimeDecimal: number;
    standardTimeDecimalByNumberOfParts: number;
  };
}

export interface PropsFinalData {
  chronoanalysis: PropsChronoanalysis;
  activities: PropsActivities[];
  workPaceAssessment: PropsWorkPaceAssessment;
}

export interface ListCountChronoanalysisByDayProps {
  day: string;
  count: number;
}

export async function ListCountChronoanalysisByDay(): Promise<{
  status: boolean;
  error: string | null;
  data: ListCountChronoanalysisByDayProps[] | null;
}> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}/chronoanalysis/list/cronobydays`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.status !== 200)
    return {
      status: false,
      error: data.error,
      data: null,
    };

  return {
    status: true,
    error: null,
    data,
  };
}

export async function exportPDFReport(uuid: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${url}/chronoanalysis/report/${uuid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const blob = await response.blob();

  return { blob, status: response.status };
}

export async function listChronoanalysis() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}/chronoanalysis/list`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.status !== 200)
    return {
      status: false,
      error: data.error,
      data: null,
    };

  return {
    status: true,
    error: null,
    data,
  };
}

export async function registerNewChronoanalysis(finalData: PropsFinalData) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}/chronoanalysis/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(finalData),
  });
  const data = await response.json();

  if (response.status !== 201) {
    return {
      staus: false,
      error: data.message,
      message: null,
    };
  }

  return {
    status: true,
    error: null,
    message: data.message,
  };
}

export async function verifyUuidRegister(uuid: string) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}/chronoanalysis/verifyuuid/${uuid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) return true;

  return false;
}

export async function changeSendStatus(idChronoanalysis: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${url}/chronoanalysis/send/${idChronoanalysis}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return { status: response.status, message: data.message };
}
