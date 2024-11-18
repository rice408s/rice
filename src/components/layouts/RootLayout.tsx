import { Outlet } from 'react-router-dom';
import { MainNavbar } from '../common/MainNavbar';
import { Footer } from '../common/Footer';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <MainNavbar />
      <Outlet />
      <Footer />
    </div>
  );
} 