import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { Preloader } from '@/features/lab-session/components/preloader';
// import NotFoundPage from '@/features/errors/pages/not-found-page';
import UnauthorizedPage from '@/features/errors/pages/unauthorized-page';

const LabSessionRouteLazy = lazy(async () => {
  const mod = await import('@/features/lab-session/routes/LabSessionRoute');
  return { default: mod.LabSessionRoute };
});

// ← NEW
const LaunchRouteLazy = lazy(async () => {
  const mod = await import('@/features/lab-session/routes/LaunchRoute');
  return { default: mod.LaunchRoute };
});

export const router = createBrowserRouter([
  {
    path: '/launch/:token', // ← NEW: one-time token route
    element: (
      <Suspense fallback={<Preloader />}>
        <LaunchRouteLazy />
      </Suspense>
    ),
  },
  {
    path: '/sessions/:labInstanceId',
    element: (
      <Suspense fallback={<Preloader />}>
        <LabSessionRouteLazy />
      </Suspense>
    ),
  },
  {
    path: '/401',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <UnauthorizedPage />,
  },
]);
