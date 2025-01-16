export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        console.log('PreloadScene');
        const { width, height } = this.scale;


        this.load.on('progress', (value) => {
            const loadingImage = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'loading').setOrigin(0.5);
            loadingImage.setScale(0.15);
            loadingImage.play('loading');
        });

        this.load.on('complete', (value) => {
            console.log('complete', value);
            this.scene.start('MenuScene');


        });

        this.load.image('fundo', 'assets/Fundo.png');
        this.load.image('simbolos', 'assets/Simbolos.png');
        this.load.image('titulo', 'assets/Titulo.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('inimigo', 'assets/inimigo.png');
        this.load.image('botao_jogar', 'assets/Botao_Jogar1.png');


    }

    create() {

    }
}