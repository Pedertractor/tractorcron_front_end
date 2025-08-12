const url = import.meta.env.VITE_BASE_URL_API;

export interface activitiesDataChartsProps {
  typeMovementChartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
  classificationChartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
  activityNameChartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
}

export async function getActivitiesDataCharts(
  registerChronoanalysisId: string,
  setIsloading: (loading: boolean) => void
) {
  setIsloading(true);
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${url}/activities/graph/${registerChronoanalysisId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  setIsloading(false);

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
