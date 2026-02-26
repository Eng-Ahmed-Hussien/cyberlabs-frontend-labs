import { InfoIcon, TargetIcon, CheckCircle2Icon } from 'lucide-react';
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

export const LabInfoDialog = () => {
  const template = useLabSessionStore((state) => state.template);

  if (!template) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground'>
          <InfoIcon className='h-3.5 w-3.5' />
          <span className="hidden sm:inline">Lab Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md bg-card'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {template.title}
            <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider'>
              {template.difficulty}
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-4'>
          <div className='bg-muted/50 p-4 rounded-lg border border-border/50'>
            <h4 className='font-semibold text-sm flex items-center gap-2 mb-2 text-foreground'>
              <TargetIcon className='h-4 w-4 text-primary' />
              Goal
            </h4>
            <p className='text-sm text-muted-foreground leading-relaxed'>{template.goal}</p>
          </div>

          <div>
            <h4 className='font-semibold text-sm mb-3 text-foreground'>Skills Earned</h4>
            <div className='flex flex-wrap gap-2'>
              {template.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className='text-xs bg-secondary/50 border border-border/50 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-foreground font-medium'
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