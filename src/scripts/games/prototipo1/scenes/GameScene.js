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

  }

  preload() {
      // Carregar recursos aqui, se necessário
  }

  create() {
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

      // Criar o player
      this.player = this.add.graphics();
      this.player.fillStyle(0x0000ff, 1);
      this.player.fillRect(0, 0, 50, 50);
      this.physics.add.existing(this.player);
      this.player.body.setCollideWorldBounds(true);

      this.player.x = 200;
      this.player.y = 700;

      // Criar o grupo de asteroides
      this.asteroids = this.physics.add.group();

      // Criar texto de vida
      this.lifeText = this.add.text(300, 16, 'Life: 3', { fontSize: '32px', fill: '#ffffff' });
      this.lifeText.x = this.screenWidth - (this.lifeText.width + 16);

      // Criar texto de pontuação
      this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

      // Campo de entrada de texto
      this.inputField = this.add.text(225, 790 - this.scoreText.height, '', { fontSize: '32px', fill: '#FFF' });
      this.inputField.setOrigin(0.5, 0);

      // Criar evento de teclado
      this.input.keyboard.on('keydown', this.handleInput, this);

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
              asteroid.text.destroy();
              asteroid.destroy();
              this.score += 10;
              this.scoreText.setText('Score: ' + this.score);
              this.inputText = '';
              this.inputField.setText(this.inputText);
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

      const asteroid = this.add.graphics();
      asteroid.fillStyle(0xff0000, 1);
      this.physics.add.existing(asteroid);
      asteroid.fillCircle(0, 0, 20);
      asteroid.x = x;
      asteroid.y = -50;

      this.physics.add.existing(asteroid);
      asteroid.body.setCircle(20);
      asteroid.body.setVelocity(0, 100);
      asteroid.result = result;

      const text = this.add.text(x, 0, `${num1} + ${num2}`, { fontSize: '20px', fill: '#ffffff' });
      asteroid.text = text;

      this.asteroids.add(asteroid);
  }
}
