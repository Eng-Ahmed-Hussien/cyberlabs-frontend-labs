import { useState } from 'react';
import { LightbulbIcon, LockIcon, UnlockIcon, ShieldAlertIcon, SparklesIcon } from 'lucide-react';
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
  const totalPenalty = hints.filter(h => h.isUsed).reduce((acc, h) => acc + h.penaltyPercent, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='relative h-8 gap-1.5 text-xs font-bold border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-full px-4 transition-all shadow-sm overflow-hidden group'>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <LightbulbIcon className='h-3.5 w-3.5 fill-amber-500/20' />
          Hints
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-2xl bg-background/95 backdrop-blur-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] border-border/40'>
        {/* Top Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

        {/* Header Section */}
        <div className="relative px-8 py-8 border-b border-border/50 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px] pointer-events-none"></div>
          
          <DialogHeader className='text-left space-y-4 relative z-10'>
            <div className='flex items-start justify-between'>
              <div>
                <DialogTitle className='text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3'>
                  <div className='p-2.5 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl border border-amber-500/20 shadow-inner'>
                    <LightbulbIcon className='h-6 w-6 text-amber-500 drop-shadow-sm' />
                  </div>
                  Tactical Assistance
                </DialogTitle>
                <p className="text-sm text-muted-foreground/80 font-medium mt-3 max-w-md leading-relaxed">
                  Stuck? Request a hint to reveal the next step. Note that relying on intelligence will impact your final evaluation score.
                </p>
              </div>

              {/* Score Impact Widget */}
              <div className="flex flex-col items-end gap-1.5 bg-card/50 backdrop-blur-md border border-border/50 p-3 rounded-xl shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Score Penalty</span>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-2xl font-black tracking-tighter", totalPenalty > 0 ? "text-destructive" : "text-emerald-500")}>
                    -{totalPenalty}%
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className='p-8 flex flex-col gap-5 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20'>
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
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                className={cn(
                  'rounded-2xl border transition-all duration-500 relative overflow-hidden',
                  isUsed ? 'bg-card border-border shadow-sm' : 'bg-muted/30 border-border/40',
                  isNext && 'bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/10 translate-y-[-2px]'
                )}
              >
                {/* Active Indicator Line */}
                {isNext && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}
                {isUsed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-border/50"></div>}

                {/* Hint Header */}
                <div className={cn(
                  "flex items-center justify-between p-5",
                  isUsed && "border-b border-border/50"
                )}>
                  <div className='flex items-center gap-3'>
                    {isUsed ? (
                      <div className='h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm'>
                        <UnlockIcon className='h-3.5 w-3.5 text-foreground/70' />
                      </div>
                    ) : isNext ? (
                      <div className='h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center animate-pulse'>
                        <SparklesIcon className='h-3.5 w-3.5 text-amber-600 dark:text-amber-400' />
                      </div>
                    ) : (
                      <div className='h-8 w-8 rounded-full bg-muted-foreground/10 border border-border/50 flex items-center justify-center'>
                        <LockIcon className='h-3.5 w-3.5 text-muted-foreground/40' />
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <span className={cn(
                        'font-bold text-sm tracking-wide',
                        isUsed ? 'text-foreground' : isNext ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground/50'
                      )}>
                        {isSolution ? 'Complete Solution' : `Intelligence Level 0${index + 1}`}
                      </span>
                      {isNext && <span className="text-[10px] text-amber-600/70 dark:text-amber-400/70 font-semibold">Ready to decrypt</span>}
                    </div>
                  </div>
                  
                  {!isUsed && (
                    <div className='flex items-center gap-1.5 bg-destructive/10 px-2.5 py-1 rounded-md border border-destructive/15'>
                      <ShieldAlertIcon className="h-3 w-3 text-destructive" />
                      <span className='text-xs font-bold text-destructive'>
                        -{hint.penaltyPercent}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Hint Content (Animated) */}
                <AnimatePresence>
                  {isUsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-6 pt-4 bg-gradient-to-b from-muted/10 to-transparent"
                    >
                      <div className='text-[14px] text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap selection:bg-amber-500/30'>
                        {hint.text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reveal Action */}
                {!isUsed && isNext && (
                  <div className="px-5 pb-5 pt-2">
                    <Button
                      variant='outline'
                      className='w-full h-11 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold tracking-widest uppercase text-xs border-amber-500/30 transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] group'
                      disabled={isPending}
                      onClick={() => getNextHint()}
                    >
                      <span className="flex items-center gap-2 transition-transform group-hover:scale-105">
                        <UnlockIcon className="h-3.5 w-3.5" />
                        Decrypt {isSolution ? 'Solution' : 'Intelligence'}
                      </span>
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}

          {hints.length === 0 && (
            <div className='flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-border bg-muted/20'>
              <ShieldAlertIcon className="h-8 w-8 text-muted-foreground/30" />
              <p className='text-sm font-semibold text-muted-foreground/60'>No tactical intelligence available for this mission.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};