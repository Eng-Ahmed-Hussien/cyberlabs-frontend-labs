import { useState } from 'react';
import { FlagIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { useSubmitFlagMutation } from '../api/labSessionApi';
import { toast } from 'sonner';

export const SubmitFlagDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [flag, setFlag] = useState('');
  
  const sessionId = useLabSessionStore((state) => state.sessionId);
  const markAsCompleted = useLabSessionStore((state) => state.markAsCompleted);
  const currentScore = useLabSessionStore((state) => state.currentScore);
  
  // Assuming useSubmitFlagMutation returns standard React Query mutation object
  const { mutate: submitFlag, isPending } = useSubmitFlagMutation(sessionId!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    submitFlag(flag.trim(), {
      onSuccess: (data) => {
        // Close the dialog
        setIsOpen(false);
        setFlag('');
        
        // Mark as completed in the store which triggers the Celebration Overlay
        // If data returns the final score, use it, otherwise use current
        markAsCompleted(data?.finalScore ?? currentScore);
        
        toast.success("Flag accepted!", {
          description: "Mission accomplished.",
          icon: <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />,
        });
      },
      onError: (error: any) => {
        // Keep dialog open, show error toast
        const errorMessage = error?.response?.data?.message || error?.message || "Invalid flag.";
        toast.error("Flag validation failed", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant='default' 
          size='sm' 
          className='h-8 gap-1.5 rounded-full px-4 font-bold shadow-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0'
        >
          <FlagIcon className='h-3.5 w-3.5' />
          Submit Flag
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-md bg-card p-0 overflow-hidden shadow-2xl border-border/50 rounded-2xl'>
        {/* Top Decorative Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"></div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/10">
            <DialogHeader className='text-left space-y-3'>
              <DialogTitle className='text-2xl font-extrabold tracking-tight flex items-center gap-3'>
                <div className='p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl'>
                  <FlagIcon className='h-5 w-5 text-emerald-600 dark:text-emerald-500' />
                </div>
                Mission Target
              </DialogTitle>
              <p className="text-[15px] text-muted-foreground font-medium leading-relaxed">
                Found the vulnerability? Submit the flag you captured to complete the laboratory and secure your points.
              </p>
            </DialogHeader>

            <div className="mt-8 space-y-2">
              <label htmlFor="flag-input" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Captured Flag
              </label>
              <div className="relative">
                <Input
                  id="flag-input"
                  autoFocus
                  placeholder="e.g., CYBER{SQLi_Byp4ss_M0ck}"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="h-12 pl-4 pr-10 text-base font-mono bg-background border-border/60 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 transition-all rounded-xl"
                  disabled={isPending}
                />
                {isPending && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground/50" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-5 bg-muted/20 border-t border-border/40 sm:justify-between flex-row items-center">
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground rounded-full px-4"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full px-6 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 gap-2"
              disabled={!flag.trim() || isPending}
            >
              {isPending ? 'Verifying...' : 'Submit Intelligence'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};