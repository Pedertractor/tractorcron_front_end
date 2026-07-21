import { useEffect, useState } from 'react';
import { recoveryUser } from '../api/auth-api';
import { clearAuthSession, getAccessToken, tryRefreshSession } from '../api/http';

export function useAuth() {
  const [role, setRole] = useState<string | null>(null);
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function supportRecoveryUserFunction() {
      let token = getAccessToken();

      if (!token) {
        const refreshed = await tryRefreshSession();
        token = refreshed ? getAccessToken() : null;
      }

      if (!token) {
        setLogin(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        let result = await recoveryUser(token);

        if (!result.login) {
          const refreshed = await tryRefreshSession();
          if (refreshed) {
            const newToken = getAccessToken();
            if (newToken) {
              result = await recoveryUser(newToken);
            }
          }
        }

        if (result.login && result.role) {
          if (result.name) localStorage.setItem('name', result.name);
          if (result.role) localStorage.setItem('role', result.role);
          if (result.email) localStorage.setItem('email', result.email);
          setLogin(true);
          setRole(result.role);
        } else {
          clearAuthSession();
          setLogin(false);
          setRole(null);
        }
      } catch (err) {
        console.error(err);
        setLogin(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    supportRecoveryUserFunction();
  }, []);

  return { role, login, loading };
}
