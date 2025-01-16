export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    console.log('MenuScene');

    this.load.spritesheet('teste', 'assets/teste.png', { frameWidth: 130, frameHeight: 130 });
    this.load.spritesheet('astronautinha', 'assets/Astronautinha.png', { frameWidth: 64, frameHeight: 64 });
    
  }

  create() {
    const { width, height } = this.sys.game.config; // Obtenha as dimensões do jogo
    this.add.image(0, 0, 'fundo').setOrigin(0).setDisplaySize(width, height); // Ajuste a imagem ao espaço do jogo
    // Criar a animação a partir da spritesheet
    this.anims.create({
      key: 'astronautinha_anim',
      frames: this.anims.generateFrameNumbers('astronautinha', { start: 0, end: 299 }),
      frameRate: 30,
      repeat: -1
    });

    // Adicionar o sprite e reproduzir a animação
    const astronautinha = this.add.sprite(width/2, 0, 'astronautinha')
    astronautinha.play('astronautinha_anim');

    //
    this.tweens.add({
      targets: astronautinha,
      y: height + 64, // Move para fora da tela, abaixo
      duration: 10000, // Duração da animação em milissegundos
      ease: 'Linear',
      repeat: 0, // Repete indefinidamente
      yoyo: false // Não volta para a posição inicial
    });

    this.add.image(0, 0, 'simbolos').setOrigin(0).setDisplaySize(width, height); // Ajuste a imagem ao espaço do jogo
    this.add.image(0, 0, 'titulo').setOrigin(0).setDisplaySize(width, height); // Ajuste a imagem ao espaço do jogo
    
    
    const botaoJogar = this.add.image(0, 0, 'botao_jogar').setOrigin(0).setDisplaySize(width, height);

    botaoJogar.setInteractive({ useHandCursor: true, pixelPerfect: true });
    botaoJogar.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}