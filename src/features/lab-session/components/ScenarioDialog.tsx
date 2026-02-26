import { FileTextIcon, ShieldAlertIcon, LockKeyholeIcon, CodeIcon, CrosshairIcon } from 'lucide-react';
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
import { cn } from '@/shared/utils/cn';

export const ScenarioDialog = ({ isExpanded = true }: { isExpanded?: boolean }) => {
  const template = useLabSessionStore((state) => state.template);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant='outline' 
          size='sm' 
          className={cn(
            'flex border-primary/40 text-primary hover:bg-primary/10 rounded-full h-8 transition-all duration-300 shadow-sm overflow-hidden',
            isExpanded ? 'px-4 gap-2' : 'w-8 px-0 justify-center'
          )}
          disabled={!template}
          title="Lab Scenario (Admin)"
        >
          <FileTextIcon className='h-3.5 w-3.5 shrink-0' />
          {isExpanded && <span className="font-bold truncate">Scenario</span>}
        </Button>
      </DialogTrigger>
      
      <DialogContent className='max-w-3xl bg-card p-0 overflow-hidden shadow-2xl border-primary/30'>
        {/* Admin Banner */}
        <div className="bg-primary/95 text-primary-foreground px-6 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-widest shadow-md z-10 relative">
          <div className="flex items-center gap-2">
            <LockKeyholeIcon className="h-4 w-4" />
            Instructor & Admin View Only
          </div>
          <span className="bg-black/20 px-2 py-0.5 rounded text-[10px]">Confidential</span>
        </div>

        <DialogHeader className='px-8 pt-8 pb-4 text-left'>
          <DialogTitle className='flex items-center gap-3 text-2xl font-extrabold tracking-tight'>
            <ShieldAlertIcon className='h-7 w-7 text-primary' />
            Attack Scenario Breakdown
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground font-medium max-w-2xl mt-2'>
            This panel details the internal mechanics of the vulnerability. It is hidden from students to prevent spoiling the challenge.
          </DialogDescription>
        </DialogHeader>

        <div className='px-8 pb-8 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20'>
          {!template ? (
             <div className='p-12 text-center text-muted-foreground animate-pulse font-medium'>
               Decrypting scenario details...
             </div>
          ) : (
            <>
              {/* Context Block */}
              <div className='rounded-xl bg-muted/40 border border-border/60 overflow-hidden'>
                <div className='bg-muted/60 px-4 py-2 border-b border-border/60 flex items-center gap-2'>
                  <FileTextIcon className='h-4 w-4 text-foreground/60' />
                  <h4 className='font-bold text-xs uppercase tracking-wider text-foreground/80'>Environmental Context</h4>
                </div>
                <div className='p-5 text-sm text-foreground/90 leading-relaxed'>
                  This environment simulates a legacy banking portal. The backend directly concatenates user input into the SQL query without parameterization or proper sanitization.
                </div>
              </div>
              
              {/* Code Block */}
              <div className='rounded-xl overflow-hidden border border-destructive/30 shadow-sm'>
                <div className='bg-destructive/10 px-4 py-2 border-b border-destructive/20 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CodeIcon className='h-4 w-4 text-destructive' />
                    <h4 className='font-bold text-xs uppercase tracking-wider text-destructive'>Vulnerable Code (Simulated)</h4>
                  </div>
                  <div className='flex gap-1.5'>
                    <div className='h-2.5 w-2.5 rounded-full bg-red-500/50'></div>
                    <div className='h-2.5 w-2.5 rounded-full bg-yellow-500/50'></div>
                    <div className='h-2.5 w-2.5 rounded-full bg-green-500/50'></div>
                  </div>
                </div>
                <div className='bg-[#0d1117] p-5 overflow-x-auto'>
                  <pre className='text-[13px] font-mono leading-relaxed'>
                    <code className='text-gray-300'>
                      <span className='text-[#ff7b72]'>const</span> <span className='text-[#79c0ff]'>query</span> <span className='text-[#ff7b72]'>=</span> <span className='text-[#a5d6ff]'>"SELECT * FROM users WHERE username = '"</span> <span className='text-[#ff7b72]'>+</span> req.body.username <span className='text-[#ff7b72]'>+</span> <span className='text-[#a5d6ff]'>" AND password = '"</span> <span className='text-[#ff7b72]'>+</span> req.body.password <span className='text-[#ff7b72]'>+</span> <span className='text-[#a5d6ff]'>"'"</span>;
                    </code>
                  </pre>
                </div>
              </div>

              {/* Exploitation Block */}
              <div className='rounded-xl bg-emerald-500/5 border border-emerald-500/20 overflow-hidden'>
                <div className='bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20 flex items-center gap-2'>
                  <CrosshairIcon className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                  <h4 className='font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400'>Expected Exploitation</h4>
                </div>
                <div className='p-5 text-sm text-foreground/90 leading-relaxed'>
                  By injecting <code className='bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono font-bold mx-1 border border-emerald-500/30'>' OR '1'='1</code> into the username field, the query evaluates to true regardless of the password, effectively bypassing the authentication mechanism.
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};