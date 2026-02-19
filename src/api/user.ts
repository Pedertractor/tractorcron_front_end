const url = import.meta.env.VITE_BASE_URL_API;

export async function listChronoanalist() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${url}/users/chronoanalist`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.status !== 200) {
      return {
        status: false,
        message: data.error,
        data: null,
      };
    }

    return {
      status: true,
      message: null,
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: 'Erro ao receber lista de cronoanalistas!',
      data: null,
    };
  }
}
