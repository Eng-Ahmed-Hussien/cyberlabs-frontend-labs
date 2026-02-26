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

export const HintsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hints = useLabSessionStore((state) => state.hints);
  const sessionId = useLabSessionStore((state) => state.sessionId);

  const { mutate: getNextHint, isPending } = useNextHintMutation(sessionId!);

  // Find the first unused hint to be the next available one
  const nextAvailableHintIndex = hints.findIndex((h) => !h.isUsed);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <LightbulbIcon className='h-4 w-4 text-yellow-500' />
          Hints
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Lab Hints</DialogTitle>
          <DialogDescription>
            Using hints will reduce your maximum possible score for this lab.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 flex flex-col gap-3'>
          {hints.map((hint, index) => {
            const isUsed = hint.isUsed;
            const isNext = index === nextAvailableHintIndex;
            const isLocked =
              index > nextAvailableHintIndex && nextAvailableHintIndex !== -1;

            return (
              <div
                key={hint.id}
                className={`rounded-lg border p-4 transition-colors ${
                  isUsed ? 'bg-muted/50 border-border' : 'border-border/50'
                }`}>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-semibold text-sm flex items-center gap-2'>
                    {index === hints.length - 1
                      ? 'Solution'
                      : `Hint ${index + 1}`}
                    {isUsed ? (
                      <UnlockIcon className='h-3 w-3 text-green-500' />
                    ) : (
                      <LockIcon className='h-3 w-3 text-muted-foreground' />
                    )}
                  </span>
                  {!isUsed && (
                    <span className='text-xs font-medium text-destructive'>
                      -{hint.penaltyPercent}% Score
                    </span>
                  )}
                </div>

                {isUsed ? (
                  <p className='text-sm text-foreground whitespace-pre-wrap'>
                    {hint.text}
                  </p>
                ) : (
                  <Button
                    variant={isNext ? 'secondary' : 'ghost'}
                    size='sm'
                    className='w-full mt-2'
                    disabled={isLocked || isPending}
                    onClick={() => getNextHint()}>
                    {isNext ? 'Reveal' : 'Locked'}
                  </Button>
                )}
              </div>
            );
          })}

          {hints.length === 0 && (
            <p className='text-sm text-muted-foreground text-center py-4'>
              No hints available for this lab.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
