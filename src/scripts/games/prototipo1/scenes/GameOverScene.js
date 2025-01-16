export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const { width, height } = this.sys.game.config; // Obtenha as dimensões do jogo
    this.add.image(0, 0, 'fundo').setOrigin(0).setDisplaySize(width, height); // Ajuste a imagem ao espaço do jogo
    this.add.text(230, 350, 'Game Over\nClique para voltar ao menu', { fontSize: '24px', fill: '#ffffff', align: 'center', fontFamily: 'Exo_Space' }).setOrigin(0.5);
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene'); // Volta para a MenuScene
    });
  }
}
