import { Moon, Sun, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HintsDialog } from './HintsDialog';
import { LabInfoDialog } from './LabInfoDialog';
import { useLabSessionStore } from '../store/useLabSessionStore';

export const LabTopbar = () => {
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);

  return (
    <header className='h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative'>
      {/* Left Side */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' title='Exit Lab'>
          <ArrowLeftIcon className='h-4 w-4' />
        </Button>

        <div className='flex flex-col border-l pl-4 ml-2'>
          <span className='text-[10px] text-muted-foreground font-semibold uppercase tracking-wider'>
            Current Score
          </span>
          <span className='text-sm font-bold font-mono text-primary'>
            {currentScore}{' '}
            <span className='text-muted-foreground text-xs font-normal'>
              / {baseScore}
            </span>
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex items-center gap-2'>
        <LabInfoDialog />
        <HintsDialog />
        <div className='w-px h-6 bg-border mx-2'></div> {/* Divider */}
        <Button variant='ghost' size='icon'>
          <Sun className='h-4 w-4' />
        </Button>
        <div className='font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 ml-2'>
          CyberLabs
        </div>
      </div>
    </header>
  );
};
