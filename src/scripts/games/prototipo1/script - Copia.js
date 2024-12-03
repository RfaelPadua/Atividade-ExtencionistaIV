const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define o tamanho do canvas em relação à tela
canvas.width = 400;
canvas.height = 600;

// Configuração do jogador
const player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  color: "blue",
};
let life = 3;

// Configuração dos inimigos
const enemies = [];
let spawnInterval = 2000; // Intervalo de spawn em ms
let lastSpawnTime = 0;

// Configuração de entrada de resposta
let currentAnswer = "";
let score = 0;

// Função para desenhar o jogador
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y); // Vértice superior
  ctx.lineTo(player.x - player.width / 2, player.y + player.height); // Vértice inferior esquerdo
  ctx.lineTo(player.x + player.width / 2, player.y + player.height); // Vértice inferior direito
  ctx.closePath(); // Fecha o triângulo
  ctx.fill(); // Preenche o triângulo
}

// Função para gerar inimigos
function spawnEnemy() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const result = num1 + num2;

  const enemy = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    color: "red",
    text: `${num1} + ${num2}`,
    result: result,
  };

  enemies.push(enemy);
}

// Função para desenhar inimigos
function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillStyle = "white";
    ctx.fillText(enemy.text, enemy.x + 10, enemy.y + 30);
  });
}

// Função para mover inimigos
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    // Calcula a direção para o jogador
    const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2); // Direção horizontal
    const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2); // Direção vertical
    const distance = Math.sqrt(dx * dx + dy * dy); // Distância entre inimigo e jogador

    // Normaliza o vetor de direção e aplica a velocidade
    const speed = 0.5; // Ajuste para controlar a velocidade do inimigo
    enemy.x += (dx / distance) * speed;
    enemy.y += (dy / distance) * speed;

    // Remover inimigos que saíram da tela
    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawEnemies();

  // Exibir pontuação
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Exibir vida
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Life: ${life}`, canvas.width - 10, 20);
  
}

function intro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Press Enter to start the game", canvas.width / 2, canvas.height / 2);
}

// main

function main() {
  while(1){
    if (life > 0) {
      //intro
      intro();
      //game
      render();
      updateEnemies();
      //game over
    }
  }

  //intro

  //game

  //game over
}


main();