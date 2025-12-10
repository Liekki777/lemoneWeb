
import { useState, useEffect, useMemo } from 'preact/hooks';

const HIGH_SCORE_KEY = 'trilerosHighScore';
// Hacemos el espaciado responsive para una mejor experiencia móvil.
const getSpacing = () => (typeof window !== 'undefined' && window.innerWidth < 576 ? 100 : 140);

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export default function TrilerosGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState('Dale a "Jugar" para empezar');
  // Cambiamos el estado para usar clases de Tailwind directamente.
  const [messageColorClass, setMessageColorClass] = useState('text-gray-800');
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('Jugar');
  const [canGuess, setCanGuess] = useState(false);

  const [ballPosition, setBallPosition] = useState(1);
  const [cupPositions, setCupPositions] = useState([0, 1, 2]);
  const [isBallVisible, setIsBallVisible] = useState(false);
  const [liftedCups, setLiftedCups] = useState([false, false, false]);
  const [spacing, setSpacing] = useState(getSpacing());

  useEffect(() => {
    setHighScore(Number(localStorage.getItem(HIGH_SCORE_KEY) || 0));

    const handleResize = () => setSpacing(getSpacing());
    window.addEventListener('resize', handleResize);
    // Limpieza al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cupStyles = useMemo(() => 
    cupPositions.map((pos, index) => ({
      // Usamos el estado 'spacing' para la responsividad
      transform: `translateX(calc(${(pos - 1) * spacing}px - 50%))`,
      bottom: liftedCups[index] ? '80px' : '30px',
    })), [cupPositions, liftedCups, spacing]);

  const ballStyle = useMemo(() => ({
    // Usamos el estado 'spacing' para la responsividad
    transform: `translateX(calc(${(ballPosition - 1) * spacing}px - 50%))`,
    opacity: isBallVisible ? 1 : 0,
    // La posición 'bottom' ahora está en las clases de Tailwind
  }), [ballPosition, isBallVisible, spacing]);

  async function liftAllCups(up) {
    setLiftedCups([up, up, up]);
    await delay(400);
  }

  async function startGame() {
    if (isPlaying) return;
    setIsPlaying(true);
    setCanGuess(false);
    setMessage('¡Atento!');
    setMessageColorClass('text-gray-800');

    setCupPositions([0, 1, 2]);
    setBallPosition(1);

    await liftAllCups(true);
    setIsBallVisible(true);
    await delay(500);
    await liftAllCups(false);
    setIsBallVisible(false);
    await delay(400);

    setMessage('Mezclando...');
    let shifts = 10;
    let speed = 400;
    let currentCupPositions = [0, 1, 2];
    let currentBallPosition = 1;

    for (let i = 0; i < shifts; i++) {
      if (i > shifts / 2) speed = 250;
      let posA = Math.floor(Math.random() * 3);
      let posB;
      do { posB = Math.floor(Math.random() * 3); } while (posA === posB);

      const cupIndexA = currentCupPositions.indexOf(posA);
      const cupIndexB = currentCupPositions.indexOf(posB);
      [currentCupPositions[cupIndexA], currentCupPositions[cupIndexB]] = [currentCupPositions[cupIndexB], currentCupPositions[cupIndexA]];

      if (currentBallPosition === posA) currentBallPosition = posB;
      else if (currentBallPosition === posB) currentBallPosition = posA;

      setCupPositions([...currentCupPositions]);
      setBallPosition(currentBallPosition);
      await delay(speed);
    }

    setBallPosition(currentBallPosition);
    setIsPlaying(false);
    setCanGuess(true);
    setMessage('¿Dónde está la pelota?');
    setButtonText('Reiniciar');
  }

  async function handleGuess(cupIndex) {
    if (isPlaying || !canGuess) return;
    setIsPlaying(true);
    setCanGuess(false);

    const visualPosOfClickedCup = cupPositions[cupIndex];
    const newLiftedCups = [...liftedCups];
    newLiftedCups[cupIndex] = true;
    setLiftedCups(newLiftedCups);
    await delay(300);

    if (visualPosOfClickedCup === ballPosition) {
      setIsBallVisible(true);
      setMessage('¡Correcto! +1 Punto');
      setMessageColorClass('text-green-600');
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem(HIGH_SCORE_KEY, newScore);
      }
    } else {
      setMessage('¡Fallaste! Puntos a 0');
      setMessageColorClass('text-red-600');
      setScore(0);
      const winningCupIndex = cupPositions.indexOf(ballPosition);
      if (winningCupIndex !== -1) {
        const finalLiftedCups = [...newLiftedCups];
        finalLiftedCups[winningCupIndex] = true;
        setLiftedCups(finalLiftedCups);
        setIsBallVisible(true);
      }
    }

    await delay(1500);

    setLiftedCups([false, false, false]);
    setIsBallVisible(false);
    setButtonText('Jugar de nuevo');
    setIsPlaying(false);
  }

  return (
    <div class="flex justify-center">
      <div class="w-full max-w-2xl">
        <div class="bg-white rounded-xl shadow-lg">
          <div class="p-6 text-center">
            <h1 class="text-2xl sm:text-3xl font-bold mb-4">Juego de Trileros</h1>
            <div class="mb-4 text-xl">
              Puntuación: <span class="font-bold">{score}</span> | Récord: <span class="font-bold">{highScore}</span>
            </div>
            {/* Contenedor del juego con altura fija y overflow controlado */}
            <div class="relative h-60 overflow-x-clip">
              <div
                className="absolute left-1/2 bottom-[30px] z-10 w-[30px] h-[30px] bg-yellow-400 rounded-full shadow-[0_0_12px_#f39c12] transition-opacity duration-200"
                style={ballStyle}
              ></div>
              {[0, 1, 2].map(index => (
                <div
                  key={index}
                  className="absolute left-1/2 z-20 w-[70px] h-[90px] sm:w-[90px] sm:h-[110px] bg-gradient-to-b from-red-500 to-red-700 rounded-t-md cursor-pointer border-b-[6px] border-red-900 shadow-xl select-none transition-all duration-400 ease-in-out"
                  style={cupStyles[index]}
                  onClick={() => handleGuess(index)}
                />
              ))}
            </div>
            <div className={`mt-4 font-semibold ${messageColorClass}`}>{message}</div>
            <button className="mt-4 px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={startGame} disabled={isPlaying}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
