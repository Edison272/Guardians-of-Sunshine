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
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)


        // LOAD LEVEL MAP
        const map = this.add.tilemap('lvl1-tilemap')
        const tileset = map.addTilesetImage('CaveTiles', 'tilesetIMG')
        const caveLayer = map.createLayer('TheCave', tileset, 0, 0)

        //area triggers
        this.enter_cave_x = map.findObject('AreaTrigger', (obj) => obj.name === 'EnterCave').x*3
        this.fight_bee_x = map.findObject('AreaTrigger', (obj) => obj.name === 'StartBeeFight').x*3
        let level_complete = map.findObject('AreaTrigger', (obj) => obj.name === 'LevelComplete')
        this.door = this.add.image(level_complete.x*3, level_complete.y*3, 'door').setScale(3).setOrigin(0.5,1)

        // augment layer
        caveLayer.scale = 3
        caveLayer.setCollisionByProperty({ collides: true })

        // PLAYER
        const player_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'PlayerSpawn')
        this.player = new Guardian(this, player_spawn.x*3+100, player_spawn.y*3, 'guardian').setOrigin(0.75, 1)

        //bee
        const bee_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'BouncyBeeSpawn')
        this.bee = new Bee(this, bee_spawn.x*3+300, bee_spawn.y*3-30, 'bee')
        this.bee.active_x = bee_spawn.x*3
        this.bee.bound_x_min = this.fight_bee_x-100
        this.bee.bound_x_max = bee_spawn.x*3+300
        this.bee_active = false
        
        //bee stingers
        this.stingers = this.add.group()

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

        let sun_srpite = this.add.sprite(200, 100, 'sun').setScale(3.5)
        sun_srpite.anims.play('sun-idle')

        //camera stuff
        this.cameras.main.setBounds(0,0,caveLayer.width*3, caveLayer.height*3)
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5)


        //PHYSICS

        this.physics.add.collider(this.player, caveLayer, (player, caveLayer) => {
            player.OnGround = true
        })

        this.physics.add.overlap(this.player, this.bee, (player, bee) => {
            if(player.isAttacking) {
                bee.damage()
                this.scene.get('playScene').updateBossHealth(this.bee.health/this.bee.max_health)
                player.isAttacking = false
                if(bee.health == 0) {
                    player.finalHit = true
                    this.scene.get('playScene').addScore(bee.points)
                    this.scene.get('playScene').toggleBossUI(false)
                    this.bee_active = false
                    
                    bee.defeated()
                }
            }
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

        this.physics.add.overlap(this.stingers, this.player, (stinger, player) => {
            if(stinger.flipY) {
                this.scene.get('playScene').damage()
                player.setVelocityY(0)
                player.setPosition(player_spawn.x*3, player_spawn.y)
            }
        })

        this.scene.bringToTop('playScene')



    }

    shootStingers() {
        for(let i = -1; i < 2; i++) {
            var stinger = this.physics.add.sprite(this.bee.x+i*30, this.bee.y-i*10, 'stinger').setScale(3)
            stinger.body.setVelocityY(-400)
            this.stingers.add(stinger)
        }
    }

    throwBomb() {
        let bomb = new Bomb(this, this.player.x-this.player.width/1.35, this.player.y-70, 'bomb')
        bomb.throw(!this.player.flipX)
    }

    gameover() {
        let lose_screen = this.add.sprite(game.config.width/2, game.config.height/2, 'lose-screen').setScale(4).setOrigin(0.5, 0.5)
    }


    update() {
        if (this.player.x > this.enter_cave_x && this.UIon == false) {
            this.UIon = true
            this.scene.get('playScene').toggleUI(true)
        } else if (this.player.x <= this.enter_cave_x && this.UIon == true) {
            this.UIon = false
            this.scene.get('playScene').toggleUI(false)
        }

        if(this.player.x >= this.fight_bee_x && this.bee_active == false && this.bee.body != null) {
            this.bee_active = true
            this.scene.get('playScene').toggleBossUI(true)
        } else if((this.player.x < this.bee.bound_x_min && this.bee_active)) {
            this.bee_active = false
            this.scene.get('playScene').toggleBossUI(false)
        }

        if(this.player.x >= this.door.x) {
            this.scene.get('playScene').winScreen()
            this.startDelay = this.time.delayedCall(1500, () => {
                this.scene.launch('playScene')
                this.scene.restart()
            });
        }

        this.stingers.getChildren().forEach(stinger => {
            if(stinger.body.y < 100) {
                if(Math.random > 0.5) {
                    stinger.body.x = this.player.x + Math.floor(Math.random()*-100)
                } else {
                    stinger.body.x = this.player.x + Math.floor(Math.random()*100)
                }
                stinger.setFlipY(true)
                stinger.body.y = 150
                stinger.body.setVelocityY(250)
            }
            if(stinger.body.y > 500) {
                stinger.destroy()
            }
            if(this.bee_active == false && this.bee.body == null) {
                stinger.destroy()
            }
        })

        //PLAYER FSM STEP
        this.GuardianFSM.step()
        if(this.bee_active) {
            this.BeeFSM.step()
        }

        this.player.OnGround = false
    }
}