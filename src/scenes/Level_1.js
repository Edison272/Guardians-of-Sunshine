class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1_Scene")
    }

    create() {
        console.log('nothin much')

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // PLAYER
        this.player = new Guardian(this, game.config.width/2, 0, 'guardian').setOrigin(0.5, 0)
    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.get('playScene').damage()
        }

        //PLAYER FSM STEP
        this.GuardianFSM.step()
    }
}