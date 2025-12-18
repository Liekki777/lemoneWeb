import Fuse from 'fuse.js';
import { useState, useEffect, useRef } from 'react';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Abrir el modal
  const openModal = () => {
    setIsOpen(true);
    // Pequeño timeout para dar tiempo a que se renderice el input antes de hacer focus
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  // Cerrar con la tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const response = await fetch('/busqueda.json');
      const searchList = await response.json();

      const fuse = new Fuse(searchList, {
        keys: ['title', 'description'],
        threshold: 0.3,
      });

      const searchResults = fuse.search(value);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  return (
    <>
      {/* 1. EL BOTÓN "TRIGGER" (Lo que se ve en la navbar) */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600 w-full lg:w-auto"
      >
        <i className="bi bi-search"></i>
        <span className="hidden lg:inline">Buscar...</span>
        <span className="hidden lg:inline-block ml-2 text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5">Ctrl K</span>
      </button>

      {/* 2. EL MODAL (Solo se renderiza si isOpen es true) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
             // Cierra si haces clic fuera del contenido (en el fondo oscuro)
             if(e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white dark:bg-[#161b22] w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all animate-fadeIn">
            
            {/* Input Header */}
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-4">
              <i className="bi bi-search text-gray-400 text-lg ml-2"></i>
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar artículos, juegos..."
                value={query}
                onChange={handleSearch}
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400 ml-3 outline-none"
                autoComplete="off"
              />
              <button
  onClick={openModal}
  // CAMBIO AQUÍ: he quitado "w-full" y puesto "w-auto" para que no empuje al menú hamburguesa
  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600 w-auto"
>
  <i className="bi bi-search"></i>
  <span className="hidden lg:inline">Buscar...</span>
  <span className="hidden lg:inline-block ml-2 text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5">Ctrl K</span>
</button>
            </div>

            {/* Resultados */}
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <ul className="p-2">
                   <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resultados</li>
                  {results.map((result) => (
                    <li key={result.item.slug}>
                      <a 
                        href={`/blog/${result.item.slug}`} 
                        className="block p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
                        onClick={closeModal} // Cierra al hacer clic en un enlace
                      >
                        <p className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400">
                          {result.item.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {result.item.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                query.length > 0 && (
                  <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                    <p>No encontramos nada para "{query}" 🍋</p>
                  </div>
                )
              )}
              
              {/* Estado vacío inicial */}
              {query.length === 0 && (
                 <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Escribe para empezar a buscar...
                 </div>
              )}
            </div>

            {/* Footer opcional */}
            <div className="bg-gray-50 dark:bg-[#0d1117] p-3 text-xs text-right text-gray-400 border-t border-gray-200 dark:border-gray-700">
                Buscador de LemoneWeb
            </div>
          </div>
        </div>
      )}
    </>
  );
}