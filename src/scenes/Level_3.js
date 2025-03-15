class Level_3 extends Phaser.Scene {
    constructor() {
        super("level_3_Scene")
    }

    preload() {
        this.load.tilemapTiledJSON('lvl3-tilemap', './assets/Backgrounds/TilemapStuff/Level3.json')

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    }

    create() {
        this.UIon = false
        this.stopEntities = false

        // LOAD LEVEL MAP
        const map = this.add.tilemap('lvl3-tilemap')
        const tileset = map.addTilesetImage('CaveTiles', 'tilesetIMG')
        const caveLayer = map.createLayer('TheCave', tileset, 0, 0)

        //area triggers
        this.enter_cave_x = map.findObject('AreaTrigger', (obj) => obj.name === 'EnterCave').x*3
        this.fight_frog_x = map.findObject('AreaTrigger', (obj) => obj.name === 'StartFrogFight').x*3
        let level_complete = map.findObject('AreaTrigger', (obj) => obj.name === 'LevelComplete')
        this.door = this.add.image(level_complete.x*3, level_complete.y*3, 'door').setScale(3).setOrigin(0.5,0.65)

        // augment layer
        caveLayer.scale = 3
        caveLayer.setCollisionByProperty({ collides: true })

        // PLAYER
        const player_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'PlayerSpawn')
        this.player = new Guardian(this, player_spawn.x*3+100, player_spawn.y*3, 'guardian').setOrigin(0.75, 1)
        this.bombs = this.add.group()

        //place coins
        let coin_spots = []
        this.coin_group = this.add.group()
        coin_spots = map.getObjectLayer('Coins').objects
        for (let i =0; i < coin_spots.length; i++) {
            const pos = coin_spots[i]
            let coin = new Coin(this, pos.x*3, pos.y*3, 'coin')
            this.coin_group.add(coin)
        }

        //place fire pitfalls
        let fire_spots = []
        this.hazards = this.add.group()
        fire_spots = map.getObjectLayer('Pitfall').objects
        for (let i =0; i < fire_spots.length; i++) {
            const pos = fire_spots[i]
            let hazard = new Firepit(this, pos.x*3, pos.y*3, 'firepit')
            this.hazards.add(hazard)
        }

        //camera stuff
        this.cameras.main.setBounds(0,0,caveLayer.width*3, caveLayer.height*3)
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5)



        // PHYSICS
        this.physics.add.collider(this.player, caveLayer, (player, caveLayer) => {
            player.OnGround = true
        })

        this.physics.add.overlap(this.coin_group, this.player, (coin, player) => {
            this.scene.get('playScene').addScore(coin.points)
            coin.collect()
        })

        this.physics.add.overlap(this.hazards, this.player, (hazard, player) => {
            this.scene.get('playScene').damage()
            player.setVelocityY(0)
            this.player.setPosition(player_spawn.x*3, player_spawn.y)
        })

        this.physics.add.collider(this.bombs, caveLayer, (bomb, caveLayer) => {
            bomb.detonate()
        })

    }

    update() {
        if (this.player.x > this.enter_cave_x && this.UIon == false) {
            this.UIon = true
            this.scene.get('playScene').toggleUI(true)
        } else if (this.player.x <= this.enter_cave_x && this.UIon == true) {
            this.UIon = false
            this.scene.get('playScene').toggleUI(false)
        }

        // if(this.player.x >= this.fight_bunny_x && this.bee_active == false && this.bee.body != null) {
        //     this.bee_active = true
        //     this.scene.get('playScene').toggleBossUI(true)
        // } else if((this.player.x < this.bee.bound_x_min && this.bee_active)) {
        //     this.bee_active = false
        //     this.scene.get('playScene').toggleBossUI(false)
        // }

        if(this.player.x >= this.door.x) {
            this.stopEntities = true
            this.scene.get('playScene').toggleUI(false)
            this.scene.get('playScene').toggleBossUI(false)
            let winScreen =  this.add.sprite(this.cameras.main.scrollX+game.config.width/2, this.cameras.main.scrollY+game.config.height/2, 'win-screen').setScale(3).setOrigin(0.5, 0.5)
            this.startDelay = this.time.delayedCall(1500, () => {
                this.scene.start('level_3_Scene')
            });
        }

        //PLAYER FSM STEP
        if(!this.stopEntities) {
            this.GuardianFSM.step()

        }

        this.player.OnGround = false
    }

}