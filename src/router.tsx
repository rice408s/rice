import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import About from './pages/About';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import { BlogList } from './pages/BlogList';
import { BlogDetail } from './pages/BlogDetail';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/gallery',
          element: <Gallery />,
        },
        {
          path: '/photo/:id',
          element: <PhotoDetail />,
        },
        {
          path: '/blogs',
          element: <BlogList />
        },
        {
          path: '/blogs/:slug',
          element: <BlogDetail />
        }
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true
    }
  }
); 