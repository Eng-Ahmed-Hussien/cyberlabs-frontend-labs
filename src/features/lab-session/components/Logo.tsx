import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
}

export function Logo({ size = 'md', className }: LogoProps) {
  const textSizes: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'text-[1.2rem]',
    md: 'text-[1.4rem]',
    lg: 'text-[1.8rem]',
  };

  return (
    <Link
      to={ROUTES.HOME}
      className={cn(
        'flex items-center gap-2',
        'transition-transform duration-300 ease-in-out hover:scale-105',
        className,
      )}>
      <h2
        className={cn(
          'cyberlabs-logo-title',
          'mb-0 mx-2 font-bold',
          textSizes[size],
          'transition-colors duration-300 ease-in-out',
        )}>
        Cyber <span>Labs</span>
      </h2>
    </Link>
  );
}

export default Logo;
