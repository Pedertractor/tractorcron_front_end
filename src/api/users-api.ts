import type { CreateUserPayload, UserListItem } from '@/types/user-types';

const url = import.meta.env.VITE_BASE_URL_API;

function authHeaders() {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function listUsers() {
  try {
    const response = await fetch(`${url}/users/list`, {
      method: 'GET',
      headers: authHeaders(),
    });

    const data = await response.json();

    if (response.status !== 200) {
      return {
        status: false as const,
        message: data.message ?? 'Erro ao listar usuários.',
        data: null,
      };
    }

    return {
      status: true as const,
      message: null,
      data: data as UserListItem[],
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao listar usuários.',
      data: null,
    };
  }
}

export async function createUser(payload: CreateUserPayload) {
  try {
    const response = await fetch(`${url}/users/create`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status !== 201) {
      return {
        status: false as const,
        message: data.message ?? 'Erro ao criar usuário.',
      };
    }

    return {
      status: true as const,
      message: data.message as string,
    };
  } catch {
    return {
      status: false as const,
      message: 'Erro ao criar usuário.',
    };
  }
}
