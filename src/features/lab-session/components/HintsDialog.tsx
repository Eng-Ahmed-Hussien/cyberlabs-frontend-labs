import { useState, useMemo } from 'react';
import {
  LightbulbIcon,
  LockIcon,
  UnlockIcon,
  SparklesIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
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

  // ===== Derived State (memoized for clarity) =====
  const nextAvailableHintIndex = useMemo(
    () => hints.findIndex((h) => !h.isUsed),
    [hints],
  );

  const totalPenalty = useMemo(
    () =>
      hints
        .filter((h) => h.isUsed)
        .reduce((acc, h) => acc + h.penaltyPercent, 0),
    [hints],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='relative h-8 gap-1.5 text-[13px] font-semibold text-[#fbbc05]
          hover:text-[#cd8600] hover:bg-amber-50
          dark:text-amber-400 dark:hover:bg-amber-500/10
          rounded-full px-3'>
          <LightbulbIcon className='h-4 w-4' />
          Hints
        </Button>
      </DialogTrigger>

      <DialogContent
        className='max-w-3xl bg-[#fafafa] dark:bg-card p-0
        shadow-2xl border-0 rounded-[1.5rem] sm:rounded-[2rem]
        flex flex-col max-h-[85vh] overflow-hidden'>
        {/* Top Border */}
        <div className='h-[6px] w-full bg-[#fbbc05] shrink-0 rounded-t-[inherit]' />

        {/* Header */}
        <div
          className='relative px-10 pt-12 pb-8
          bg-gradient-to-br from-[#fff7e5] to-[#fafafa]
          dark:from-amber-950/20 dark:to-card shrink-0'>
          <div className='flex items-start justify-between relative z-10'>
            <div className='max-w-lg'>
              <DialogHeader className='text-left'>
                <DialogTitle className='text-[32px] font-bold text-foreground flex items-center gap-3'>
                  <div className='p-2.5 bg-[#fef0d4] dark:bg-amber-500/20 rounded-2xl shadow-sm'>
                    <LightbulbIcon className='h-8 w-8 text-[#fbbc05]' />
                  </div>
                  Tactical Assistance
                </DialogTitle>

                <p className='text-[16px] text-muted-foreground font-medium mt-4 leading-relaxed'>
                  Stuck? Request a hint to reveal the next step. Note that
                  relying on intelligence will impact your final evaluation
                  score.
                </p>
              </DialogHeader>
            </div>

            {/* Penalty Widget */}
            <div
              className='flex flex-col items-center justify-center
              bg-white dark:bg-card/50 border border-border/80
              px-6 py-4 rounded-[1.25rem] shadow-sm shrink-0 min-w-[140px]'>
              <span className='text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-1'>
                Score Penalty
              </span>
              <span className='text-3xl font-extrabold text-[#ea4335]'>
                -{totalPenalty}%
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className='flex-1 overflow-y-auto min-h-0 px-10 pb-10
          flex flex-col gap-4 scrollbar-thin scrollbar-thumb-border/50'>
          {hints.map((hint, index) => {
            const isUsed = hint.isUsed;
            const isNext = index === nextAvailableHintIndex;
            const isLocked =
              index > nextAvailableHintIndex && nextAvailableHintIndex !== -1;
            const isSolution = index === hints.length - 1;

            const canDecrypt = !isUsed && isNext && !isPending;

            return (
              <motion.div
                key={hint.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'rounded-2xl border transition-all duration-300 relative shrink-0 bg-white dark:bg-card/80 border-border/60 shadow-sm',
                  isNext &&
                    'bg-[#fffaf0] border-[#fbbc05]/40 shadow-[0_4px_20px_rgba(251,188,5,0.06)] dark:bg-amber-500/5',
                )}>
                {isNext && (
                  <div className='absolute left-0 top-0 bottom-0 w-[5px] bg-[#fbbc05] rounded-l-2xl' />
                )}

                {/* Header */}
                <div
                  onClick={() => canDecrypt && getNextHint()}
                  className={cn(
                    'flex items-center justify-between p-5 sm:px-6 transition-colors',
                    isUsed && 'border-b border-border/40 bg-muted/10',
                    canDecrypt && 'cursor-pointer hover:bg-muted/20',
                  )}>
                  <div className='flex items-center gap-4'>
                    {/* Icon */}
                    {isUsed ? (
                      <UnlockIcon className='h-5 w-5 text-muted-foreground/50' />
                    ) : isNext ? (
                      <SparklesIcon className='h-5 w-5 text-[#fbbc05]' />
                    ) : (
                      <LockIcon className='h-5 w-5 text-muted-foreground/30' />
                    )}

                    {/* Title */}
                    <div className='flex flex-col gap-0.5'>
                      <span
                        className={cn(
                          'font-bold text-[16px]',
                          isUsed
                            ? 'text-foreground'
                            : isNext
                              ? 'text-[#cd8600] dark:text-amber-500'
                              : 'text-muted-foreground/60',
                        )}>
                        {isSolution
                          ? 'Complete Solution'
                          : `Intelligence Level 0${index + 1}`}
                      </span>

                      {isNext && (
                        <span className='text-[13px] font-semibold text-[#fbbc05] dark:text-amber-500'>
                          Ready to decrypt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className='flex items-center'>
                    {isNext && (
                      <div
                        className='flex items-center bg-[#fdf0ef]
                        dark:bg-red-500/10 px-3 py-1 rounded-md
                        border border-[#fad4d1] dark:border-red-500/20'>
                        <span className='text-[13px] font-bold text-[#ea4335]'>
                          -{hint.penaltyPercent}%
                        </span>
                      </div>
                    )}

                    {isLocked && (
                      <span
                        className='text-[12px] font-bold tracking-widest
                        text-muted-foreground/40 uppercase ml-2'>
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {isUsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className='px-6 pb-6 pt-5 overflow-hidden'>
                      <div className='text-[15px] text-foreground/80 leading-[1.7] font-medium whitespace-pre-wrap'>
                        {hint.text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {hints.length === 0 && (
            <div
              className='flex flex-col items-center justify-center gap-3 py-16
              rounded-2xl border border-dashed border-border bg-muted/10'>
              <LightbulbIcon className='h-8 w-8 text-muted-foreground/30' />
              <p className='text-sm font-semibold text-muted-foreground/60'>
                No tactical intelligence available for this mission.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
