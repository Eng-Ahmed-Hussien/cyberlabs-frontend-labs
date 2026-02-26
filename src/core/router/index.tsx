import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { Preloader } from '@/features/lab-session/components/preloader';
import NotFoundPage from '@/features/errors/pages/not-found-page';
import UnauthorizedPage from '@/features/errors/pages/unauthorized-page';

const LabSessionRouteLazy = lazy(async () => {
  const mod = await import('@/features/lab-session/routes/LabSessionRoute');
  return { default: mod.LabSessionRoute };
});

export const router = createBrowserRouter([
  {
    // This is the main URL format for accessing a lab
    path: '/sessions/:labInstanceId',
    element: (
      <Suspense fallback={<Preloader />}>
        <LabSessionRouteLazy />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    path: '/401',
    element: <UnauthorizedPage />,
  },
]);