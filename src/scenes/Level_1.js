class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1_Scene")
    }

    preload() {
        //LOAD LEVEL STUFF
        this.load.image('tilesetIMG', './assets/Backgrounds/TilemapStuff/CaveTiles.png')
        this.load.tilemapTiledJSON('lvl1-tilemap', './assets/Backgrounds/TilemapStuff/Level1.json')
    }

    create() {
        this.UIon = false

        console.log('nothin much')

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // LOAD LEVEL MAP
        const map = this.add.tilemap('lvl1-tilemap')
        const tileset = map.addTilesetImage('CaveTiles', 'tilesetIMG')
        const caveLayer = map.createLayer('TheCave', tileset, 0, 0)

        //area triggers
        this.enter_cave_x = map.findObject('AreaTrigger', (obj) => obj.name === 'EnterCave').x*3
        this.fight_bee = map.findObject('AreaTrigger', (obj) => obj.name === 'StartBeeFight').x*3
        this.level_complete = map.findObject('AreaTrigger', (obj) => obj.name === 'LevelComplete').x*3

        // augment layer
        caveLayer.scale = 3
        caveLayer.setCollisionByProperty({ collides: true })

        // PLAYER
        const player_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'PlayerSpawn')
        this.player = new Guardian(this, player_spawn.x*3, player_spawn.y*3, 'guardian').setOrigin(0.5, 0.5)

        //bee
        this.bee

        //camera stuff
        this.cameras.main.setBounds(0,0,caveLayer.width*3, caveLayer.height*3)
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5)


        this.physics.add.collider(this.player, caveLayer, (player, caveLayer) => {
            player.OnGround = true
        })

        this.scene.bringToTop('playScene')



    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.get('playScene').damage()
        }


        if (this.player.x > this.enter_cave_x && this.UIon == false) {
            this.UIon = true
            this.scene.get('playScene').toggleUI(true)
        } else if (this.player.x <= this.enter_cave_x && this.UIon == true) {
            this.UIon = false
            this.scene.get('playScene').toggleUI(false)
        }

        if(this.player.x > this.fight_bee && this.bee == null) {
            console.log('BZZZZZ')
        }

        if(this.player.x >= this.level_complete) {
            console.log('you win')
        }

        //PLAYER FSM STEP
        this.GuardianFSM.step()
        this.player.OnGround = false
    }
}