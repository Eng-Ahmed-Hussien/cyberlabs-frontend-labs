import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { ShieldX, AlertCircle, Loader2 } from 'lucide-react';
import { consumeToken, mapLabToSession } from '../api/labSessionApi';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { LabLayout } from '../components/LabLayout';
import { httpClient } from '@/shared/api/httpClient';

const MAIN_APP_URL =
  import.meta.env.VITE_MAIN_APP_URL ?? 'https://app.cyber-labs.tech';

export const LaunchRoute = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const initSession = useLabSessionStore((s) => s.initSession);
  const sessionReady = useLabSessionStore((s) => s.sessionId !== null);

  const consumed = useRef(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(false);

  // ── Step 1: Bootstrap auth via httpOnly refresh cookie ──────────────────
  useEffect(() => {
    if (consumed.current) return;

    (async () => {
      try {
        // cyb_rt cookie بيتبعت automatically (withCredentials: true)
        const res = await httpClient.post('/auth/refresh', {});
        const { accessToken } = res.data?.data ?? res.data;

        // خزّن accessToken في httpClient headers للطلبات الجاية
        httpClient.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;
        setAuthReady(true);
      } catch {
        // مفيش session صالح → اللي جاء بدون ما يمر على الـ main app
        setAuthError(true);
      }
    })();
  }, []);

  // ── Step 2: Consume token (بعد ما الـ auth يتجهّز) ───────────────────────
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => consumeToken(token!),
    onSuccess: (data) => {
      initSession(mapLabToSession(data.lab, data.instanceId));
    },
  });

  useEffect(() => {
    if (!authReady) return;
    if (!token) {
      navigate('/401');
      return;
    }
    if (consumed.current) return;
    consumed.current = true;
    mutate();
  }, [authReady, token]);

  // ── Auth failed → redirect to main app ──────────────────────────────────
  if (authError) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-background gap-5 text-center px-6'>
        <div className='h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center'>
          <ShieldX className='h-7 w-7 text-destructive' />
        </div>
        <div className='space-y-1.5'>
          <h2 className='text-xl font-bold'>Session Expired</h2>
          <p className='text-sm text-muted-foreground max-w-sm'>
            Please log in from the main platform and click "Start Lab" again.
          </p>
        </div>
        <a
          href={`${MAIN_APP_URL}/auth`}
          className='mt-1 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors'>
          ← Go to Login
        </a>
      </div>
    );
  }

  // ── Loading (auth bootstrap or token consume) ────────────────────────────
  if (!authReady || isPending) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-background gap-4 text-center'>
        <div className='h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center'>
          <Loader2 className='h-7 w-7 text-primary animate-spin' />
        </div>
        <h2 className='text-lg font-bold'>Launching Lab Environment...</h2>
        <p className='text-sm text-muted-foreground'>
          Validating your access token
        </p>
      </div>
    );
  }

  // ── Token consume error ──────────────────────────────────────────────────
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
      <div className='flex h-screen flex-col items-center justify-center bg-background gap-5 text-center px-6'>
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${
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
              ? 'This link is single-use and expires after 10 minutes. Go back and click "Start Lab" again.'
              : msg}
          </p>
        </div>
        <a
          href={`${MAIN_APP_URL}/labs`}
          className='mt-1 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors'>
          ← Back to Labs
        </a>
      </div>
    );
  }

  if (!sessionReady) return null;
  return <LabLayout />;
};
