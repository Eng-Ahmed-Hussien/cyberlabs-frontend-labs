import { createBrowserRouter } from 'react-router';
// Import the actual route we created
import { LabSessionRoute } from '@/features/lab-session/routes/LabSessionRoute';
import NotFoundPage from '@/features/errors/pages/not-found-page';
import UnauthorizedPage from '@/features/errors/pages/unauthorized-page';
export const router = createBrowserRouter([
  {
    // This is the main URL format for accessing a lab
    path: '/sessions/:labInstanceId',
    element: <LabSessionRoute />,
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
