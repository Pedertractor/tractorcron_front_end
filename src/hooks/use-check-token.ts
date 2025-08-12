import { useEffect, useState } from 'react';
import { recoveryUser } from '../api/auth-api';

export function useAuth() {
  const [role, setRole] = useState<string | null>(null);
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function supportRecoveryUserFunction() {
      const token = localStorage.getItem('token');

      if (!token) {
        setLogin(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { role, name, email, login } = await recoveryUser(token);
        if (name) localStorage.setItem('name', name);
        if (role) localStorage.setItem('role', role);
        if (email) localStorage.setItem('email', email);
        setLogin(login && !!role);
        setRole(role || null);
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
