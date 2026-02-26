import { LabTopbar } from './LabTopbar';
import { LabRenderer } from './LabRenderer';

export const LabLayout = () => {
  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden bg-background'>
      <LabTopbar />
      <main className='flex-1 relative'>
        <LabRenderer />
      </main>
    </div>
  );
};