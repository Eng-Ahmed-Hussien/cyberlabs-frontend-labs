import { Moon, Sun, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HintsDialog } from './HintsDialog';
import { useLabSessionStore } from '../store/useLabSessionStore';

export const LabTopbar = () => {
  // const { theme, setTheme } = useTheme();
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);

  const handleExit = () => {
    // Return to main platform
    // window.location.href = import.meta.env.VITE_MAIN_PLATFORM_URL;
    window.close(); // If opened in a new tab
  };

  return (
    <header className='h-14 border-b bg-background flex items-center justify-between px-4 shrink-0'>
      {/* Left Side: Exit & Score */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleExit}
          title='Exit Lab'>
          <ArrowLeftIcon className='h-4 w-4' />
        </Button>

        <div className='flex flex-col'>
          <span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
            Score
          </span>
          <span className='text-sm font-bold font-mono'>
            {currentScore} / {baseScore}
          </span>
        </div>
      </div>

      {/* Right Side: Hints, Theme, Logo */}
      <div className='flex items-center gap-3'>
        <HintsDialog />

        {/* Theme Toggle */}
        <Button
          variant='ghost'
          size='icon'
          // onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>

        {/* Logo */}
        <div className='font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 ml-2 border-l pl-4'>
          CyberLabs
        </div>
      </div>
    </header>
  );
};
