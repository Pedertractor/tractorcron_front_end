import { authFetch, tryRefreshSession } from './http';

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
    let response = await authFetch('/users/recovery', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const refreshed = await tryRefreshSession();
      if (refreshed) {
        response = await authFetch(
          '/users/recovery',
          { method: 'GET' },
          { retry: false }
        );
      }
    }

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
