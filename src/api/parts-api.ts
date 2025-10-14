const url = import.meta.env.VITE_BASE_URL_API;
const URL_API_BASE = import.meta.env.VITE_URL_API_BASE_PEDERTRACTOR;
const NAMEAPLLICATION = import.meta.env.VITE_APPNAME;
const APPKEY = import.meta.env.VITE_APPKEY;

export async function findUniquePart(partCode: string) {
  try {
    const response = await fetch(
      `${URL_API_BASE}/part/unique/${partCode}?convert=true`,
      {
        method: 'GET',
        headers: {
          nameApplication: NAMEAPLLICATION,
          key: APPKEY,
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      return {
        data,
        message: null,
        status: response.status,
      };
    }

    return {
      data: null,
      message: data.message,
      status: response.status,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      message: 'erro ao buscar peça.',
      status: 500,
    };
  }
}

export async function getTotalChronoanalyzedParts() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}/parts/totalcount`, {
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
