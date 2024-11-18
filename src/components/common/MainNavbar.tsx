import { Link } from "react-router-dom";
import { useState } from "react";

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

export function MainNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: '首页', icon: '⚡', path: '/' },
    { name: '博客', icon: '📝', path: '/blogs' },
    { name: '照片', icon: '📸', path: '/gallery' },
    { name: '关于', icon: '🤖', path: '/about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.02] backdrop-blur-sm border-b border-white/[0.05]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="group relative">
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <span className="text-lg font-sans text-white/80 tracking-wider group-hover:text-white transition-colors duration-500 font-['LXGW_WenKai']">
                  白干饭
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent 
                  origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          </Link>
          
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group relative px-4 py-2"
              >
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <span className="text-sm font-['LXGW_WenKai'] text-white/60 tracking-wider group-hover:text-white transition-colors duration-500 flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      {item.name}
                    </span>
                    <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent 
                      origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div 
          className={`md:hidden absolute left-0 right-0 bg-[#0F0F1A]/95 backdrop-blur-sm border-b border-white/[0.05] 
            transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group block py-3 px-4 text-white/60 hover:text-white transition-colors duration-300
                  hover:bg-white/[0.02] rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-['LXGW_WenKai'] tracking-wide">{item.name}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 