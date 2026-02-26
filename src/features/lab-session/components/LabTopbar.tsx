import { Moon, Sun, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HintsDialog } from './HintsDialog';
import { LabInfoDialog } from './LabInfoDialog';
import { ScenarioDialog } from './ScenarioDialog';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';

const useIsAdmin = () => {
  return true; // Admin toggle
};

export const LabTopbar = () => {
  const { theme, setTheme } = useTheme();
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);
  const isAdmin = useIsAdmin();

  const handleExit = () => {
    window.close();
  };

  return (
    <header className='h-12 border-b bg-background flex items-center justify-between px-3 shrink-0 shadow-sm z-10 relative'>
      {/* Left Side: Exit & Score */}
      <div className='flex items-center gap-3'>
        <Button variant='ghost' size='icon' className='h-8 w-8' onClick={handleExit} title='Exit Lab'>
          <ArrowLeftIcon className='h-4 w-4' />
        </Button>

        <div className='flex flex-col border-l pl-3 ml-1'>
          <span className='text-[9px] text-muted-foreground font-semibold uppercase tracking-wider leading-none mb-1'>
            Score
          </span>
          <span className='text-xs font-bold font-mono text-primary leading-none'>
            {currentScore} <span className='text-muted-foreground font-normal'>/ {baseScore}</span>
          </span>
        </div>
      </div>

      {/* Right Side: Tools & Logo */}
      <div className='flex items-center gap-2'>
        
        {isAdmin && <ScenarioDialog />}
        <LabInfoDialog />
        <HintsDialog />
        
        <div className='w-px h-5 bg-border mx-1 hidden sm:block'></div>

        <Button 
          variant='ghost' 
          size='icon'
          className='h-8 w-8'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>

        {/* Real Logo from Platform */}
        <div className='ml-1 border-l pl-3 hidden sm:flex items-center select-none'>
          <img 
             src={theme === 'dark' ? '/images/logo-white.svg' : '/images/logo-dark.svg'} 
             onError={(e) => {
               e.currentTarget.style.display = 'none';
               // Fallback to text if SVG not found
               e.currentTarget.insertAdjacentHTML('afterend', '<span class="cyberlabs-logo-title text-xl tracking-tight">Cyber<span>Labs</span></span>');
             }}
             alt="CyberLabs Logo" 
             className="h-6 w-auto" 
          />
        </div>
      </div>
    </header>
  );
};