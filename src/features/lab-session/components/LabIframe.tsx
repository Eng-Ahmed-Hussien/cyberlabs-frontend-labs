import { useEffect, useRef } from 'react';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';

export const LabIframe = () => {
  const iframeUrl = useLabSessionStore((state) => state.iframeUrl);
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

  if (!iframeUrl) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/20'>
        <p className='text-muted-foreground animate-pulse'>
          Loading lab environment...
        </p>
      </div>
    );
  }

  // 2. Append theme as a query parameter for initial load (Best for initial render)
  // This safely appends ?theme=dark or &theme=dark to the existing URL
  const getThemedUrl = (base: string, currentTheme: string) => {
    try {
      const url = new URL(base);
      url.searchParams.set('theme', currentTheme);
      return url.toString();
    } catch {
      // Fallback if URL is invalid or relative (unlikely for iframeUrl, but safe)
      const separator = base.includes('?') ? '&' : '?';
      return `${base}${separator}theme=${currentTheme}`;
    }
  };

  const themedIframeUrl = getThemedUrl(iframeUrl, theme);

  return (
    <div className='relative h-full w-full bg-background'>
      {status === 'COMPLETED' && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
          <div className='text-center space-y-4'>
            <h2 className='text-3xl font-bold text-green-500'>
              Lab Completed! 🎉
            </h2>
            <p className='text-muted-foreground'>
              You have successfully solved this challenge.
            </p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={themedIframeUrl}
        className='h-full w-full border-0'
        title='CyberLabs Sandbox'
        // Security: Prevent parent navigation, popups, and restrict features
        sandbox='allow-scripts allow-forms allow-same-origin'
        referrerPolicy='no-referrer'
        allow='clipboard-read; clipboard-write'
      />
    </div>
  );
};