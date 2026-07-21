const url = import.meta.env.VITE_BASE_URL_API;

let refreshPromise: Promise<boolean> | null = null;

export function getAccessToken() {
  return localStorage.getItem('token');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setAuthTokens(token: string, refreshToken: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('role');
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${url}/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthSession();
      return false;
    }

    const data = await response.json();
    if (!data.token || !data.refreshToken) {
      clearAuthSession();
      return false;
    }

    setAuthTokens(data.token, data.refreshToken);
    return true;
  } catch {
    clearAuthSession();
    return false;
  }
}

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

export async function tryRefreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function authFetch(
  input: string,
  init: RequestInit = {},
  options?: { retry?: boolean }
): Promise<Response> {
  const retry = options?.retry !== false;
  const headers = new Headers(init.headers || {});

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input.startsWith('http') ? input : `${url}${input}`, {
    ...init,
    headers,
  });

  if (response.status !== 401 || !retry) {
    return response;
  }

  const refreshed = await tryRefreshSession();
  if (!refreshed) {
    redirectToLogin();
    return response;
  }

  const retryHeaders = new Headers(init.headers || {});
  if (!retryHeaders.has('Content-Type') && init.body) {
    retryHeaders.set('Content-Type', 'application/json');
  }
  const newToken = getAccessToken();
  if (newToken) {
    retryHeaders.set('Authorization', `Bearer ${newToken}`);
  }

  return fetch(input.startsWith('http') ? input : `${url}${input}`, {
    ...init,
    headers: retryHeaders,
  });
}

export async function logoutRemote() {
  const refreshToken = getRefreshToken();
  try {
    await fetch(`${url}/users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // logout local mesmo se remoto falhar
  }
}
