// Banana Invaders - script extraído
// Código adaptado desde la versión HTML original.
(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Variables del juego
  let score = 0;
  const HIGH_SCORE_KEY = 'bananaSpaceHighScore';
  let highScore = localStorage.getItem(HIGH_SCORE_KEY) || 0;
  let gameOver = false;

  const highScoreEl = document.getElementById('high-score');
  if (highScoreEl) highScoreEl.textContent = highScore;

  const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    w: 30,
    h: 10,
    color: '#00ff00',
    speed: 5,
    dx: 0
  };

  const bullets = [];
  const bulletSpeed = 7;

  const enemies = [];
  const enemyRows = 3;
  const enemyCols = 8;
  const enemyW = 30;
  const enemyH = 20;
  const enemyPadding = 15;
  const enemyOffsetTop = 30;
  const enemyOffsetLeft = 30;
  let enemyDx = 1;

  function createEnemies() {
    enemies.length = 0;
    for (let c = 0; c < enemyCols; c++) {
      for (let r = 0; r < enemyRows; r++) {
        let enemyX = (c * (enemyW + enemyPadding)) + enemyOffsetLeft;
        let enemyY = (r * (enemyH + enemyPadding)) + enemyOffsetTop;
        enemies.push({ x: enemyX, y: enemyY, status: 1 });
      }
    }
  }

  createEnemies();

  function shoot() {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10 });
  }

  function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') player.dx = player.speed;
    else if (e.key == 'Left' || e.key == 'ArrowLeft') player.dx = -player.speed;
    else if (e.key == ' ' || e.code == 'Space') shoot();
  }

  function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'Left' || e.key == 'ArrowLeft') {
      player.dx = 0;
    }
  }

  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  // --- INICIO: Añadir controles táctiles ---
  let touchShootInterval = null;

  function touchStartHandler(e) {
    e.preventDefault(); // Prevenir el scroll de la página
    const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    player.x = Math.max(0, Math.min(relativeX - player.w / 2, canvas.width - player.w));

    if (!touchShootInterval) {
      touchShootInterval = setInterval(shoot, 300); // Dispara cada 300ms
    }
  }

  function touchMoveHandler(e) {
    e.preventDefault();
    const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    player.x = Math.max(0, Math.min(relativeX - player.w / 2, canvas.width - player.w));
  }

  function touchEndHandler() {
    clearInterval(touchShootInterval);
    touchShootInterval = null;
  }

  canvas.addEventListener('touchstart', touchStartHandler, { passive: false });
  canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
  canvas.addEventListener('touchend', touchEndHandler);
  canvas.addEventListener('touchcancel', touchEndHandler);
  // --- FIN: Añadir controles táctiles ---

  function draw() {
    if (gameOver) {
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.font = '15px Arial';

      if (score > highScore) {
        highScore = score;
        localStorage.setItem(HIGH_SCORE_KEY, highScore);
        if (highScoreEl) highScoreEl.textContent = highScore;
      }

      ctx.fillText('Pulsa Reiniciar para jugar de nuevo', canvas.width / 2, canvas.height / 2 + 30);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

    // Balas
    ctx.fillStyle = 'yellow';
    bullets.forEach((b, index) => {
      ctx.fillRect(b.x, b.y, b.w, b.h);
      b.y -= bulletSpeed;
      if (b.y < 0) bullets.splice(index, 1);
    });

    // Enemigos
    let edgeTouched = false;
    enemies.forEach((e) => {
      if (e.status == 1) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(e.x, e.y, enemyW, enemyH);
        e.x += enemyDx;
        if (e.x + enemyW > canvas.width || e.x < 0) edgeTouched = true;

        bullets.forEach((b, bIndex) => {
          if (b.x > e.x && b.x < e.x + enemyW && b.y > e.y && b.y < e.y + enemyH) {
            e.status = 0;
            bullets.splice(bIndex, 1);
            score++;
          }
        });

        if (e.y + enemyH >= player.y) gameOver = true;
      }
    });

    if (edgeTouched) { enemyDx = -enemyDx; enemies.forEach(e => e.y += 10); }

    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.fillText('Puntos: ' + score, 8, 20);

    requestAnimationFrame(draw);
  }

  draw();

  // Reiniciar juego
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) restartBtn.addEventListener('click', () => {
    score = 0;
    gameOver = false;
    player.x = canvas.width / 2 - 15;
    bullets.length = 0;
    createEnemies();
    // No reiniciamos el high score, solo lo mostramos
    if (highScoreEl) highScoreEl.textContent = highScore;
    draw();
  });
})();
