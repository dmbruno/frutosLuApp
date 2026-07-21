import { createBrowserRouter } from 'react-router-dom';
import { TodayPage } from './pages/TodayPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TodayPage />,
  },
]);
