import { useState } from 'react';

export default function Contador() {
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount(count + 1)}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Has hecho clic {count} veces
    </button>
  );
}
