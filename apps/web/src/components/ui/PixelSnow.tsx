import React, { useEffect, useRef } from 'react';
import './PixelSnow.css';

interface PixelSnowProps {
  color?: string;
  speed?: number;
  density?: number;
  flakeSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PixelSnow: React.FC<PixelSnowProps> = ({
  color = '#8FB8A8',
  speed = 1.0,
  density = 0.4,
  flakeSize = 2.5,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const count = Math.floor((width * height) / 12000 * density);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * flakeSize + 1,
      speedY: (Math.random() * 0.8 + 0.4) * speed,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (let p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.globalAlpha = p.opacity;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, speed, density, flakeSize]);

  return (
    <div className={`pixel-snow-container ${className}`} style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PixelSnow;
