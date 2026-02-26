import { Moon, Sun, ArrowLeftIcon, TrophyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HintsDialog } from './HintsDialog';
import { LabInfoDialog } from './LabInfoDialog';
import { ScenarioDialog } from './ScenarioDialog';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';
import { Logo } from './Logo';

// Toggle this as needed or connect to real auth state
const useIsAdmin = () => true; 

export const LabTopbar = () => {
  const { theme, setTheme } = useTheme();
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);
  const isAdmin = useIsAdmin();

  const handleExit = () => {
    window.close();
  };

  return (
    <div className='fixed top-4 left-4 z-50 flex items-center'>
      {/* Floating Island Topbar */}
      <header className='h-14 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl flex items-center shrink-0 shadow-lg px-2 gap-2 transition-all duration-300'>
        
        {/* 1. Logo (Far Left) */}
        <div className='flex items-center px-2 pr-3'>
          <Logo size="sm" showBadge={false} />
        </div>

        <div className='w-px h-6 bg-border/50 hidden sm:block'></div>

        {/* 2. Score Badge (Prominent) */}
        <div className='flex items-center px-2'>
          <div className='flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full'>
            <TrophyIcon className='h-4 w-4 text-primary' />
            <div className='flex items-baseline gap-1'>
              <span className='text-sm font-bold text-primary leading-none'>{currentScore}</span>
              <span className='text-[10px] font-semibold text-muted-foreground leading-none'>/ {baseScore}</span>
            </div>
          </div>
        </div>

        <div className='w-px h-6 bg-border/50 hidden sm:block'></div>

        {/* 3. Tools (Middle Right) */}
        <div className='flex items-center gap-1.5 px-2'>
          {isAdmin && <ScenarioDialog />}
          <LabInfoDialog />
          <HintsDialog />
          
          <Button 
            variant='ghost' 
            size='icon'
            className='h-8 w-8 rounded-full'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
          >
            <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground hover:text-foreground' />
            <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground hover:text-foreground' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        </div>

        <div className='w-px h-6 bg-border/50 hidden sm:block'></div>

        {/* 4. Exit (Far Right) */}
        <div className='flex items-center px-1'>
          <Button 
            variant='destructive' 
            size='sm' 
            className='h-8 gap-1.5 rounded-full px-4 font-semibold shadow-sm' 
            onClick={handleExit}
          >
            <ArrowLeftIcon className='h-3.5 w-3.5' />
            Exit Lab
          </Button>
        </div>
        
      </header>
    </div>
  );
};