import { useRef, useState } from 'react';

export default function GameCard({ title, url, image, description }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculamos la rotación basada en la posición del ratón
    const rotateX = ((y - centerY) / centerY) * -10; // Invertimos eje Y para sensación natural
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
    setOpacity(1); // Mostramos el brillo
  };

  const handleMouseLeave = () => {
    // Reseteamos al salir
    setRotation({ x: 0, y: 0 });
    setOpacity(0);
  };

  return (
    <a
      href={url}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="block relative h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200 ease-out hover:shadow-2xl hover:z-10"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Efecto de Brillo (Glare) */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none z-20 mix-blend-overlay"
        style={{
            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 45%, transparent 60%)`,
            opacity: opacity,
            transform: `translateX(${rotation.y}%) translateY(${rotation.x}%)`,
            transition: 'opacity 0.2s'
        }}
      />
      
      <img src={image} className="w-full h-48 object-cover rounded-t-xl" alt={`Vista previa del juego ${title}`} />
      <div className="p-6">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h5>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </a>
  );
}