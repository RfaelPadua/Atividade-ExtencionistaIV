// src/GameScene.js
export default class GameScene extends Phaser.Scene {
  constructor() {
      super('GameScene');
      this.life;
      this.player;
      this.asteroids;
      this.lifeText;
      this.scoreText;
      this.inputText;
      this.inputField;
      this.score;
      this.screenWidth;
      this.screenHeight;
      this.tiro;

  }

  preload() {
      // Carregar recursos aqui, se necessário
  }

  create() {
    const { width, height } = this.sys.game.config; // Obtenha as dimensões do jogo
    this.add.image(0, 0, 'fundo').setOrigin(0).setDisplaySize(width, height); // Ajuste a imagem ao espaço do jogo
    this.screenWidth = this.sys.game.config.width;
    this.screenHeight = this.sys.game.config.height;
    // Inicializar variáveis
    this.life = 3;
    this.player = null;
    this.asteroids = null;
    this.lifeText = null;
    this.scoreText = null;
    this.inputText = '';
    this.inputField = null;
    this.score = 0;

    // Criar o player fora da tela
    this.player = this.physics.add.sprite(225, height + 100, 'player');
    this.player.setDisplaySize(50, 55);
    this.player.setOrigin(0.5, 0.5);
    this.player.body.setCollideWorldBounds(false);
    this.player.setRotation(Phaser.Math.DegToRad(-90));

    // Animação para mover o player para a posição desejada
    this.tweens.add({
        targets: this.player,
        y: 600,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => {
            // Iniciar o jogo após a animação
            this.startGame();
        }
    });

    // Criar o grupo de asteroides
    this.asteroids = this.physics.add.group();

    // Criar texto de vida
    this.lifeText = this.add.text(300, 16, 'Life: 3', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Exo_Space' });
    this.lifeText.x = this.screenWidth - (this.lifeText.width + 16);

    // Criar texto de pontuação
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Exo_Space' });

    // Campo de entrada de texto
    this.inputField = this.add.text(225, 790 - this.scoreText.height, '', { fontSize: '32px', fill: '#FFF', fontFamily: 'Exo_Space' });
    this.inputField.setOrigin(0.5, 0);

    // Criar evento de teclado
    this.input.keyboard.on('keydown', this.handleInput, this);
}

startGame() {
    // Criar evento de spawn de asteroides
    this.time.addEvent({
        delay: 2000,
        callback: this.spawnAsteroid,
        callbackScope: this,
        loop: true
    });

    // Evento de colisão entre player e asteroides
    this.physics.add.collider(this.player, this.asteroids, this.handleCollision, null, this);
}

  update() {

    this.asteroids.children.iterate(function (asteroid) {
        if (asteroid) {
            const direction = new Phaser.Math.Vector2(this.player.x - asteroid.x, this.player.y - asteroid.y);
            direction.normalize();
            const speed = 1 / 2;
            asteroid.x += direction.x * speed;
            asteroid.y += direction.y * speed;

            asteroid.text.x = asteroid.x - asteroid.text.width / 2;
            asteroid.text.y = asteroid.y + 20;
        }
    }, this);

    this.checkAnswer();
    this.checkGameOver();

    if (this.life <= 0) {
        this.scene.start('GameOverScene');
    }

}

  checkAnswer() {
    this.asteroids.children.iterate(function (asteroid) {
        if (asteroid && asteroid.result === parseInt(this.inputText)) {

        //Rotacionar o player
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, asteroid.x, asteroid.y);
        this.player.rotation = angle;

        //Criar o tiro


        asteroid.text.destroy();
        asteroid.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        this.inputText = '';
        this.inputField.setText(this.inputText);

        return true;
        }
    }, this);
  }



  checkGameOver() {
      if (this.life <= 0) {
          this.scene.start('GameOverScene');
      }
  }

  handleCollision(player, asteroid) {
      this.life -= 1;
      this.lifeText.setText('Life: ' + this.life);
      asteroid.text.destroy();
      asteroid.destroy();
  }

  handleInput(event) {
      if (event.key === 'Enter') {
          this.inputText = '';
          this.inputField.setText(this.inputText);
      } else if (event.key === 'Backspace') {
          this.inputText = this.inputText.slice(0, -1);
          this.inputField.setText(this.inputText);
      } else if (event.key.match(/[0-9]/)) {
          this.inputText += event.key;
          this.inputField.setText(this.inputText);
      }
  }

  spawnAsteroid() {
    const x = Phaser.Math.Between(this.screenWidth * 0.1, this.screenWidth * 0.9);
    const num1 = Phaser.Math.Between(1, 10);
    const num2 = Phaser.Math.Between(1, 10);
    const result = num1 + num2;
  
    const asteroid = this.physics.add.sprite(x, -50, 'inimigo'); // Crie o sprite do asteroide
    asteroid.setDisplaySize(50, 55); // Defina o tamanho do asteroide
    asteroid.setOrigin(0.5, 0.5); // Defina a origem do asteroide

    asteroid.setVelocity(0, 100); // Defina a velocidade do asteroide
    asteroid.result = result;

  
    const text = this.add.text(x, 0, `${num1} + ${num2}`, { fontSize: '20px', fill: '#ffffff', fontFamily: 'Exo_Space' });
    asteroid.text = text;
  
    this.asteroids.add(asteroid);
  }
}
