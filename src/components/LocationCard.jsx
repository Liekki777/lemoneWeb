import { useRef, useState, useEffect } from 'react';

export default function LocationCard() {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Actualizamos el reloj cada segundo
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const hours = now.getHours();
      // Simulamos horario de oficina: Abierto de 9:00 a 18:00
      setIsOpen(hours >= 9 && hours < 18);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Efecto tilt suave
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto transform transition-transform duration-100 ease-out border border-gray-100 dark:border-gray-700"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">Lemoné HQ</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Oficinas Centrales</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-sm ${isOpen ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {isOpen ? '● ABIERTO' : '● CERRADO'}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-blue-600 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
          </div>
          <div>
            <p className="font-bold">Dirección</p>
            <p className="text-sm opacity-80">Calle del Limón, 123<br/>28013 Madrid, España</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg text-purple-600 dark:text-purple-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/></svg>
          </div>
          <div>
             <p className="font-bold">Contacto</p>
             <a href="mailto:hola@lemone.com" className="text-sm hover:text-blue-500 transition-colors">hola@lemone.com</a>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg text-green-600 dark:text-green-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
          </div>
          <div>
             <p className="font-bold">Horario</p>
             <p className="text-sm opacity-80">Lunes - Viernes: 09:00 - 18:00</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400">HORA LOCAL</span>
          <span className="text-2xl font-mono font-bold text-gray-800 dark:text-white tracking-widest">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}