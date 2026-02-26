import { useState } from 'react';
import {
  Moon,
  Sun,
  ArrowLeftIcon,
  TrophyIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HintsDialog } from './HintsDialog';
import { LabInfoDialog } from './LabInfoDialog';
import { ScenarioDialog } from './ScenarioDialog';
import { SubmitFlagDialog } from './SubmitFlagDialog';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';
import { Logo } from './Logo';
import { cn } from '@/shared/utils/cn';

// Toggle this as needed or connect to real auth state
const useIsAdmin = () => true;

export const LabTopbar = () => {
  const { theme, setTheme } = useTheme();
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);
  const status = useLabSessionStore((state) => state.status);
  const isAdmin = useIsAdmin();

  // State to manage topbar expansion
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExit = () => {
    window.close();
  };

  return (
    <div className='fixed top-4 left-4 z-50 flex items-center gap-2'>
      {/* Expand/Collapse Toggle Button */}
      <Button
        variant='outline'
        size='icon'
        className='h-10 w-10 rounded-full bg-background/95 backdrop-blur-md border border-border/50 shadow-lg hover:bg-muted shrink-0 transition-transform active:scale-95'
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}>
        {isExpanded ? (
          <PanelLeftCloseIcon className='h-4 w-4 text-muted-foreground' />
        ) : (
          <PanelLeftOpenIcon className='h-4 w-4 text-muted-foreground' />
        )}
      </Button>

      {/* Floating Island Topbar */}
      <header
        className={cn(
          'h-14 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl flex items-center shrink-0 shadow-lg transition-all duration-500 ease-&lsqb;cubic-bezier(0.32,0.72,0,1)&rsqb overflow-hidden',
          isExpanded
            ? 'w-auto px-2 gap-2 opacity-100 translate-x-0'
            : 'w-auto px-1 gap-1 opacity-100 translate-x-0',
        )}>
        {/* 1. Logo (Far Left) */}
        <div
          className={cn(
            'flex items-center transition-all duration-300',
            isExpanded
              ? 'px-2 pr-3 w-auto opacity-100'
              : 'w-0 px-0 opacity-0 overflow-hidden',
          )}>
          <Logo size='sm' showBadge={false} />
        </div>

        {!isExpanded && (
          <div className='pl-2 pr-1'>
            <ShieldCheckIcon className='h-6 w-6 text-primary' />
          </div>
        )}

        <div className='w-px h-6 bg-border/50 hidden sm:block shrink-0'></div>

        {/* 2. Score Badge (Prominent) */}
        <div className='flex items-center px-2 shrink-0'>
          <div
            className={cn(
              'flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full transition-all duration-300',
              isExpanded ? 'px-3 py-1.5' : 'p-1.5 justify-center',
            )}>
            <TrophyIcon className='h-4 w-4 text-primary' />
            {isExpanded && (
              <div className='flex items-baseline gap-1 animate-in fade-in duration-300'>
                <span className='text-sm font-bold text-primary leading-none'>
                  {currentScore}
                </span>
                <span className='text-[10px] font-semibold text-muted-foreground leading-none'>
                  / {baseScore}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='w-px h-6 bg-border/50 hidden sm:block shrink-0'></div>

        {/* 3. Tools (Middle Right) */}
        <div
          className={cn(
            'flex items-center shrink-0',
            isExpanded ? 'gap-1.5 px-2' : 'gap-1 px-1',
          )}>
          {isAdmin && <ScenarioDialog isExpanded={isExpanded} />}
          <LabInfoDialog isExpanded={isExpanded} />
          <HintsDialog isExpanded={isExpanded} />

          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-full shrink-0'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title='Toggle Theme'>
            <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground hover:text-foreground' />
            <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground hover:text-foreground' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        </div>

        <div className='w-px h-6 bg-border/50 hidden sm:block shrink-0'></div>

        {/* 4. Action & Exit (Far Right) */}
        <div
          className={cn(
            'flex items-center shrink-0',
            isExpanded ? 'gap-2 px-1' : 'gap-1 px-0',
          )}>
          {status !== 'COMPLETED' && (
            <SubmitFlagDialog isExpanded={isExpanded} />
          )}

          <Button
            variant='destructive'
            size='sm'
            className={cn(
              'h-8 rounded-full font-semibold shadow-sm transition-all duration-300 shrink-0 overflow-hidden',
              isExpanded ? 'px-4 gap-1.5' : 'w-8 px-0 justify-center',
            )}
            onClick={handleExit}
            title='Exit Lab'>
            <ArrowLeftIcon className='h-3.5 w-3.5 shrink-0' />
            {isExpanded && <span className='whitespace-nowrap'>Exit Lab</span>}
          </Button>
        </div>
      </header>
    </div>
  );
};
