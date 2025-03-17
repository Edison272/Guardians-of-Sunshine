class Level_2 extends Phaser.Scene {
    constructor() {
        super("level_2_Scene")
    }

    preload() {
        this.load.tilemapTiledJSON('lvl2-tilemap', './assets/Backgrounds/TilemapStuff/Level2.json')

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
        const map = this.add.tilemap('lvl2-tilemap')
        const tileset = map.addTilesetImage('CaveTiles', 'tilesetIMG')
        const caveLayer = map.createLayer('TheCave', tileset, 0, 0)

        //area triggers
        this.enter_cave_x = map.findObject('AreaTrigger', (obj) => obj.name == 'EnterCave').x*3
        this.fight_bunny_x = map.findObject('AreaTrigger', (obj) => obj.name == 'StartBunnyFight').x*3
        const goo_pos = map.findObject('SpawnPoint', (obj) => obj.name == 'GooSpawn')
        let level_complete = map.findObject('AreaTrigger', (obj) => obj.name == 'LevelComplete')
        this.door = this.add.image(level_complete.x*3, level_complete.y*3, 'door').setScale(3).setOrigin(0.5,0.65)

        //create goo drop point
        this.goo = this.add.image(goo_pos.x*3, goo_pos.y*3, 'goo').setOrigin(0.5,0).setScale(3)

        // augment layer
        caveLayer.scale = 3
        caveLayer.setCollisionByProperty({ collides: true })

        // PLAYER
        const player_spawn = map.findObject('SpawnPoint', (obj) => obj.name == 'PlayerSpawn')
        this.player = new Guardian(this, player_spawn.x*3+100, player_spawn.y*3, 'guardian').setOrigin(0.75, 1)
        this.player.item_uses = this.scene.get('playScene').bombs
        this.bombs = this.add.group()

        //bunny
        const bunny_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'HoneyBunnySpawn')
        this.bunny = new Bunny(this, bunny_spawn.x*3, bunny_spawn.y*3, 'bunny').setOrigin(0.5, 0.5)
        this.bunny.bound_x_min = this.fight_bunny_x-100
        this.bunny.bound_x_max = bunny_spawn.x*3+300
        this.bunny_active = false
        this.scene.get('playScene').currentLevel = this.scene.key
        this.scene.get('playScene').setupBoss('Honey Bunny')
        this.lasers = this.add.group()


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
            hazard.depth = -1
            this.hazards.add(hazard)

        }

        //camera stuff
        this.cameras.main.setBounds(0,0,caveLayer.width*3, caveLayer.height*3)
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5)



        // PHYSICS
        this.physics.add.collider(this.player, caveLayer, (player, caveLayer) => {
            player.OnGround = true
        })

        this.physics.add.collider(this.bunny, caveLayer, (bunny, caveLayer) => {
        })

        this.physics.add.overlap(this.player, this.bunny, (player, bunny) => {
            if(player.isAttacking) {
                bunny.damage()
                this.scene.get('playScene').updateBossHealth(this.bunny.health/this.bunny.max_health)
                player.isAttacking = false
                if(bunny.health == 0) {
                    player.finalHit = true
                    this.scene.get('playScene').addScore(bunny.points)
                    this.scene.get('playScene').toggleBossUI(false)
                    this.bunny_active = false

                    let scoreConfig = {
                        fontFamily: 'Arial',
                        fontSize: '50px',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        color: '#a8e61d',
                        align: 'center',
                        padding: {
                          top: 5,
                          bottom: 5,
                        },
                        fixedWidth: 100
                      }
                    const score_text = this.add.text(bunny.x, bunny.y, bunny.points, scoreConfig).setOrigin(0.5)
                    const poof = this.add.sprite(bunny.x, bunny.y, 'poof', 0).setOrigin(0.5, 0.5).setScale(3.5)
                    bunny.defeated()
                    poof.anims.play('boss-poof').once('animationcomplete', () => {
                        poof.destroy()
                        score_text.destroy()
                    })
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

        this.physics.add.overlap(this.lasers, this.player, (laser, player) => {
            this.scene.get('playScene').damage()
            player.setVelocityY(0)
            this.player.setPosition(player_spawn.x*3, player_spawn.y)
            laser.destroy()
        })

        this.physics.add.collider(this.lasers, caveLayer, (laser, caveLayer) => {
            laser.destroy()
        })


        this.physics.add.collider(this.bombs, caveLayer, (bomb, caveLayer) => {
            bomb.detonate()
        })

        this.physics.add.overlap(this.bombs, this.bunny, (bomb, bunny) => {
            bunny.damage(bomb.bomb_dmg)
            bomb.detonate()
            this.scene.get('playScene').updateBossHealth(this.bunny.health/this.bunny.max_health)
            if(bunny.health == 0) {
                this.scene.get('playScene').addScore(bunny.points)
                this.scene.get('playScene').toggleBossUI(false)
                this.bunny_active = false
                let scoreConfig = {
                    fontFamily: 'Arial',
                    fontSize: '50px',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    color: '#a8e61d',
                    align: 'center',
                    padding: {
                      top: 5,
                      bottom: 5,
                    },
                    fixedWidth: 100
                  }
                const score_text = this.add.text(bunny.x, bunny.y, bunny.points, scoreConfig).setOrigin(0.5)
                const poof = this.add.sprite(bunny.x, bunny.y, 'poof', 0).setOrigin(0.5, 0.5).setScale(3.5)
                bunny.defeated()
                poof.anims.play('boss-poof').once('animationcomplete', () => {
                    poof.destroy()
                    score_text.destroy()
                })
                bunny.defeated()
            }
        })

    }

    shootLaser(x, y) {
        var laser = this.physics.add.sprite(x, y, 'laser').setScale(3).setOrigin(0.5, 0.5)
        let laserVector = new Phaser.Math.Vector2(this.player.body.x - x, this.player.body.y - y).normalize()
        laser.body.setVelocity(laserVector.x*400, laserVector.y*400)
        this.lasers.add(laser)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) { //auto kill button
            this.scene.get('playScene').damage()
        }

        if(Phaser.Input.Keyboard.JustDown(keyDOWN)) { //auto skip level
            console.log("skipping")
            this.stopEntities = true
            this.bunny_active = false
            this.bunny.destroy()
            this.scene.get('playScene').toggleUI(false)
            this.scene.get('playScene').toggleBossUI(false)
            let winScreen =  this.add.sprite(this.cameras.main.scrollX+game.config.width/2, this.cameras.main.scrollY+game.config.height/2, 'level-3').setScale(4).setOrigin(0.5, 0.5)
            winScreen.depth = 2000
            this.startDelay = this.time.delayedCall(1500, () => {
                this.scene.start('level_3_Scene')
            });
        }

        if (this.player.x > this.enter_cave_x && this.UIon == false) {
            this.UIon = true
            this.scene.get('playScene').toggleUI(true)
        } else if (this.player.x <= this.enter_cave_x && this.UIon == true) {
            this.UIon = false
            this.scene.get('playScene').toggleUI(false)
        }

        if(this.player.x >= this.fight_bunny_x && this.bunny_active == false && this.bunny.health > 0) {
            this.bunny_active = true
            this.scene.get('playScene').toggleBossUI(true)
        } else if((this.player.x < this.bunny.bound_x_min && this.bunny_active)) {
            this.bunny_active = false
            this.scene.get('playScene').toggleBossUI(false)
        }

        if(this.player.x >= this.door.x) {
            this.stopEntities = true
            this.bunny_active = false
            this.bunny.destroy()
            this.scene.get('playScene').toggleUI(false)
            this.scene.get('playScene').toggleBossUI(false)
            let winScreen =  this.add.sprite(this.cameras.main.scrollX+game.config.width/2, this.cameras.main.scrollY+game.config.height/2, 'level-3').setScale(4).setOrigin(0.5, 0.5)
            this.startDelay = this.time.delayedCall(1500, () => {
                this.scene.start('level_3_Scene')
            });
        }
    

        //PLAYER FSM STEP
        if(!this.stopEntities) {
            this.GuardianFSM.step()
            if(this.UIon) {
                this.BunnyFSM.step()
            }
        }

        this.player.OnGround = false
    }

}
