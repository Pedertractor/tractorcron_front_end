import type { TypeLogin } from '../zod/schema-login';

const url = import.meta.env.VITE_BASE_URL_API;

export async function loginUser(pass: TypeLogin) {
  const response = await fetch(`${url}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pass),
  });

  const data = await response.json();

  if (response.status === 200) {
    localStorage.setItem('token', data.token);

    return { login: true, message: null };
  }

  if (response.status !== 201 && response.status !== 200) {
    return { login: false, message: data.error };
  }
}
