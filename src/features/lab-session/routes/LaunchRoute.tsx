import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { ShieldX, AlertCircle, Loader2 } from 'lucide-react';
import { consumeToken, mapLabToSession } from '../api/labSessionApi';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { LabLayout } from '../components/LabLayout';

export const LaunchRoute = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const initSession = useLabSessionStore((s) => s.initSession);
  const sessionReady = useLabSessionStore((s) => s.sessionId !== null);

  // Prevent double-consume (React StrictMode double-invoke)
  const consumed = useRef(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => consumeToken(token!),
    onSuccess: (data) => {
      initSession(mapLabToSession(data.lab, data.instanceId));
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/401');
      return;
    }
    if (consumed.current) return;
    consumed.current = true;
    mutate();
  }, [token]);

  /* ── Loading ── */
  if (isPending) {
    return (
      <div
        className='flex h-screen flex-col items-center justify-center
                      bg-background gap-4 text-center'>
        <div
          className='h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20
                        flex items-center justify-center'>
          <Loader2 className='h-7 w-7 text-primary animate-spin' />
        </div>
        <h2 className='text-lg font-bold'>Launching Lab Environment...</h2>
        <p className='text-sm text-muted-foreground'>
          Validating your access token
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (isError) {
    const msg: string =
      (error as any)?.response?.data?.message ??
      (error as any)?.message ??
      'Something went wrong.';

    const isExpiredOrUsed =
      msg.toLowerCase().includes('expired') ||
      msg.toLowerCase().includes('already used') ||
      msg.toLowerCase().includes('invalid');

    return (
      <div
        className='flex h-screen flex-col items-center justify-center
                      bg-background gap-5 text-center px-6'>
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center border
          ${
            isExpiredOrUsed
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-destructive/10 border-destructive/30'
          }`}>
          {isExpiredOrUsed ? (
            <ShieldX className='h-7 w-7 text-orange-400' />
          ) : (
            <AlertCircle className='h-7 w-7 text-destructive' />
          )}
        </div>

        <div className='space-y-1.5'>
          <h2 className='text-xl font-bold'>
            {isExpiredOrUsed
              ? 'Launch Link Expired or Already Used'
              : 'Failed to Launch Lab'}
          </h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            {isExpiredOrUsed
              ? 'This link is single-use and expires after 10 minutes. Go back and click "Start Lab" again to get a fresh link.'
              : msg}
          </p>
        </div>

        <a
          href={
            import.meta.env.VITE_MAIN_APP_URL ?? 'https://cyberlabs.io/labs'
          }
          className='mt-1 rounded-full bg-primary px-6 py-2.5 text-sm font-bold
                     text-primary-foreground hover:bg-primary/90 transition-colors'>
          ← Back to Labs
        </a>
      </div>
    );
  }

  /* ── Ready ── */
  if (!sessionReady) return null;

  return <LabLayout />;
};
