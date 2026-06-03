import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { validateChronoanalysisSession } from '@/db/db-functions';

export function useChronoanalysisSessionGuard() {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const valid = await validateChronoanalysisSession();

      if (!valid) {
        toast.warning(
          'Sessão de cronoanálise inválida ou expirada. Inicie novamente.'
        );
        navigate('/cronoanalise', { replace: true });
        setIsValidating(false);
        return;
      }

      setIsValid(true);
      setIsValidating(false);
    }

    checkSession();
  }, [navigate]);

  return { isValidating, isValid };
}
