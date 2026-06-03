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
  totalGoldenZone: {
    name: string;
    total: number;
  }[];
  totalStrikeZone: {
    name: string;
    total: number;
  }[];
}

export type MovementChartsData = Pick<
  activitiesDataChartsProps,
  'activityNameChartData' | 'classificationChartData' | 'typeMovementChartData'
>;

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

export async function getActivitiesChartsForDashboard(
  firstDate: Date,
  secondDate: Date,
  userId?: number | null,
  chronoanalysisType?: string | null,
) {
  const token = localStorage.getItem('token');

  const searchParams = new URLSearchParams();
  if (userId != null && userId > 0) {
    searchParams.set('userId', String(userId));
  }
  if (chronoanalysisType) {
    searchParams.set('chronoanalysisType', chronoanalysisType);
  }
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  const response = await fetch(
    `${url}/activities/graph/dashboard/${firstDate.toISOString()}/${secondDate.toISOString()}${suffix}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await response.json();

  if (response.status !== 200) {
    return {
      status: false,
      error: (data.message ?? data.error ?? 'Erro ao carregar gráficos') as string,
      data: null as MovementChartsData | null,
    };
  }

  return {
    status: true,
    error: null,
    data: data as MovementChartsData,
  };
}
