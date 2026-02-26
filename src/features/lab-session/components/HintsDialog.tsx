import { useState } from 'react';
import { LightbulbIcon, LockIcon, UnlockIcon, AlertTriangleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <Button variant='outline' size='sm' className='h-8 gap-1.5 text-xs font-medium border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-full px-3 transition-colors shadow-sm'>
          <LightbulbIcon className='h-3.5 w-3.5 fill-amber-500/20' />
          Hints
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-xl bg-card p-0 overflow-hidden shadow-2xl border-border/40'>
        {/* Decorative Header Background */}
        <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-transparent px-6 py-6 border-b border-border/50">
          <DialogHeader className='text-left space-y-2'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5'>
                <div className='p-2 bg-amber-500/20 rounded-lg'>
                  <LightbulbIcon className='h-5 w-5 text-amber-600 dark:text-amber-400 fill-amber-500/30' />
                </div>
                Lab Hints
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground/90 font-medium flex items-center gap-1.5 mt-2">
              <AlertTriangleIcon className='h-3.5 w-3.5 text-amber-500' />
              Using hints will permanently reduce your maximum possible score.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin'>
          {hints.map((hint, index) => {
            const isUsed = hint.isUsed;
            const isNext = index === nextAvailableHintIndex;
            const isLocked = index > nextAvailableHintIndex && nextAvailableHintIndex !== -1;
            const isSolution = index === hints.length - 1;

            return (
              <motion.div
                layout
                key={hint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  'rounded-xl border transition-all duration-300 overflow-hidden',
                  isUsed ? 'bg-card border-amber-500/30 shadow-sm' : 'bg-muted/10 border-border/50',
                  isNext && 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/20'
                )}
              >
                {/* Hint Header */}
                <div className={cn(
                  "flex items-center justify-between p-4",
                  isUsed && "bg-amber-500/5 border-b border-amber-500/10"
                )}>
                  <div className='flex items-center gap-2.5'>
                    {isUsed ? (
                      <div className='h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center'>
                        <UnlockIcon className='h-3 w-3 text-amber-600 dark:text-amber-400' />
                      </div>
                    ) : (
                      <div className='h-6 w-6 rounded-full bg-muted-foreground/10 flex items-center justify-center'>
                        <LockIcon className='h-3 w-3 text-muted-foreground/60' />
                      </div>
                    )}
                    <span className={cn(
                      'font-bold text-sm',
                      isUsed ? 'text-amber-700 dark:text-amber-400' : 'text-foreground/70'
                    )}>
                      {isSolution ? 'Complete Solution' : `Hint ${index + 1}`}
                    </span>
                  </div>
                  
                  {!isUsed && (
                    <span className='text-xs font-bold text-destructive/90 bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20'>
                      -{hint.penaltyPercent}% Score
                    </span>
                  )}
                </div>

                {/* Hint Content (Animated) */}
                <AnimatePresence>
                  {isUsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-5 pb-5 pt-3"
                    >
                      <div className='text-sm text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap'>
                        {hint.text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reveal Action */}
                {!isUsed && isNext && (
                  <div className="px-4 pb-4 pt-1">
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full h-10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold tracking-wide border-amber-500/30 transition-all hover:scale-[1.01]'
                      disabled={isPending}
                      onClick={() => getNextHint()}
                    >
                      Reveal {isSolution ? 'Solution' : 'Hint'}
                    </Button>
                  </div>
                )}

                {/* Locked State */}
                {isLocked && (
                  <div className="px-4 pb-4 pt-1 flex justify-center select-none">
                    <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                      Unlock previous hints first
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {hints.length === 0 && (
            <div className='text-sm font-medium text-muted-foreground/70 text-center py-10 rounded-xl border border-dashed border-border/60 bg-muted/20'>
              No hints are configured for this laboratory.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};