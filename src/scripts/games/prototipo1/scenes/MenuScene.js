export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(230, 350, 'Menu Scene\nClique para começar', { fontSize: '24px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene'); // Vai para a GameScene
    });
  }
}
