import { useState, useEffect } from 'react';

export default function HeroParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalizamos la posición del ratón entre -1 y 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Elementos flotantes con diferentes velocidades para crear profundidad
  const items = [
    { icon: '🍋', top: '10%', left: '10%', speed: -20, size: 'text-4xl' },
    { icon: '🍌', top: '20%', left: '85%', speed: 30, size: 'text-5xl' },
    { icon: '🍃', top: '60%', left: '15%', speed: -15, size: 'text-3xl' },
    { icon: '🍌', top: '75%', left: '80%', speed: 25, size: 'text-4xl' },
    { icon: '✨', top: '30%', left: '45%', speed: 10, size: 'text-2xl' },
    { icon: '🍋', top: '85%', left: '40%', speed: -25, size: 'text-5xl' },
    { icon: '🍃', top: '5%', left: '50%', speed: 15, size: 'text-3xl' },
    { icon: '🍌', top: '45%', left: '5%', speed: -25, size: 'text-4xl' },
    { icon: '✨', top: '15%', left: '70%', speed: 20, size: 'text-2xl' },
    { icon: '🍋', top: '65%', left: '90%', speed: 35, size: 'text-4xl' },
    { icon: '🍌', top: '95%', left: '20%', speed: -30, size: 'text-5xl' },
    { icon: '🍃', top: '35%', left: '60%', speed: 18, size: 'text-3xl' },
    { icon: '✨', top: '80%', left: '70%', speed: -12, size: 'text-2xl' },
    { icon: '🍋', top: '55%', left: '25%', speed: 22, size: 'text-3xl' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute opacity-20 ${item.size} transition-transform duration-100 ease-out`}
          style={{
            top: item.top,
            left: item.left,
            transform: `translate(${offset.x * item.speed}px, ${offset.y * item.speed}px)`
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}