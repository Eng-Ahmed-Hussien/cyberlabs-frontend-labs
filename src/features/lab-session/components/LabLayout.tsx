import { LabTopbar } from './LabTopbar';
import { LabIframe } from './LabIframe';

export const LabLayout = () => {
  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden bg-background'>
      <LabTopbar />
      <main className='flex-1 relative'>
        <LabIframe />
      </main>
    </div>
  );
};
