import { useState, useEffect } from 'preact/hooks';

const POKEMON_COUNT = 8; // 8 pares, 16 cartas

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function PokeMemoryGame() {
  const [cards, setCards] = useState([]);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'won'
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [turns, setTurns] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const startGame = async () => {
    setGameState('loading');
    setTurns(0);
    setMatchedIds(new Set());
    setFlippedCards([]);
    setCards([]);

    try {
      const randomOffset = Math.floor(Math.random() * 350); // Aumentamos el rango para más variedad
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}&offset=${randomOffset}`);
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokeResponse = await fetch(pokemon.url);
          const pokeData = await pokeResponse.json();
          return {
            id: pokeData.id,
            name: pokeData.name,
            image: pokeData.sprites.front_default,
          };
        })
      );

      const gameCards = pokemonDetails.flatMap(p => [
        { ...p, uniqueId: `${p.id}-a` },
        { ...p, uniqueId: `${p.id}-b` }
      ]);

      setCards(shuffleArray(gameCards));
      setGameState('playing');
    } catch (error) {
      console.error("Error al cargar los Pokémon:", error);
      setGameState('idle');
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setTurns(turns + 1);
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.id === secondCard.id) {
        // Es una coincidencia
        setMatchedIds(prev => new Set(prev).add(firstCard.id));
        setFlippedCards([]); // Limpia las cartas volteadas para el siguiente turno
        setIsChecking(false);
      } else {
        // No es una coincidencia, voltear de nuevo
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards]);
  
  // Comprobar si se ha ganado
  useEffect(() => {
    if (matchedIds.size === POKEMON_COUNT && gameState === 'playing') {
      setGameState('won');
    }
  }, [matchedIds]);

  const handleCardClick = (clickedCard) => {
    // No hacer nada si se está comprobando, si la carta ya es un par, o si ya hay 2 cartas seleccionadas
    if (isChecking || matchedIds.has(clickedCard.id) || flippedCards.length === 2 || flippedCards.some(c => c.uniqueId === clickedCard.uniqueId)) {
      return;
    }
    
    // Añadir la carta a las volteadas
    setFlippedCards([...flippedCards, clickedCard]);
  };

  return (
    <div class="flex flex-col items-center w-full max-w-5xl mx-auto p-4">
      {gameState === 'idle' && (
        <div class="text-center py-12">
          <h2 class="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">PokeMemory</h2>
          <button
            onClick={startGame}
            class="px-10 py-4 bg-yellow-400 text-gray-900 font-bold text-xl rounded-full hover:bg-yellow-300 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            ¡JUGAR!
          </button>
        </div>
      )}

      {(gameState === 'loading' || gameState === 'playing' || gameState === 'won') && (
        <>
          <div class="flex justify-between w-full max-w-2xl mb-6 text-lg font-medium text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span>Turnos: <span class="font-bold text-blue-600">{turns}</span></span>
            <span>Pares: <span class="font-bold text-green-600">{matchedIds.size} / {POKEMON_COUNT}</span></span>
          </div>

          {gameState === 'loading' && (
            <div class="flex flex-col items-center justify-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <div class="text-xl font-semibold text-gray-600">Cargando Pokémon...</div>
            </div>
          )}

          {gameState === 'won' && (
            <div class="text-center my-8 p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-lg">
              <h2 class="text-4xl font-extrabold text-green-600 mb-2">¡Ganaste!</h2>
              <p class="text-gray-600 mb-6 text-lg">Completado en <span class="font-bold text-gray-800">{turns}</span> turnos</p>
              <button
                onClick={startGame}
                class="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Jugar de Nuevo
              </button>
            </div>
          )}

          <div class={`grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 w-full max-w-4xl [perspective:1000px] ${gameState === 'won' ? 'opacity-50 pointer-events-none' : ''}`}>
            {cards.map((card) => {
              const isFlipped = flippedCards.some(c => c.uniqueId === card.uniqueId) || matchedIds.has(card.id);

              return (
                <div
                  key={card.uniqueId}
                  class="aspect-square relative cursor-pointer group"
                  onClick={isFlipped ? undefined : () => handleCardClick(card)}
                >
                  <div
                    class={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover:scale-105'}`}
                  >
                    {/* Cara trasera */}
                    <div class="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md border-2 border-blue-400/30">
                      <img src="/pokeball.svg" alt="Pokeball" class="w-2/3 h-2/3 opacity-90 drop-shadow-md" />
                    </div>
                    {/* Cara frontal */}
                    <div class="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-xl flex items-center justify-center shadow-md border-2 border-gray-100 [transform:rotateY(180deg)]">
                      <img src={card.image} alt={card.name} class="w-full h-full object-contain p-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}