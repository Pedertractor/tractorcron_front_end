import { useEffect } from 'react';
import { flushChronoanalysisDraft } from '@/db/db-functions';

export function useChronoanalysisUnloadGuard(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasSession = !!localStorage.getItem('idRegister');
      if (!hasSession) return;

      event.preventDefault();
      event.returnValue = '';
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Autosave sem pausar — pausa só no logout/restore
        void flushChronoanalysisDraft();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled]);
}
