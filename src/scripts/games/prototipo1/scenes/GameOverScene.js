export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const { width, height } = this.sys.game.config; // Obtenha as dimensões do jogo
    this.add.image(0, 0, 'fundo_menu').setOrigin(0).setDisplaySize(width, height); // Ajuste a imagem ao espaço do jogo
    this.add.image(width / 2, height / 2, 'gameover').setDisplaySize(width, height); // Adicione a imagem de game over ao centro do jogo
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene'); // Volta para a MenuScene
    });
  }
}
