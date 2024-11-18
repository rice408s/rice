import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { PageTitle } from '../components/common/PageTitle';

const About = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      draw: () => void;
      update: () => void;
    }> = [];
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        this.x = Math.random() * (canvas?.width ?? 0);
        this.y = Math.random() * (canvas?.height ?? 0);
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 1.5;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`;
      }

      draw() {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
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

  const skills = [
    { 
      title: "AI 驱动开发", 
      desc: "与 AI 结对编程，在代码的海洋里一起遨游。让 Cursor 成为我的第二大脑，用对话的方式写代码" 
    },
    { 
      title: "创意实验室", 
      desc: "把脑洞变成现实，用代码构建各种有趣的小玩意。不是所有代码都要改变世界，有趣就够了" 
    },
    { 
      title: "终身学习者", 
      desc: "保持着对新技术的好奇心，像海绵一样吸收知识。最近迷上了 AI 辅助编程，感觉打开了新世界的大门" 
    },
    { 
      title: "生活美学家", 
      desc: "相信写代码也是一种艺术创作。在代码中追求简洁优雅，在生活中寻找诗意栖居" 
    },
  ];

  const hobbies = [
    '🌏 环球漫游', 
    '🍳 美食探索', 
    '📸 光影记录', 
    '🏃‍♂ 运动健身',
    '🎮 游戏玩家',
    '🎵 音乐爱好者'
  ];

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <div className="mb-12">
          <PageTitle 
            title="Hello World" 
            subtitle="一个热爱生活的码农，在代码与生活之间寻找平衡。用技术实现脑洞，用镜头记录生活，在旅行中发现灵感，在美食中品味人生。" 
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6 px-4 md:px-0">
          {hobbies.map((hobby, index) => (
            <span key={index} 
              className="px-4 py-2 bg-white/[0.02] border border-indigo-500/20 
                rounded-full text-white/60 text-sm hover:border-indigo-500/40 
                transition-all duration-300">
              {hobby}
            </span>
          ))}
        </div>

        <section className="mt-16 px-4 md:px-0">
          <h2 className="text-2xl font-light text-white/80 mb-8 tracking-wider">
            <span className="text-indigo-400 font-mono">#</span> 技能树
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <Card key={index} 
                className="bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30
                  transition-all duration-500">
                <CardBody className="p-4 md:p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-light tracking-wide text-white/80">
                      <span className="text-indigo-400 font-mono mr-2">&gt;</span>
                      {skill.title}
                    </h3>
                    <p className="text-white/40 text-sm pl-6 font-light">
                      {skill.desc}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center px-4 md:px-0">
          <a 
            href="https://cursor.sh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
              border border-indigo-500/20 hover:border-indigo-500/30 
              transition-all duration-300 cursor-pointer">
            <span className="text-indigo-400 animate-pulse">⚡</span>
            <span className="text-white/60 text-sm font-light">
              用 AI 写代码的快乐，你想象不到
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 