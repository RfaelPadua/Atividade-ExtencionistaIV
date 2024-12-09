export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    this.add.text(230, 350, 'Game Over Scene\nClique para voltar ao menu', { fontSize: '24px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene'); // Volta para a MenuScene
    });
  }
}
