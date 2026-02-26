import { useParams } from 'react-router';
import { useLabSessionQuery } from '../api/labSessionApi';
import { LabLayout } from '../components/LabLayout';
import { AlertCircle } from 'lucide-react';
import { Preloader } from '../components/preloader';

export const LabSessionRoute = () => {
  const { labInstanceId } = useParams<{ labInstanceId: string }>();

  const { isLoading, isError, error } = useLabSessionQuery(labInstanceId!);

  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-background gap-4 text-center'>
        <AlertCircle className='h-10 w-10 text-destructive' />
        <h2 className='text-xl font-bold'>Failed to load lab session</h2>
        <p className='text-muted-foreground text-sm max-w-md'>
          {error?.message ||
            "The lab might have expired or you don't have access."}
        </p>
      </div>
    );
  }

  return <LabLayout />;
};