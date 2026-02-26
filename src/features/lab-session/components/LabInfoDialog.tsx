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
        <Button
          variant='ghost'
          size='sm'
          className='gap-2 text-muted-foreground hover:text-foreground'>
          <InfoIcon className='h-4 w-4' />
          Lab Info
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {template.title}
            <span className='text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase'>
              {template.difficulty}
            </span>
          </DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-4'>
          <div className='bg-muted p-4 rounded-lg border border-border/50'>
            <h4 className='font-semibold text-sm flex items-center gap-2 mb-2'>
              <TargetIcon className='h-4 w-4 text-primary' />
              Goal
            </h4>
            <p className='text-sm'>{template.goal}</p>
          </div>

          <div>
            <h4 className='font-semibold text-sm mb-2'>Skills Earned</h4>
            <div className='flex flex-wrap gap-2'>
              {template.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className='text-xs bg-secondary px-2.5 py-1 rounded-md flex items-center gap-1.5'>
                  <CheckCircle2Icon className='h-3 w-3 text-green-500' />
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
