const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

if (!ctx) {
  console.error("Failed to get canvas context");
}

// Define o tamanho do canvas
canvas.width = 800;
canvas.height = 400;

// Configuração do jogador
const player = {
  x: 50,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: "blue",
  dy: 0,
  gravity: 0.5,
  jumpPower: -15, // Increase jump power
  isJumping: false,
};

// Configuração das sílabas
const syllables = [];
const syllableList = [
  "ca",
  "ma",
  "sa",
  "ro",
  "a",
  "mo",
  "re",
  "lo",
  "mi",
  "go",
  "a",
  "ma",
  "ri",
  "ge",
  "lo",
];

const syllableFrequency = {
  ca: 10,
  ma: 10,
  sa: 10,
  ro: 8,
  a: 15,
  mo: 8,
  re: 8,
  lo: 8,
  mi: 5,
  go: 5,
  ri: 5,
  ge: 5,
};

let collectedSyllables = [];
let score = 0;
let lastSpawnTime = 0;
let spawnInterval = 2000; // Increase spawn interval to slow down the game

// Função para desenhar o jogador
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Função para gerar sílabas
function getWeightedRandomSyllable() {
  const totalWeight = Object.values(syllableFrequency).reduce((acc, weight) => acc + weight, 0);
  let random = Math.random() * totalWeight;
  for (const [syllable, weight] of Object.entries(syllableFrequency)) {
    if (random < weight) {
      return syllable;
    }
    random -= weight;
  }
}

function spawnSyllable() {
  const minY = canvas.height - player.height - 150; // Increase minimum height above the ground
  const maxY = canvas.height - player.height - 100; // Increase maximum height above the ground
  const syllable = {
    x: canvas.width,
    y: Math.random() * (maxY - minY) + minY, // Ensure syllables appear in the catchable range
    width: 70, // Increase syllable size
    height: 70, // Increase syllable size
    text: getWeightedRandomSyllable(),
  };
  syllables.push(syllable);
}

// Função para desenhar sílabas
function drawSyllables() {
  syllables.forEach((syllable) => {
    ctx.fillStyle = "white";
    ctx.fillRect(syllable.x, syllable.y, syllable.width, syllable.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      syllable.text,
      syllable.x + syllable.width / 2,
      syllable.y + syllable.height / 2 + 5
    );
  });
}

// Função para atualizar a posição das sílabas
function updateSyllables() {
  syllables.forEach((syllable, index) => {
    syllable.x -= 0.5; // Slow down syllable speed
    if (syllable.x + syllable.width < 0) {
      syllables.splice(index, 1);
    }
  });
}

// Função para detectar colisão entre jogador e sílabas
function checkCollision() {
  syllables.forEach((syllable, index) => {
    if (
      player.x < syllable.x + syllable.width &&
      player.x + player.width > syllable.x &&
      player.y < syllable.y + syllable.height &&
      player.y + player.height > syllable.y
    ) {
      collectedSyllables.push(syllable.text);
      syllables.splice(index, 1);
      checkWord();
    }
  });
}

// Função para verificar se uma palavra foi formada
function checkWord() {
  const word = collectedSyllables.join("");
  const validWords = [
    "cama",
    "casa",
    "caro",
    "carro",
    "amor",
    "amarelo",
    "amigo",
    "roma",
    "mora",
    "rosa",
    "soma",
    "mago",
    "goma",
    "mar",
    "ramo",
  ];
  if (validWords.includes(word)) {
    score += 10;
    collectedSyllables = [];
  }
}

// Função para desenhar a pontuação e sílabas coletadas
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Collected: ${collectedSyllables.join("")}`, 10, 40);
}

// Função principal de renderização
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawSyllables();
  drawHUD();
}

// Função para atualizar a posição do jogador
function updatePlayer() {
  player.y += player.dy;
  player.dy += player.gravity;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.isJumping = false;
  }
}

// Loop principal do jogo
function gameLoop(timestamp) {
  console.log("Game loop running at timestamp:", timestamp);
  if (timestamp - lastSpawnTime > spawnInterval) {
    console.log("Spawning new syllable");
    spawnSyllable();
    lastSpawnTime = timestamp;
  }
  updatePlayer();
  updateSyllables();
  checkCollision();
  render();
  requestAnimationFrame(gameLoop);
}

// Detectar entrada do jogador
document.addEventListener("keydown", (e) => {
  console.log("Key pressed:", e.key);
  if (e.key === "ArrowUp" && !player.isJumping) {
    player.dy = player.jumpPower;
    player.isJumping = true;
  } else if (e.key === "ArrowDown") {
    collectedSyllables.pop();
  }
});

// Iniciar o loop do jogo após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  requestAnimationFrame(gameLoop); // Change this line
});
