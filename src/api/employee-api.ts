const URL_API_BASE = import.meta.env.VITE_URL_API_BASE_PEDERTRACTOR;
const NAMEAPLLICATION = import.meta.env.VITE_APPNAME;
const APPKEY = import.meta.env.VITE_APPKEY;

export interface PropsFindEmployee {
  cardNumber: string;
  unit: string;
}

export interface PropsEmployee {
  name: string;
  sector: string;
  constCenter: string;
}

export async function findEmployee({ cardNumber, unit }: PropsFindEmployee) {
  try {
    const response = await fetch(
      `${URL_API_BASE}/employee/get/${cardNumber}/${unit}`,
      {
        method: 'GET',
        headers: {
          nameApplication: NAMEAPLLICATION,
          key: APPKEY,
        },
      }
    );

    const data = await response.json();
    if (response.status !== 200) {
      return {
        status: false,
        message: data.message,
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
      message: 'Erro ao receber informações do colaborador!',
      data: null,
    };
  }
}
