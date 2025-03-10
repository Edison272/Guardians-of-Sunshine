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

        //BOUNCING BEE
        this.load.spritesheet('bee', './assets/Sprites/Game/BouncingBee.png', {
            frameWidth: 57,
            frameHeight: 43,
            startFrame: 0,
            endFrame: 11
        })

        this.load.image('stinger', './assets/Sprites/Game/BeeStinger.png')

        //COIN
        this.load.spritesheet('coin', './assets/Sprites/Game/CoinSpriteSheet.png', {
            frameWidth: 9,
            frameHeight: 17,
            startFrame: 0,
            endFrame: 7
        })

        //FIREPIT
        this.load.image('firepit', './assets/Sprites/Game/Firepit.png')

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
            frames: this.anims.generateFrameNumbers('guardian', {frames: [7, 22, 23, 8]})
        })

        this.anims.create({
            key: 'guardian-bomb',
            frameRate: 16,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('guardian', {frames: [7, 12, 23, 8]})
        })

        //BEE
        this.anims.create({
            key: 'bee-fly',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('bee', {
                start: 8,
                end: 9
            })
        })

        this.anims.create({
            key: 'bee-charge',
            frameRate: 15,
            repeat: 5,
            frames: this.anims.generateFrameNumbers('bee', {
                frames: [0, 1, 2]
            })
        })

        this.anims.create({
            key: 'bee-fire',
            frameRate: 14,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('bee', {
                frames: [3, 1, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
            })
        })

        //COIN
        this.anims.create({
            key: 'coin-idle',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('coin', {
                frames: [0, 1, 2, 1]
            })
        })

        this.anims.create({
            key: 'coin-collect',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('coin', {
                frames: [3, 4, 5, 6, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7, 5, 6, 7]
            })
        })


        // START THE GAME
        this.scene.start('startScene') 
    }
}

