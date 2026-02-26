import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/sessions/:labInstanceId',
    element: (
      <div className='p-4 text-white'>Lab Session Page (Coming Soon)</div>
    ),
  },
  {
    path: '*',
    element: <div className='p-4 text-red-500'>404 - Not Found</div>,
  },
]);
