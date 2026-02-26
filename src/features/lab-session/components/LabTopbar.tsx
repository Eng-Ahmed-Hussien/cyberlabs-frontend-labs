import { Moon, Sun, ArrowLeftIcon, FileTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HintsDialog } from './HintsDialog';
import { LabInfoDialog } from './LabInfoDialog';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useTheme } from '@/core/providers/theme-provider';

// Mock function to check if user is admin (you can replace this with your actual auth store later)
const useIsAdmin = () => {
  // For now, returning true so you can see it. Change to false to hide the scenario button.
  return true; 
};

export const LabTopbar = () => {
  const { theme, setTheme } = useTheme();
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);
  const isAdmin = useIsAdmin();

  const handleExit = () => {
    // window.location.href = import.meta.env.VITE_MAIN_PLATFORM_URL;
    window.close();
  };

  return (
    <header className='h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative'>
      {/* Left Side: Exit & Score */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleExit} title='Exit Lab'>
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

      {/* Right Side: Admin Scenario, Lab Info, Hints, Theme, Logo */}
      <div className='flex items-center gap-2'>
        
        {/* Admin Only Scenario Button */}
        {isAdmin && (
          <Button variant='outline' size='sm' className='gap-2 hidden md:flex border-primary/50 text-primary hover:bg-primary/10'>
            <FileTextIcon className='h-4 w-4' />
            Lab Scenario (Admin)
          </Button>
        )}

        <LabInfoDialog />
        <HintsDialog />
        
        <div className='w-px h-6 bg-border mx-2 hidden sm:block'></div>

        <Button 
          variant='ghost' 
          size='icon'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>

        {/* Logo Image */}
        <div className='ml-2 border-l pl-4 hidden sm:flex items-center'>
          {/* Ensure the path matches where you put the logo in public folder */}
          <img 
            src="/cyberlabs-logo.png" 
            alt="CyberLabs Logo" 
            className="h-8 w-auto object-contain dark:invert" 
            onError={(e) => {
              // Fallback if image path is incorrect
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">CyberLabs</span>';
            }}
          />
        </div>
      </div>
    </header>
  );
};
