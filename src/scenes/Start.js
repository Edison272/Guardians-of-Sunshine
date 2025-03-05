class Start extends Phaser.Scene {
    constructor() {
        super("startScene")
    }

    preload() {

    }
    create() {
        let screen = this.add.sprite(game.config.width/2, game.config.height/2, 'start-screen-1').setScale(0.67).setOrigin(0.5, 0.5)
        screen.anims.play('start-screen')

        //set key control
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.launch('playScene')
            this.scene.start('level_1_Scene')
        }
    }



}