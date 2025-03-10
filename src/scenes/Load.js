class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        // START SCENE
        this.load.image('start-screen-1', './assets/Backgrounds/StartScreen-1.png')
        this.load.image('start-screen-2', './assets/Backgrounds/StartScreen-2.png')


        //GUARDIAN (PLAYER)
        this.load.spritesheet('guardian', './assets/Sprites/Game/GuardianSpriteSheet.png', {
            frameWidth: 24,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 23
        })

        //PLAY SCENE
        this.load.image('ui-bar', './assets/Sprites/UI/UIbar.png')
        this.load.image('life-counter', './assets/Sprites/UI/LifeCounter.png')

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

        // GUARDIAN (PLAYER)
        this.anims.create({
            key: 'guardian-dance',
            frameRate: 6,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('guardian', {frames: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 0]})
        })

        this.anims.create({
            key: 'guardian-walk',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('guardian', {
                start: 4,
                end: 5
            })
        })

        this.anims.create({
            key: 'guardian-jump',
            frameRate: 25,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('guardian', {frames: [4, 17, 18, 19, 19, 19, 18, 17, 4]})
        })

        this.anims.create({
            key: 'guardian-punch',
            frameRate: 16,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('guardian', {frames: [6, 20, 21, 9, 9]})
        })

        this.anims.create({
            key: 'guardian-final-hit',
            frameRate: 6,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('guardian', {frames: [7, 23, 24, 8]})
        })

        this.anims.create({
            key: 'guardian-bomb',
            frameRate: 16,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('guardian', {frames: [7, 12, 23, 8]})
        })

        // START THE GAME
        this.scene.start('startScene') 
    }
}

