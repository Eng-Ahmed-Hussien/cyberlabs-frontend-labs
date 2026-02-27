import { useState, useEffect } from 'react';
import { useLabSessionStore } from '@/features/lab-session/store/useLabSessionStore';
import { initLab1, loginLab1 } from './lab1Api';
import { toast } from 'sonner';
import { Loader2, ShieldAlert, Terminal, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils/cn';

/* ─── types ─── */
type AppScreen = 'loading' | 'login' | 'dashboard';

interface LoginResult {
  username: string;
  role: 'USER' | 'ADMIN';
  flag?: string;
  exploited?: boolean;
}

/* ─── SQL Echo Component (live query visualizer) ─── */
const SqlEcho = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const esc = (v: string) => v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const u = esc(username || '...');
  const p = esc(password || '...');
  return (
    <div
      className='mt-4 rounded-xl border border-border/40 bg-zinc-950 p-4
                    font-mono text-xs leading-relaxed text-zinc-400
                    overflow-x-auto hidden sm:block'>
      <span className='text-zinc-600 select-none'>-- live query preview</span>
      {'\n'}
      <span className='text-blue-400'>SELECT</span>{' '}
      <span className='text-zinc-300'>* </span>
      <span className='text-blue-400'>FROM</span>{' '}
      <span className='text-green-400'>"users"</span>
      {'\n'}
      <span className='text-blue-400'>WHERE</span>{' '}
      <span className='text-zinc-300'>username = </span>
      <span className='text-amber-300'>'</span>
      <span
        className={cn(
          'transition-colors',
          username.includes("'") ? 'text-red-400 font-bold' : 'text-amber-300',
        )}>
        {u}
      </span>
      <span className='text-amber-300'>'</span>
      {'\n  '}
      <span className='text-blue-400'>AND</span>{' '}
      <span className='text-zinc-300'>password = </span>
      <span className='text-amber-300'>'</span>
      <span className='text-amber-300'>{p}</span>
      <span className='text-amber-300'>'</span>
    </div>
  );
};

/* ─── Flag Banner ─── */
const FlagBanner = ({ flag }: { flag: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(flag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className='rounded-2xl border border-emerald-500/30
                    bg-emerald-950/30 p-5 space-y-3'>
      <div className='flex items-center gap-2 text-emerald-400'>
        <ShieldAlert className='h-5 w-5' />
        <span className='font-bold text-sm'>
          🎉 SQL Injection Successful — Admin Access Granted!
        </span>
      </div>
      <div
        className='flex items-center justify-between gap-3
                      rounded-xl bg-zinc-950 border border-emerald-500/20
                      px-4 py-3 font-mono text-sm'>
        <span className='text-emerald-300 font-bold tracking-wide truncate'>
          {flag}
        </span>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7 shrink-0 text-zinc-400 hover:text-emerald-300'
          onClick={copy}>
          {copied ? (
            <Check className='h-4 w-4' />
          ) : (
            <Copy className='h-4 w-4' />
          )}
        </Button>
      </div>
      <p className='text-xs text-zinc-500 leading-relaxed'>
        Copy this flag and click{' '}
        <strong className='text-zinc-300'>Submit Flag</strong> in the top bar to
        complete the lab and earn your points.
      </p>
    </div>
  );
};

/* ─── Admin Dashboard Screen ─── */
const AdminDashboard = ({
  result,
  onLogout,
}: {
  result: LoginResult;
  onLogout: () => void;
}) => (
  <div className='flex h-full w-full flex-col overflow-auto bg-background'>
    {/* Top nav */}
    <nav
      className='sticky top-0 z-10 flex items-center justify-between
                    border-b border-border/50 bg-background/95 backdrop-blur
                    px-6 py-3'>
      <div className='flex items-center gap-3'>
        <div
          className='h-8 w-8 rounded-lg bg-primary/10 border border-primary/20
                        flex items-center justify-center'>
          <span className='text-sm'>🏦</span>
        </div>
        <span className='font-bold text-sm'>NationalBank Portal</span>
      </div>
      <div className='flex items-center gap-3'>
        <span
          className='rounded-full bg-emerald-500/10 border border-emerald-500/20
                        px-3 py-1 text-xs font-bold text-emerald-400'>
          {result.role}
        </span>
        <Button
          variant='ghost'
          size='sm'
          className='h-7 text-xs'
          onClick={onLogout}>
          Logout
        </Button>
      </div>
    </nav>

    <div className='flex-1 p-6 space-y-6 max-w-3xl mx-auto w-full'>
      {/* Welcome banner */}
      <div
        className='rounded-2xl border border-red-500/30 bg-red-950/20
                      p-5 flex items-start gap-4'>
        <ShieldAlert className='h-6 w-6 text-red-400 mt-0.5 shrink-0' />
        <div>
          <h2 className='font-bold text-red-300'>
            ⚠️ Unauthorised Access Detected
          </h2>
          <p className='mt-1 text-sm text-zinc-400 leading-relaxed'>
            You bypassed authentication as{' '}
            <code className='bg-zinc-800 px-1.5 rounded text-amber-300'>
              {result.username}
            </code>{' '}
            using SQL Injection. In a real system, this would trigger security
            alerts and full audit logging.
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className='rounded-2xl border border-border/50 bg-card overflow-hidden'>
        <div className='px-5 py-3 border-b border-border/50'>
          <h3 className='font-bold text-sm'>👤 User Database (Exfiltrated)</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border/30 bg-muted/30'>
                {['Username', 'Email', 'Role', 'Password'].map((h) => (
                  <th
                    key={h}
                    className='px-5 py-3 text-left text-xs font-bold
                                 text-muted-foreground tracking-wider'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  username: 'user',
                  email: 'user@test.com',
                  role: 'USER',
                  password: 'userpass',
                },
                {
                  username: 'admin',
                  email: 'admin@test.com',
                  role: 'ADMIN',
                  password: 'impossible_to_guess_pass_XYZ',
                },
              ].map((u, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-border/20 transition-colors',
                    u.role === 'ADMIN'
                      ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                      : 'hover:bg-muted/20',
                  )}>
                  <td className='px-5 py-3 font-mono font-bold'>
                    {u.username}
                  </td>
                  <td className='px-5 py-3 text-muted-foreground'>{u.email}</td>
                  <td className='px-5 py-3'>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-bold',
                        u.role === 'ADMIN'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-muted text-muted-foreground',
                      )}>
                      {u.role}
                    </span>
                  </td>
                  <td className='px-5 py-3 font-mono text-xs text-zinc-500'>
                    {u.role === 'ADMIN' ? '••••••••••••••••' : u.password}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flag */}
      {result.flag && <FlagBanner flag={result.flag} />}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const SQLiLab1 = () => {
  const sessionId = useLabSessionStore((s) => s.sessionId);

  const [screen, setScreen] = useState<AppScreen>('loading');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /* Init lab on mount */
  useEffect(() => {
    if (!sessionId) return;
    initLab1(sessionId)
      .then(() => setScreen('login'))
      .catch(() => {
        // initLab is idempotent — if it already exists, just proceed
        setScreen('login');
      });
  }, [sessionId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !username.trim()) return;

    setError(null);
    setIsLogging(true);
    setAttempts((n) => n + 1);

    try {
      const result = await loginLab1(sessionId, username, password);

      if (result.role === 'ADMIN' && result.exploited) {
        toast.success('💉 SQL Injection successful! Flag captured.');
        setLoginResult({ ...result });
        setScreen('dashboard');
      } else if (result.role === 'USER') {
        toast.info(`Logged in as ${result.username} (USER) — try harder!`);
        setLoginResult({ ...result });
        setScreen('dashboard');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Login failed';
      setError(msg);
      if (attempts >= 1) {
        toast.error('Login failed — check the SQL Echo below for a hint!');
      }
    } finally {
      setIsLogging(false);
    }
  };

  /* ── Loading ── */
  if (screen === 'loading') {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='h-8 w-8 text-primary animate-spin' />
          <p className='text-sm text-muted-foreground'>
            Spinning up lab environment...
          </p>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  if (screen === 'dashboard' && loginResult) {
    return (
      <AdminDashboard
        result={loginResult}
        onLogout={() => {
          setLoginResult(null);
          setUsername('');
          setPassword('');
          setError(null);
          setScreen('login');
        }}
      />
    );
  }

  /* ── Login Form ── */
  return (
    <div
      className='flex h-full w-full items-center justify-center
                    bg-background px-4 py-8 overflow-auto'>
      <div className='w-full max-w-md space-y-5'>
        {/* Card */}
        <div
          className='rounded-2xl border border-border/50 bg-card
                        shadow-xl shadow-black/10 overflow-hidden'>
          {/* Top accent */}
          <div className='h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent' />

          <div className='p-7 space-y-6'>
            {/* Logo */}
            <div className='flex items-center gap-3'>
              <div
                className='h-10 w-10 rounded-xl bg-primary/10 border
                              border-primary/20 flex items-center justify-center
                              text-xl shrink-0'>
                🏦
              </div>
              <div>
                <p className='font-bold text-sm leading-none'>
                  NationalBank Portal
                </p>
                <p className='text-[11px] text-muted-foreground mt-0.5 tracking-widest uppercase'>
                  Secure Employee Access
                </p>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className='text-xl font-bold'>Sign In</h1>
              <p className='text-sm text-muted-foreground mt-0.5'>
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className='space-y-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-muted-foreground tracking-widest uppercase'>
                  Username
                </label>
                <Input
                  autoFocus
                  autoComplete='off'
                  placeholder="e.g.  admin' OR '1'='1  --"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLogging}
                  className={cn(
                    'h-11 font-mono text-sm transition-colors',
                    username.includes("'") &&
                      'border-amber-500/60 focus-visible:ring-amber-500/30 bg-amber-500/5',
                  )}
                />
              </div>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-muted-foreground tracking-widest uppercase'>
                  Password
                </label>
                <Input
                  type='text' // intentionally text so user can see what they type
                  autoComplete='off'
                  placeholder='leave blank or enter anything'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLogging}
                  className='h-11 font-mono text-sm'
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className='rounded-xl border border-destructive/30
                                bg-destructive/10 px-4 py-3 text-xs
                                font-medium text-destructive flex items-center gap-2'>
                  <ShieldAlert className='h-3.5 w-3.5 shrink-0' />
                  {error}
                </div>
              )}

              <Button
                type='submit'
                disabled={isLogging || !username.trim()}
                className='h-11 w-full rounded-xl font-bold text-sm mt-1'>
                {isLogging ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    Authenticating...
                  </>
                ) : (
                  'Log In →'
                )}
              </Button>
            </form>

            {/* Attempts counter */}
            {attempts > 0 && (
              <p className='text-center text-xs text-muted-foreground'>
                {attempts} attempt{attempts !== 1 ? 's' : ''} — keep trying!
              </p>
            )}
          </div>
        </div>

        {/* Live SQL Echo */}
        <SqlEcho username={username} password={password} />

        {/* Hint bar */}
        <div
          className='flex items-center gap-2 rounded-xl border border-primary/20
                        bg-primary/5 px-4 py-3 text-xs text-muted-foreground'>
          <Terminal className='h-3.5 w-3.5 text-primary shrink-0' />
          <span>
            <strong className='text-foreground'>Hint:</strong> Notice how the
            username field is injected directly into the SQL query. The SQL Echo
            above updates in real-time — watch what happens when you type a{' '}
            <code className='bg-muted px-1 rounded'>&#39;</code>.
          </span>
        </div>
      </div>
    </div>
  );
};
