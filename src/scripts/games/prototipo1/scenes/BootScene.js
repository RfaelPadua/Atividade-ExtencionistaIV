export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
      this.scene.start('MenuScene'); // Vai para a MenuScene
  }
}
