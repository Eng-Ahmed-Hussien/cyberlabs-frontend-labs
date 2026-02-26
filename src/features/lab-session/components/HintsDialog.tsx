import { useState } from 'react';
import { LightbulbIcon, LockIcon, UnlockIcon, SparklesIcon } from 'lucide-react';
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

  const nextAvailableHintIndex = hints.findIndex((h) => !h.isUsed);
  const totalPenalty = hints.filter((h) => h.isUsed).reduce((acc, h) => acc + h.penaltyPercent, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant='ghost' 
          size='sm' 
          className='relative h-8 gap-1.5 text-[13px] font-semibold text-[#fbbc05] hover:text-[#cd8600] hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 rounded-full px-3'
        >
          <LightbulbIcon className='h-4 w-4' />
          Hints
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-3xl bg-[#fafafa] dark:bg-card p-0 overflow-hidden shadow-2xl border-0 rounded-[1.5rem] sm:rounded-[2rem]'>
        {/* Top Border Line */}
        <div className="h-1.5 w-full bg-[#fbbc05]"></div>

        {/* Header Area (Matches Screenshot exactly) */}
        <div className="relative px-10 pt-12 pb-8 bg-gradient-to-br from-[#fff7e5] to-[#fafafa] dark:from-amber-950/20 dark:to-card overflow-hidden">
          
          <div className='flex items-start justify-between relative z-10'>
            <div className='max-w-lg'>
              <DialogHeader className='text-left'>
                <DialogTitle className='text-[32px] font-bold text-foreground flex items-center gap-3'>
                  <div className='p-2.5 bg-[#fef0d4] dark:bg-amber-500/20 rounded-2xl shadow-sm'>
                    <LightbulbIcon className='h-8 w-8 text-[#fbbc05] fill-[#fdf2e1] dark:fill-amber-500/20' />
                  </div>
                  Tactical Assistance
                </DialogTitle>
                <p className="text-[16px] text-muted-foreground font-medium mt-4 leading-relaxed">
                  Stuck? Request a hint to reveal the next step. Note that relying on
                  intelligence will impact your final evaluation score.
                </p>
              </DialogHeader>
            </div>

            {/* Score Penalty Widget */}
            <div className="flex flex-col items-center justify-center bg-white dark:bg-card/50 border border-border/80 px-6 py-4 rounded-[1.25rem] shadow-sm shrink-0 min-w-[140px]">
              <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Score Penalty
              </span>
              <span className="text-3xl font-extrabold text-[#ea4335]">
                -{totalPenalty}%
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className='px-10 pb-10 flex flex-col gap-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border/50'>
          {hints.map((hint, index) => {
            const isUsed = hint.isUsed;
            const isNext = index === nextAvailableHintIndex;
            const isLocked = index > nextAvailableHintIndex && nextAvailableHintIndex !== -1;
            const isSolution = index === hints.length - 1;

            return (
              <motion.div
                layout
                key={hint.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                className={cn(
                  "rounded-2xl border transition-all duration-300 relative overflow-hidden",
                  isUsed ? 'bg-white border-border/60 shadow-sm dark:bg-card' : 'bg-white border-border/60 shadow-sm dark:bg-card/80',
                  isNext && 'bg-[#fffaf0] border-[#fbbc05]/40 shadow-[0_4px_20px_rgba(251,188,5,0.06)] dark:bg-amber-500/5'
                )}
              >
                {/* Active Indicator Line for 'Ready to decrypt' */}
                {isNext && <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#fbbc05] rounded-l-2xl"></div>}

                {/* Hint Header */}
                <div 
                  className={cn(
                    "flex items-center justify-between p-5 sm:px-6",
                    isUsed && "border-b border-border/40 bg-muted/10"
                  )}
                  onClick={() => {
                    if (!isUsed && isNext && !isPending) {
                      getNextHint();
                    }
                  }}
                  style={{ cursor: (!isUsed && isNext && !isPending) ? 'pointer' : 'default' }}
                >
                  <div className='flex items-center gap-4'>
                    {/* Icon */}
                    <div className={cn(
                      'flex items-center justify-center shrink-0 transition-colors',
                    )}>
                      {isUsed ? (
                        <UnlockIcon className='h-5 w-5 text-muted-foreground/50' />
                      ) : isNext ? (
                        <SparklesIcon className='h-5 w-5 text-[#fbbc05]' />
                      ) : (
                        <LockIcon className='h-5 w-5 text-muted-foreground/30' />
                      )}
                    </div>
                    
                    {/* Title Area */}
                    <div className="flex flex-col gap-0.5">
                      <span className={cn(
                        'font-bold text-[16px]',
                        isUsed ? 'text-foreground' : 
                        isNext ? 'text-[#cd8600] dark:text-amber-500' : 
                        'text-foreground'
                      )}>
                        {isSolution ? 'Complete Solution' : `Intelligence Level 0${index + 1}`}
                      </span>
                      {isNext && (
                        <span className="text-[13px] font-semibold text-[#fbbc05] dark:text-amber-500">
                          Ready to decrypt
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Side Info */}
                  <div className="flex items-center">
                    {isNext && (
                      <div className='flex items-center bg-[#fdf0ef] dark:bg-red-500/10 px-3 py-1 rounded-md border border-[#fad4d1] dark:border-red-500/20'>
                        <span className='text-[13px] font-bold text-[#ea4335]'>
                          -{hint.penaltyPercent}%
                        </span>
                      </div>
                    )}
                    {isLocked && (
                      <span className="text-[12px] font-bold tracking-widest text-muted-foreground/40 uppercase mr-2">
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Hint Content (Revealed) */}
                <AnimatePresence>
                  {isUsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-6 pt-5"
                    >
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
            <div className='flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-border bg-muted/10'>
              <LightbulbIcon className="h-8 w-8 text-muted-foreground/30" />
              <p className='text-sm font-semibold text-muted-foreground/60'>No tactical intelligence available for this mission.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};