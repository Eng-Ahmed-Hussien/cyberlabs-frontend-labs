import { useState } from 'react';
import { LightbulbIcon, LockIcon, UnlockIcon } from 'lucide-react';
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
import { useNextHintMutation } from '../api/labSessionApi';
import { cn } from '@/shared/utils/cn';

export const HintsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hints = useLabSessionStore((state) => state.hints);
  const sessionId = useLabSessionStore((state) => state.sessionId);
  
  const { mutate: getNextHint, isPending } = useNextHintMutation(sessionId!);

  const nextAvailableHintIndex = hints.findIndex((h) => !h.isUsed);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 gap-1.5 text-xs font-medium border-primary/20 hover:bg-primary/5 rounded-full px-3'>
          <LightbulbIcon className='h-3.5 w-3.5 text-yellow-500' />
          Hints
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md bg-card p-6 shadow-xl border-border/40'>
        <DialogHeader className='text-left space-y-2 mb-2'>
          <DialogTitle className='text-xl font-bold'>Lab Hints</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Using hints will reduce your maximum possible score for this lab.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4 mt-2 max-h-[60vh] overflow-y-auto pr-1 pb-1 scrollbar-thin'>
          {hints.map((hint, index) => {
            const isUsed = hint.isUsed;
            const isNext = index === nextAvailableHintIndex;
            const isLocked = index > nextAvailableHintIndex && nextAvailableHintIndex !== -1;

            return (
              <div
                key={hint.id}
                className={cn(
                  'rounded-xl border p-4 transition-all duration-200',
                  isUsed ? 'bg-muted/30 border-primary/20' : 'bg-card border-border/60',
                  isNext && 'border-primary/40 shadow-sm'
                )}
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-sm text-foreground'>
                      {index === hints.length - 1 ? 'Solution' : `Hint ${index + 1}`}
                    </span>
                    {isUsed ? (
                      <UnlockIcon className='h-3.5 w-3.5 text-primary' />
                    ) : (
                      <LockIcon className='h-3.5 w-3.5 text-muted-foreground/60' />
                    )}
                  </div>
                  {!isUsed && (
                    <span className='text-xs font-semibold text-destructive/80'>
                      -{hint.penaltyPercent}% Score
                    </span>
                  )}
                </div>

                {isUsed ? (
                  <div className='bg-background rounded-md p-3 text-sm text-foreground border border-border/50 whitespace-pre-wrap leading-relaxed shadow-sm'>
                    {hint.text}
                  </div>
                ) : isNext ? (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full h-10 mt-1 bg-primary/5 hover:bg-primary/10 text-primary font-semibold tracking-wide border border-primary/10'
                    disabled={isPending}
                    onClick={() => getNextHint()}
                  >
                    Reveal
                  </Button>
                ) : (
                  <div className='w-full py-3 mt-1 text-center text-sm font-medium text-muted-foreground/60 select-none'>
                    Locked
                  </div>
                )}
              </div>
            );
          })}

          {hints.length === 0 && (
            <div className='text-sm text-muted-foreground text-center py-8 rounded-xl border border-dashed border-border bg-muted/20'>
              No hints available for this lab.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};