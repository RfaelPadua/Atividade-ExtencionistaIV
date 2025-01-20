const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

if (!ctx) {
  console.error("Failed to get canvas context");
}

// Define the size of the canvas
canvas.width = 800;
canvas.height = 400;

// Player configuration
const player = {
  x: 50,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: "blue",
  dy: 0,
  dx: 0,
  gravity: 0.5,
  jumpPower: -20,
  isJumping: false,
  speed: 5,
};

// Syllable configuration
const syllables = [];
const syllableList = [
  "Ca",
  "Va",
  "Ba",
  "Am",
  "Ar",
  "Al",
  "Uv",
  "U",
  "Ur",
  "Um",
  "ra",
  "ma",
  "lo",
  "bo",
  "pa",
  "ju",
  "so",
  "ta",
  "sa",
  "no",
  "be",
  "ro",
  "va",
  "ne",
  "ca",
  "le",
  "go",
  "ri",
  "do",
  "xo",
  "so",
  "te",
  "ra",
  "ba",
  "na",
  "ro",
  "la",
  "to",
  "nha",
];

const validWords = [
  "cara",
  "cama",
  "calo",
  "cabo",
  "capa",
  "caju",
  "cama",
  "caso",
  "carta",
  "casa",
  "cano",
  "cabe",
  "caro",
  "cava",
  "carne",
  "vaca",
  "vale",
  "vago",
  "vara",
  "vaza",
  "vaso",
  "Banco",
  "Baile",
  "Barco",
  "Bala",
  "Baco",
  "Baixo",
  "Bando",
  "Baque",
  "Barão",
  "Balde",
  "Bando",
  "Banca",
  "Bardo",
  "Bate",
  "Batalha",
  "Amor",
  "Amigo",
  "Árvore",
  "Arroz",
  "Arco",
  "Alvo",
  "Alma",
  "Andar",
  "Uva",
  "Unha",
  "Urso",
  "Um",
  "Uivo",
  "Ultima",
  "Baleia",
  "Arte",
];

// Variables for score and collected syllables
let collectedSyllables = [];
let score = 0;
let lastSpawnTime = 0;
let spawnInterval = 2000;

// Draw the player on the canvas
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Generate weighted random syllables
function getWeightedRandomSyllable() {
  const totalWeight = syllableList.length;
  let random = Math.random() * totalWeight;
  return syllableList[Math.floor(random)];
}

function spawnSyllable() {
  const minY = canvas.height - player.height - 150;
  const maxY = canvas.height - player.height - 100;

  // Logic for spawning syllables based on the collected syllables
  let syllablePool = [];

  // If the player has 0 syllables, only the first syllables of words appear
  if (collectedSyllables.length === 0) {
    syllablePool = syllableList.filter((syllable) =>
      validWords.some((word) => word.startsWith(syllable))
    );
  }
  // If the player has 1 syllable, only the second syllables of words appear
  else if (collectedSyllables.length === 1) {
    syllablePool = syllableList.filter((syllable) =>
      validWords.some(
        (word) =>
          word.includes(collectedSyllables[0]) &&
          word.split(collectedSyllables[0])[1]?.startsWith(syllable)
      )
    );
  }
  // If the player has more than 1 syllable, allow all syllables, with a higher chance for valid completions
  else {
    syllablePool = syllableList;
  }

  // Increase the weight of syllables that complete valid words
  const syllable = {
    x: canvas.width,
    y: Math.random() * (maxY - minY) + minY,
    width: 70,
    height: 70,
    text: getWeightedRandomSyllable(),
  };

  // If the syllable is likely to complete a valid word, increase its chances of appearing
  if (validWords.some((word) => word === collectedSyllables.join("") + syllable.text)) {
    syllables.push(syllable);
  }
}

// Draw syllables on the canvas
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

// Update syllable positions (increased horizontal speed)
function updateSyllables() {
  syllables.forEach((syllable, index) => {
    syllable.x -= 2; // Increase the value to make syllables move faster
    if (syllable.x + syllable.width < 0) {
      syllables.splice(index, 1);
    }
  });
}

// Check for collisions between the player and syllables
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

// Check if the collected syllables form a valid word
function checkWord() {
  const word = collectedSyllables.join("");
  if (validWords.includes(word)) {
    score += 10;
    collectedSyllables = [];
  }
}

// Draw the score and collected syllables
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Collected: ${collectedSyllables.join("")}`, 10, 40);
}

// Update the player's position (for jumping and horizontal movement)
function updatePlayer() {
  player.y += player.dy;
  player.dy += player.gravity;
  player.x += player.dx;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.isJumping = false;
  }
}

// Main game loop
function gameLoop(timestamp) {
  if (timestamp - lastSpawnTime > spawnInterval) {
    spawnSyllable();
    lastSpawnTime = timestamp;
  }
  updatePlayer();
  updateSyllables();
  checkCollision();
  render();
  requestAnimationFrame(gameLoop);
}

// Render the game elements on the canvas
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawSyllables();
  drawHUD();
}

// Event listener for player input (handling horizontal movement)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && !player.isJumping) {
    player.dy = player.jumpPower;
    player.isJumping = true;
  } else if (e.key === "ArrowDown") {
    collectedSyllables.pop();
  } else if (e.key === "ArrowRight") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft") {
    player.dx = -player.speed;
  }
});

// Event listener to stop horizontal movement when the key is released
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
});

// Start the game loop after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(gameLoop);
});
