export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player;
    }

    preload() {
        // Carregar recursos aqui, se necessário
    }

    create() {
        // Inicializar variáveis
        this.player = this.add.graphics();
        this.player.fillStyle(0x0000ff, 1);
        this.player.fillRect(0, 0, 50, 50);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.x = 200;
        this.player.y = 700;

    }

    update(){

    }
    
}