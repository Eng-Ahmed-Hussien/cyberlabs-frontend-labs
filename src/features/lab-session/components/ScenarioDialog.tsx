import { FileTextIcon, ShieldAlertIcon } from 'lucide-react';
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

export const ScenarioDialog = () => {
  const template = useLabSessionStore((state) => state.template);

  if (!template) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2 hidden md:flex border-primary/50 text-primary hover:bg-primary/10'>
          <FileTextIcon className='h-4 w-4' />
          Lab Scenario
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl bg-card border-primary/20 shadow-lg shadow-primary/5'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <ShieldAlertIcon className='h-6 w-6 text-primary' />
            Attack Scenario Overview
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            Admin view only. This explains the internal mechanics of the vulnerability.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-4 text-sm leading-relaxed'>
          <div className='p-4 rounded-md bg-muted/50 border border-border'>
            <h4 className='font-semibold text-foreground mb-2'>Context</h4>
            <p>
              This environment simulates a legacy banking portal. The backend directly concatenates user input into the SQL query without parameterization or proper sanitization.
            </p>
          </div>
          
          <div className='p-4 rounded-md bg-destructive/10 border border-destructive/20'>
            <h4 className='font-semibold text-destructive mb-2'>The Vulnerable Code (Simulated)</h4>
            <pre className='bg-background/80 p-3 rounded text-xs font-mono text-foreground overflow-x-auto border border-border'>
              <code>
                {`const query = "SELECT * FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'";`}
              </code>
            </pre>
          </div>

          <div className='p-4 rounded-md bg-green-500/10 border border-green-500/20'>
            <h4 className='font-semibold text-green-600 dark:text-green-400 mb-2'>Expected Exploitation</h4>
            <p>
              By injecting <code>' OR '1'='1</code> into the username field, the query evaluates to true regardless of the password, effectively bypassing the authentication mechanism.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
