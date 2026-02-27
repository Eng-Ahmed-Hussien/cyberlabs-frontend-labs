import { useEffect, useRef, Suspense, lazy } from 'react';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';
import { LabCompletionOverlay } from './LabCompletionOverlay';
import { Loader2 } from 'lucide-react';

// ─── Registry: clientComponentId → lazy component ─────────────────────────
const LAB_COMPONENTS: Record<string, React.LazyExoticComponent<React.FC>> = {
  'sqli-lab1': lazy(() =>
    import('@/features/labs/sql-injection').then((m) => ({
      default: m.SQLiLab1,
    })),
  ),
};

const LabLoadingFallback = () => (
  <div className='flex h-full w-full items-center justify-center bg-background'>
    <div className='flex flex-col items-center gap-3 text-center'>
      <Loader2 className='h-8 w-8 text-primary animate-spin' />
      <p className='text-sm text-muted-foreground'>
        Loading lab environment...
      </p>
    </div>
  </div>
);

export const LabRenderer = () => {
  const targetUrl = useLabSessionStore((s) => s.targetUrl);
  const template = useLabSessionStore((s) => s.template);
  const status = useLabSessionStore((s) => s.status);
  // const sessionId = useLabSessionStore((s) => s.sessionId);
  const { theme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: 'CYBERLABS_THEME_CHANGE', theme },
          '*',
        );
      } catch (e) {
        console.warn('postMessage failed', e);
      }
    }
  }, [theme]);

  if (!template) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/20'>
        <p className='text-muted-foreground animate-pulse'>
          Initializing laboratory matrix...
        </p>
      </div>
    );
  }

  // ── Strategy A: Client-Side React Component ──────────────────────────────
  if (
    template.engineConfig.type === 'client-side' ||
    template.engineConfig.type === 'shared-backend'
  ) {
    const componentId = template.engineConfig.clientComponentId;
    const LabComponent = componentId ? LAB_COMPONENTS[componentId] : undefined;

    if (!LabComponent) {
      return (
        <div className='flex h-full w-full items-center justify-center bg-muted/20'>
          <p className='text-destructive'>
            Lab component not found: <code>{componentId ?? 'undefined'}</code>
          </p>
        </div>
      );
    }

    return (
      <div className='relative h-full w-full bg-background'>
        {status === 'COMPLETED' && <LabCompletionOverlay />}
        <Suspense fallback={<LabLoadingFallback />}>
          <LabComponent />
        </Suspense>
      </div>
    );
  }

  // ── Strategy B: Iframe (Docker / external URL) ───────────────────────────
  if (!targetUrl) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/20'>
        <p className='text-destructive animate-pulse'>
          Error: Target URL missing for isolated environment.
        </p>
      </div>
    );
  }

  const getThemedUrl = (base: string, t: string) => {
    try {
      const url = new URL(base);
      url.searchParams.set('theme', t);
      return url.toString();
    } catch {
      return `${base}${base.includes('?') ? '&' : '?'}theme=${t}`;
    }
  };

  return (
    <div className='relative h-full w-full bg-background'>
      {status === 'COMPLETED' && <LabCompletionOverlay />}
      <iframe
        ref={iframeRef}
        src={getThemedUrl(targetUrl, theme)}
        className='h-full w-full border-0'
        title='CyberLabs Sandbox'
        sandbox='allow-scripts allow-forms allow-same-origin'
        referrerPolicy='no-referrer'
        allow='clipboard-read; clipboard-write'
      />
    </div>
  );
};
