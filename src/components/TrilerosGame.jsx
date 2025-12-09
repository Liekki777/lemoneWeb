
import { useState, useEffect, useMemo } from 'preact/hooks';

const HIGH_SCORE_KEY = 'trilerosHighScore';
const SPACING = 140;

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export default function TrilerosGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState('Dale a "Jugar" para empezar');
  const [messageColor, setMessageColor] = useState('black');
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('Jugar');
  const [canGuess, setCanGuess] = useState(false);

  const [ballPosition, setBallPosition] = useState(1);
  const [cupPositions, setCupPositions] = useState([0, 1, 2]);
  const [isBallVisible, setIsBallVisible] = useState(false);
  const [liftedCups, setLiftedCups] = useState([false, false, false]);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem(HIGH_SCORE_KEY) || 0));
  }, []);

  const cupStyles = useMemo(() => 
    cupPositions.map((pos, index) => ({
      transform: `translateX(calc(${(pos - 1) * SPACING}px - 50%))`,
      bottom: liftedCups[index] ? '80px' : '30px',
    })), [cupPositions, liftedCups]);

  const ballStyle = useMemo(() => ({
    transform: `translateX(calc(${(ballPosition - 1) * SPACING}px - 50%))`,
    opacity: isBallVisible ? 1 : 0,
  }), [ballPosition, isBallVisible]);

  async function liftAllCups(up) {
    setLiftedCups([up, up, up]);
    await delay(400);
  }

  async function startGame() {
    if (isPlaying) return;
    setIsPlaying(true);
    setCanGuess(false);
    setMessage('¡Atento!');
    setMessageColor('black');

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
      setMessageColor('#198754');
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem(HIGH_SCORE_KEY, newScore);
      }
    } else {
      setMessage('¡Fallaste! Puntos a 0');
      setMessageColor('#dc3545');
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
    <>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <h1 class="card-title mb-3">Juego de Trileros</h1>
              <div class="mb-3" style={{ fontSize: '1.25rem' }}>
                Puntuación: <span>{score}</span> | Récord: <span>{highScore}</span>
              </div>
              <div style={{ position: 'relative', height: '240px' }}>
                <div class="ball" style={ballStyle}></div>
                {[0, 1, 2].map(index => (
                  <div key={index} class="cup" style={cupStyles[index]} onClick={() => handleGuess(index)} />
                ))}
              </div>
              <div class="mt-3" style={{ color: messageColor }}>{message}</div>
              <button class="btn btn-success mt-3" onClick={startGame} disabled={isPlaying}>
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .ball { width:30px; height:30px; background:#f1c40f; border-radius:50%; position:absolute; bottom:30px; left:50%; box-shadow:0 0 12px #f39c12; z-index:1; transition:transform .4s ease-in-out, opacity .2s; }
        .cup { width:90px; height:110px; background:linear-gradient(180deg,#e74c3c,#c0392b); position:absolute; border-radius:6px 6px 0 0; cursor:pointer; z-index:10; border-bottom:6px solid #96281b; box-shadow:0 6px 18px rgba(0,0,0,.35); transition:transform .4s ease-in-out, bottom .4s; user-select:none; left: 50%; }
        @media (max-width:576px){ .cup{width:70px;height:90px} }
      `}</style>
    </>
  );
}

