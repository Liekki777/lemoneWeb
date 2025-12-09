// Código del juego de trileros extraído a archivo externo
// Se asume que este script se carga con `defer` para que el DOM esté listo

let score = 0;
let isPlaying = false;
let ballPosition = 1;
let cupPositions = [0,1,2];

const ball = document.getElementById('ball');
const cups = [document.getElementById('cup0'),document.getElementById('cup1'),document.getElementById('cup2')];
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');
const btnEl = document.getElementById('playBtn');

const spacing = 140; // pixel spacing visual

function updateCupVisuals(){
  for(let i=0;i<3;i++){
    let visualPos = (cupPositions[i]-1)*spacing;
    cups[i].style.transform = `translateX(calc(${visualPos}px - 50%))`;
  }
}

// Posición inicial
updateCupVisuals();
if (ball) ball.style.transform = `translateX(calc(0px - 50%))`;

async function startGame(){
  if(isPlaying) return;
  isPlaying = true;
  if (btnEl) btnEl.disabled = true;
  if (msgEl) { msgEl.textContent = '¡Atento!'; msgEl.style.color = 'black'; }

  ballPosition = 1; cupPositions = [0,1,2]; updateCupVisuals();
  if (ball) ball.style.transform = `translateX(calc(0px - 50%))`;

  await liftCups(true);
  if (ball) ball.classList.add('visible'); // Hacer visible la pelota DESPUÉS de levantar las copas
  await delay(500); // Aumentamos un poco el delay para que se vea bien
  await liftCups(false);
  if (ball) ball.classList.remove('visible');
  await delay(400);

  if (msgEl) msgEl.textContent = 'Mezclando...';
  let shifts = 10; let speed = 400;

  for(let i=0;i<shifts;i++){
    if(i>shifts/2) speed = 250;
    let posA = Math.floor(Math.random()*3);
    let posB = Math.floor(Math.random()*3);
    while(posA===posB) posB = Math.floor(Math.random()*3);

    let cupIndexA = cupPositions.indexOf(posA);
    let cupIndexB = cupPositions.indexOf(posB);

    cupPositions[cupIndexA] = posB; cupPositions[cupIndexB] = posA;

    if(ballPosition===posA) ballPosition = posB; else if(ballPosition===posB) ballPosition = posA;

    updateCupVisuals();

    let currentBallPixelPos = (ballPosition-1)*spacing;
    if (ball) ball.style.transform = `translateX(calc(${currentBallPixelPos}px - 50%))`;

    await delay(speed);
  }

  isPlaying = false;
  if (msgEl) msgEl.textContent = '¿Dónde está la pelota?';
  if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Reiniciar'; }
}

async function guess(cupIndex){
  if(isPlaying && btnEl && btnEl.textContent !== 'Reiniciar') return;
  if(msgEl && msgEl.textContent !== '¿Dónde está la pelota?') return;

  isPlaying = true;
  let visualPosOfClickedCup = cupPositions[cupIndex];

  if (cups[cupIndex]) cups[cupIndex].style.bottom = '80px';
  await delay(300); // Pequeño retraso para mostrar la copa levantándose

  if(visualPosOfClickedCup === ballPosition){
    if (ball) ball.classList.add('visible'); // Hacer la pelota visible solo si es correcto
    if (msgEl) { msgEl.textContent = '¡Correcto! +1 Punto'; msgEl.style.color = '#198754'; }
    score++; if (scoreEl) scoreEl.textContent = score;
  } else {
    if (msgEl) { msgEl.textContent = '¡Fallaste! Puntos a 0'; msgEl.style.color = '#dc3545'; }
    score = 0; if (scoreEl) scoreEl.textContent = score;

    // Encontrar el *índice* de la copa que contiene la pelota
    let winningCupIndex = -1;
    for (let i = 0; i < cupPositions.length; i++) {
        if (cupPositions[i] === ballPosition) {
            winningCupIndex = i;
            break;
        }
    }

    // Levantar la copa correcta para revelar la pelota
    if(winningCupIndex !== -1 && cups[winningCupIndex]) {
        cups[winningCupIndex].style.bottom = '80px';
        if (ball) ball.classList.add('visible'); // Hacer la pelota visible
    }
  }

  // Después de revelar, esperar un poco antes de reiniciar para una nueva partida
  await delay(1500); // Dar tiempo para ver el resultado

  // Bajar todas las copas y ocultar la pelota para la siguiente ronda
  cups.forEach(c => { if(c) c.style.bottom = '30px'; });
  if (ball) ball.classList.remove('visible');

  if (btnEl) { btnEl.textContent = 'Jugar de nuevo'; btnEl.disabled = false; }
  isPlaying = false; // Esto debe establecerse después de todas las animaciones y retrasos
}

function liftCups(up){
  return new Promise(resolve=>{
    cups.forEach(c=>{ if(c) c.style.bottom = up ? '80px' : '30px'; });
    setTimeout(resolve,400);
  });
}

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

// Exponer funciones globalmente para que los atributos onclick en el HTML funcionen
window.startGame = startGame;
window.guess = guess;
