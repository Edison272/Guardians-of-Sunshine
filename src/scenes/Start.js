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
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

        this.sequence = 0
        this.intro_screen = this.add.sprite(game.config.width/2, game.config.height/2, 'instructions').setScale(1.2).setOrigin(0.5, 0.5)
        this.intro_screen.visible = false

        this.credit_screen = this.add.sprite(game.config.width/2, game.config.height/2, 'credits').setScale(1.1).setOrigin(0.5, 0.5)
        this.credit_screen.visible = false

        this.intro = this.sound.add('Intro', {volume: 0.3})
        this.intro.play()
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            if(this.sequence == 0) {
                this.intro_screen.visible = true
                this.sequence = 1
                console.log(this.sequence)
            }else if (this.sequence == 1) {
                this.intro_screen.destroy()
                this.sequence = 2
                this.level_started = true
                this.intro.stop()
                this.sound.play('LevelStart')
                let level_screen = this.add.sprite(game.config.width/2, game.config.height/2, 'level-1').setScale(4).setOrigin(0.5, 0.5)
                this.startDelay = this.time.delayedCall(1500, () => {
                    
                    this.scene.launch('playScene')
                    this.scene.start('level_1_Scene')
                });

            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            if(this.sequence == 0) {
                this.credit_screen.visible = true
                this.sequence = -1
            } else if(this.sequence == -1) {
                this.credit_screen.visible = false
                this.sequence = 0
            }
        }
    }

}