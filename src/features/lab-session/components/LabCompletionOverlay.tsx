import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  ArrowRightIcon, 
  CheckCircle2Icon, 
  ShieldCheckIcon,
  StarIcon,
  PartyPopperIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { cn } from '@/shared/utils/cn';

export const LabCompletionOverlay = () => {
  const template = useLabSessionStore((state) => state.template);
  const currentScore = useLabSessionStore((state) => state.currentScore);
  const baseScore = useLabSessionStore((state) => state.baseScore);
  
  // Calculate percentage for circular progress or visual
  const percentage = Math.round((currentScore / baseScore) * 100);
  const isPerfect = percentage === 100;

  const handleReturn = () => {
    // In a real app, this might navigate to the dashboard
    // For now, we close the window as per previous instructions
    window.close();
  };

  return (
    <div className='absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-6 animate-in fade-in duration-500'>
      {/* Confetti / Sparkles Background Effect (CSS-based simple particles could go here, but we keep it clean) */}
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
        className='relative w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden'
      >
        {/* Top Decorative Banner */}
        <div className={cn(
          "h-2 w-full",
          isPerfect ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" : "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"
        )}></div>

        <div className='p-8 flex flex-col items-center text-center'>
          {/* Trophy / Icon */}
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={cn(
              "h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-lg",
              isPerfect ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500" : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500"
            )}
          >
            {isPerfect ? (
              <TrophyIcon className="h-12 w-12 drop-shadow-sm" />
            ) : (
              <PartyPopperIcon className="h-12 w-12 drop-shadow-sm" />
            )}
          </motion.div>

          {/* Titles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              {isPerfect ? "Mission Perfect!" : "Mission Accomplished!"}
            </h2>
            <p className="text-muted-foreground font-medium mb-8 max-w-xs mx-auto">
              You successfully compromised <span className="text-foreground font-bold">{template?.title || "Target System"}</span>.
            </p>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-muted/30 border border-border/50 rounded-2xl p-5 mb-8 flex items-center justify-between"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Score</span>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-3xl font-black",
                  isPerfect ? "text-amber-600 dark:text-amber-500" : "text-emerald-600 dark:text-emerald-500"
                )}>
                  {currentScore}
                </span>
                <span className="text-sm font-bold text-muted-foreground">/ {baseScore}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-border/60"></div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star} 
                    className={cn(
                      "h-4 w-4",
                      star <= Math.ceil((percentage / 100) * 5) 
                        ? (isPerfect ? "text-amber-500 fill-amber-500" : "text-emerald-500 fill-emerald-500")
                        : "text-muted-foreground/20"
                    )} 
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badges / Skills */}
          {template?.skills && template.skills.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full mb-8"
            >
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Skills Acquired</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {template.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold">
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" />
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <Button 
              size="lg" 
              className={cn(
                "w-full font-bold shadow-lg transition-all hover:scale-[1.02]",
                isPerfect 
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white border-0" 
                  : "bg-primary hover:bg-primary/90"
              )}
              onClick={handleReturn}
            >
              Return to Dashboard
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};