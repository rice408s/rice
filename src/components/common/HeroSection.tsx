import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { RecentBlogs } from '../RecentBlogs';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  draw: () => void;
  update: () => void;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ParticleClass implements Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 1.5;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new ParticleClass());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('recent-blogs');
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 min-h-screen">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center space-y-8">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-white/90 font-sans">
                <span className="font-mono text-indigo-400">&lt;</span>
                Welcome
                <span className="font-mono text-indigo-400">/&gt;</span>
              </h1>
              
              <p className="text-white/50 font-mono text-base md:text-lg max-w-2xl mx-auto leading-loose">
                在代码与生活的交织处，寻找平行世界的另一种可能
              </p>

              <div className="flex gap-6 justify-center mt-12">
                <Button
                  as={Link}
                  to="/blogs"
                  className="group relative px-8 py-3 bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white/80">
                    博客
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                </Button>

                <Button
                  as={Link}
                  to="/about"
                  className="group relative px-8 py-3 bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white/80">
                    关于
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                </Button>
              </div>
            </div>

            <div 
              className="absolute bottom-24 cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={handleScrollDown}
            >
              <svg 
                className="w-10 h-10 text-white/20 animate-pulse transition-opacity duration-1000"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8L12 17L21 8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 