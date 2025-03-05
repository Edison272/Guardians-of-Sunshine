class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        // START SCENE
        this.load.image('start-screen-1', './assets/Backgrounds/StartScreen-1.png')
        this.load.image('start-screen-2', './assets/Backgrounds/StartScreen-2.png')


        // SET GAME CONTROLS
        // keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        // keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        // keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        // keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        // keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    }

    create() {
        // START SCENE
        this.anims.create({
            key: 'start-screen',
            frames: [
                { key: 'start-screen-1' },
                { key: 'start-screen-2' }
            ],
            frameRate: 2,
            repeat: -1
        });

        // START THE GAME
        this.scene.start('startScene') 
    }
}

