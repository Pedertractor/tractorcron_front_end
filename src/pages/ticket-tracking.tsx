import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toPng } from 'html-to-image';
import { Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import SuccessTicketCard from '@/components/success-ticket-card';
import Button from '@/components/ui/button/button';
import Text from '@/components/ui/text';
import { getPublicChronoanalysisRequest } from '@/api/chronoanalysis-request-api';
import type { ChronoanalysisRequestItem } from '@/types/chronoanalysis-request-types';

const POLL_INTERVAL_MS = 4000;

const TicketTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLElement>(null);
  const [request, setRequest] = useState<ChronoanalysisRequestItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);

  const loadTicket = useCallback(
    async (silent = false) => {
      if (!id) return;
      if (!silent) setIsLoading(true);

      const result = await getPublicChronoanalysisRequest(id);
      if (!result.status || !result.data) {
        setError(result.message ?? 'Ticket não encontrado');
        setRequest(null);
        if (!silent) setIsLoading(false);
        return;
      }

      setRequest(result.data);
      setError(null);
      if (!silent) setIsLoading(false);
    },
    [id],
  );

  useEffect(() => {
    void loadTicket(false);
  }, [loadTicket]);

  useEffect(() => {
    if (!request) return;
    if (request.status === 'COMPLETED' || request.status === 'CANCELLED') {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadTicket(true);
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [request, loadTicket]);

  async function handleDownloadTicket() {
    if (!ticketRef.current || !request) return;

    setIsDownloadingTicket(true);
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#f4f4f5',
      });

      const link = document.createElement('a');
      link.download = `ticket-cronoanalise-${request.id.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error('Não foi possível baixar o ticket.');
    } finally {
      setIsDownloadingTicket(false);
    }
  }

  const isCompleted = request?.status === 'COMPLETED';
  const showMagicLinkButton =
    isCompleted && Boolean(request?.registerChronoanalysisId);
  const showDownloadButton = Boolean(request) && !isCompleted;

  return (
    <main className='flex h-svh flex-col overflow-hidden bg-muted'>
      <section className='flex flex-1 flex-col items-center justify-center overflow-hidden px-3 py-3 sm:px-4 sm:py-4'>
        <div className='flex w-full max-w-md flex-col items-center gap-2.5 sm:gap-3'>
          {isLoading ? (
            <Text as='p' variant='little-text' className='text-secondary'>
              Carregando ticket...
            </Text>
          ) : error || !request ? (
            <>
              <Text as='h1' variant='title' className='block text-center'>
                Ticket não encontrado
              </Text>
              <Text
                as='p'
                variant='little-text'
                className='block text-center text-secondary'
              >
                {error ?? 'Verifique o link e tente novamente.'}
              </Text>
              <Button
                type='button'
                variant='blue'
                onClick={() => navigate('/solicitar-cronoanalise')}
                className='!h-10 !w-auto px-4'
              >
                Nova solicitação
              </Button>
            </>
          ) : (
            <>
              <SuccessTicketCard ref={ticketRef} request={request} />

              <div className='flex w-full flex-nowrap items-center justify-center gap-2'>
                <Button
                  type='button'
                  variant='default'
                  onClick={() => navigate('/solicitar-cronoanalise')}
                  className='!h-9 !w-auto shrink-0 whitespace-nowrap px-3 text-xs sm:!h-10 sm:px-4 sm:text-sm'
                >
                  Nova solicitação
                </Button>
                {showDownloadButton ? (
                  <Button
                    type='button'
                    variant='blue'
                    onClick={() => void handleDownloadTicket()}
                    disabled={isDownloadingTicket}
                    className='!h-9 !w-auto shrink-0 whitespace-nowrap px-3 text-xs sm:!h-10 sm:px-4 sm:text-sm'
                  >
                    <Download className='size-3.5 shrink-0' />
                    {isDownloadingTicket ? 'Baixando...' : 'Baixar ticket'}
                  </Button>
                ) : null}
                {showMagicLinkButton ? (
                  <Button
                    type='button'
                    variant='green'
                    onClick={() =>
                      navigate(`/info/${request.registerChronoanalysisId}`)
                    }
                    className='!h-9 !w-auto shrink-0 whitespace-nowrap px-3 text-xs sm:!h-10 sm:px-4 sm:text-sm'
                  >
                    <ExternalLink className='size-3.5 shrink-0' />
                    Ver cronoanálise
                  </Button>
                ) : null}
              </div>

              <p className='text-center text-[10px] font-normal text-secondary/60'>
                Tcron - powered by Programming & Automation
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default TicketTrackingPage;
