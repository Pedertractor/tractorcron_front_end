const url = import.meta.env.VITE_BASE_URL_API;

interface RecoveryUserResponse {
  role: string | null;
  name: string | null;
  email: string | null;
  login: boolean;
}

export async function recoveryUser(
  token: string
): Promise<RecoveryUserResponse> {
  try {
    const response = await fetch(`${url}/users/recovery`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { role: null, name: null, email: null, login: false };
    }

    const data = await response.json();

    if (!data.role || !data.name) {
      return { role: null, name: null, email: null, login: false };
    }

    return {
      role: data.role,
      name: data.name,
      email: data.email,
      login: true,
    };
  } catch (error) {
    console.error('Erro na verificação de token:', error);
    return { role: null, name: null, email: null, login: false };
  }
}
