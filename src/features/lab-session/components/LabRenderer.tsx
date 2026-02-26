import { useEffect, useRef, Suspense, lazy } from 'react';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';
import { LabCompletionOverlay } from './LabCompletionOverlay';

export const LabRenderer = () => {
  const targetUrl = useLabSessionStore((state) => state.targetUrl);
  const template = useLabSessionStore((state) => state.template);
  const status = useLabSessionStore((state) => state.status);
  const { theme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Send theme via postMessage whenever it changes (Best for real-time toggle without reloading the lab)
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: 'CYBERLABS_THEME_CHANGE', theme },
          '*' // Target origin should ideally be restricted if known, using '*' for sandbox flexibility
        );
      } catch (e) {
        console.warn('Could not postMessage to iframe', e);
      }
    }
  }, [theme]);

  // Loading state
  if (!template) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/20'>
        <p className='text-muted-foreground animate-pulse'>
          Initializing laboratory matrix...
        </p>
      </div>
    );
  }

  // --- RENDERING STRATEGY ---

  // Strategy A: Client-Side Simulation (React Component)
  if (template.engineConfig.type === 'client-side') {
    // In a real app, you might map clientComponentId to a lazy-loaded component
    // For now, we'll just show a placeholder
    return (
      <div className='relative h-full w-full bg-background flex items-center justify-center'>
        {status === 'COMPLETED' && <LabCompletionOverlay />}
        <div className="text-center space-y-4 max-w-lg p-8 border border-border/50 rounded-2xl bg-card shadow-sm">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold">Client-Side Simulation</h2>
          <p className="text-muted-foreground">
            This lab runs entirely within your browser. Component ID: <code className="bg-muted px-1.5 py-0.5 rounded">{template.engineConfig.clientComponentId || 'N/A'}</code>
          </p>
        </div>
      </div>
    );
  }

  // Strategy B: Shared Backend or Docker (Iframe)
  if (!targetUrl) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/20'>
        <p className='text-destructive animate-pulse'>
          Error: Target URL missing for isolated environment.
        </p>
      </div>
    );
  }

  // 2. Append theme as a query parameter for initial load
  const getThemedUrl = (base: string, currentTheme: string) => {
    try {
      const url = new URL(base);
      url.searchParams.set('theme', currentTheme);
      return url.toString();
    } catch {
      const separator = base.includes('?') ? '&' : '?';
      return `${base}${separator}theme=${currentTheme}`;
    }
  };

  const themedTargetUrl = getThemedUrl(targetUrl, theme);

  return (
    <div className='relative h-full w-full bg-background'>
      {status === 'COMPLETED' && <LabCompletionOverlay />}

      <iframe
        ref={iframeRef}
        src={themedTargetUrl}
        className='h-full w-full border-0'
        title='CyberLabs Sandbox'
        sandbox='allow-scripts allow-forms allow-same-origin'
        referrerPolicy='no-referrer'
        allow='clipboard-read; clipboard-write'
      />
    </div>
  );
};