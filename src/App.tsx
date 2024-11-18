import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';

function App() {
  return (
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  );
}

export default App;
