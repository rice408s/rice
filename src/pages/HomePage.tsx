import { HeroSection } from '../components/common/HeroSection';
import { RecentBlogs } from '../components/RecentBlogs';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <div className="min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col">
        <HeroSection />
      </div>
      
      <div className="px-4 md:px-0">
        <RecentBlogs />
      </div>
    </div>
  );
} 