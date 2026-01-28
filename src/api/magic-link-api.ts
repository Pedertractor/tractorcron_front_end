import { activitiesDataChartsProps } from './activities-api';
import { listChronoanalysisProps } from './chronoanalysis-api';

export type MagicLinkResponse = {
  activitiesReport: activitiesDataChartsProps;
  chronoanalysis: listChronoanalysisProps;
};

const url = import.meta.env.VITE_BASE_URL_API;

export async function getInformationsForMagicLink(uuid: string) {
  const response = await fetch(`${url}/chronoanalysis/magiclink/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.status !== 200)
    return {
      status: false,
      error: data.message,
      data: null,
    };

  return {
    status: true,
    error: null,
    data,
  };
}
