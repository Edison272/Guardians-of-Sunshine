class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1_Scene")
    }

    create() {
        console.log('nothin much')

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.get('playScene').damage()
        }
    }
}