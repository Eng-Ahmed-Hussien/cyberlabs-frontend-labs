import { useLabSessionStore } from '../store/useLabSessionStore';

export const LabIframe = () => {
  const iframeUrl = useLabSessionStore((state) => state.iframeUrl);
  const status = useLabSessionStore((state) => state.status);

  if (!iframeUrl) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/20'>
        <p className='text-muted-foreground animate-pulse'>
          Loading lab environment...
        </p>
      </div>
    );
  }

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
        src={iframeUrl}
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
