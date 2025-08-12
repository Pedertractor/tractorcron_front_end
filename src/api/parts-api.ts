const url = import.meta.env.VITE_BASE_URL_API;

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
