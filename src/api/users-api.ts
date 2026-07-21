import type { CreateUserPayload, UserListItem } from '@/types/user-types';
import { authFetch } from './http';

const url = import.meta.env.VITE_BASE_URL_API;

export async function listUsers() {
  try {
    const response = await authFetch(`${url}/users/list`, {
      method: 'GET',
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
    const response = await authFetch(`${url}/users/create`, {
      method: 'POST',
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
