import { InfoIcon, TargetIcon, CheckCircle2Icon, ShieldIcon, SparklesIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { cn } from '@/shared/utils/cn';

const getDifficultyColor = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  if (d === 'easy') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (d === 'medium') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20';
  if (d === 'hard') return 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20';
  return 'bg-primary/10 text-primary border-primary/20';
};

export const LabInfoDialog = ({ isExpanded = true }: { isExpanded?: boolean }) => {
  const template = useLabSessionStore((state) => state.template);

  if (!template) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant='ghost' 
          size='sm' 
          className={cn(
            'h-8 font-medium text-muted-foreground hover:text-foreground rounded-full transition-all duration-300 overflow-hidden hover:bg-muted/50',
            isExpanded ? 'px-3 gap-1.5 text-xs' : 'w-8 px-0 justify-center'
          )}
          title="Lab Info"
        >
          <InfoIcon className='h-4 w-4 shrink-0' />
          {isExpanded && <span className="truncate">Lab Info</span>}
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-xl bg-card p-0 overflow-hidden shadow-2xl border-border/40'>
        {/* Decorative Header Background */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-6 border-b border-border/50">
          <DialogHeader className='text-left space-y-3'>
            <div className='flex items-center justify-between gap-4'>
              <DialogTitle className='text-2xl font-bold tracking-tight text-foreground flex items-center gap-2'>
                <ShieldIcon className='h-6 w-6 text-primary' />
                {template.title}
              </DialogTitle>
              <span className={cn('text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-widest shrink-0', getDifficultyColor(template.difficulty))}>
                {template.difficulty}
              </span>
            </div>
            <DialogDescription className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
              {template.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin'>
          {/* Goal Section */}
          <div className='relative overflow-hidden bg-muted/30 p-5 rounded-xl border border-border/60'>
            <div className='absolute top-0 left-0 w-1 h-full bg-primary/60'></div>
            <h4 className='font-bold text-sm flex items-center gap-2 mb-2 text-foreground'>
              <TargetIcon className='h-4 w-4 text-primary' />
              Mission Goal
            </h4>
            <p className='text-sm text-foreground/80 leading-relaxed font-medium'>
              {template.goal}
            </p>
          </div>

          {/* Skills Section */}
          <div>
            <h4 className='font-bold text-sm mb-3 flex items-center gap-2 text-foreground'>
              <SparklesIcon className='h-4 w-4 text-yellow-500' />
              Skills Acquired
            </h4>
            <div className='flex flex-wrap gap-2.5'>
              {template.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className='text-xs bg-background border border-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-foreground/80 font-semibold shadow-sm transition-all hover:border-primary/30'
                >
                  <CheckCircle2Icon className='h-3.5 w-3.5 text-primary' />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};