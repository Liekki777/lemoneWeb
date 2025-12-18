import Fuse from 'fuse.js';
import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Configuración del buscador
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) { // Buscar solo si hay más de 2 letras
      // 1. Traemos los datos (si ya los trajimos, usa una caché idealmente, pero esto sirve)
      const response = await fetch('/busqueda.json');
      const searchList = await response.json();

      // 2. Configuramos Fuse
      const fuse = new Fuse(searchList, {
        keys: ['title', 'description'], // ¿En qué campos buscamos?
        threshold: 0.3, // Sensibilidad (0 es exacto, 1 es muy laxo)
      });

      // 3. Buscamos
      const searchResults = fuse.search(value);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={handleSearch}
        className="p-2 border rounded text-black w-full"
      />

      {results.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-white text-black border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          <ul>
            {results.map((result) => (
              <li key={result.item.slug} className="border-b last:border-0">
                <a href={`/blog/${result.item.slug}`} className="block p-3 hover:bg-gray-100">
                  <p className="font-bold">{result.item.title}</p>
                  <p className="text-sm text-gray-600 truncate">{result.item.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}   