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
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
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
        this.player_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'PlayerSpawn')
        this.player = new Guardian(this, this.player_spawn.x*3+100, this.player_spawn.y*3, 'guardian').setOrigin(0.5, 1)
        this.player.item_uses = this.scene.get('playScene').bombs
        this.bombs = this.add.group()

        //SLEEPT SAM
        const frog_spawn = map.findObject('SpawnPoint', (obj) => obj.name === 'FrogSpawn')
        this.frog = new Frog(this, frog_spawn.x*3, frog_spawn.y*3, 'frog')
        this.frog_active = false
        this.scene.get('playScene').currentLevel = this.scene.key
        this.scene.get('playScene').setupBoss('Sleepy Sam')

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

        this.physics.add.collider(this.player, this.frog, (player, frog) => {
            if(player.isAttacking) {
                frog.damage()
                this.scene.get('playScene').updateBossHealth(this.frog.health/this.frog.max_health)
                player.isAttacking = false
                if(frog.health == 0) {
                    player.finalHit = true
                    this.scene.get('playScene').addScore(frog.points)
                    this.scene.get('playScene').toggleBossUI(false)
                    this.frog_active = false

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
                    const score_text = this.add.text(frog.x, frog.y, frog.points, scoreConfig).setOrigin(0.5)
                    const poof = this.add.sprite(frog.x, frog.y, 'poof', 0).setOrigin(0.5, 0.5).setScale(3.5)
                    frog.defeated()
                    poof.anims.play('boss-poof').once('animationcomplete', () => {
                        poof.destroy()
                        score_text.destroy()
                    })
                }
            }
        })

        this.physics.add.overlap(this.hazards, this.player, (hazard, player) => {
            this.scene.get('playScene').damage()
            player.setVelocityY(0)
            this.player.setPosition(this.player_spawn.x*3, this.player_spawn.y*3)
        })

        this.physics.add.overlap(this.bombs, this.frog, (bomb, frog) => {
            frog.damage(bomb.bomb_dmg)
            bomb.detonate()
            this.scene.get('playScene').updateBossHealth(this.frog.health/this.frog.max_health)
            if(frog.health == 0) {
                this.scene.get('playScene').addScore(frog.points)
                this.scene.get('playScene').toggleBossUI(false)
                this.frog_active = false
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
                const score_text = this.add.text(frog.x, frog.y, frog.points, scoreConfig).setOrigin(0.5)
                const poof = this.add.sprite(frog.x, frog.y, 'poof', 0).setOrigin(0.5, 0.5).setScale(3.5)
                frog.defeated()
                poof.anims.play('boss-poof').once('animationcomplete', () => {
                    poof.destroy()
                    score_text.destroy()
                })
                frog.defeated()
            }
        })

        this.physics.add.collider(this.bombs, caveLayer, (bomb, caveLayer) => {
            bomb.detonate()
        })

        //SPECIAL COMBO
        this.stop_the_count = false
        this.input.keyboard.createCombo([keyUP, keyDOWN, keyLEFT, keyLEFT, keyRIGHT, keyRIGHT, keyDOWN, keyUP, keyRIGHT, keyDOWN, keyLEFT, keyX], { resetOnMatch: true });

        this.input.keyboard.on('keycombomatch', () => {
            this.stop_the_count = true
            this.frog.health = 0
            this.scene.get('playScene').addScore(this.frog.points)
            this.scene.get('playScene').toggleBossUI(false)
            this.frog_active = false
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
                fixedWidth: 200
              }
            const score_text = this.add.text(this.frog.x, this.frog.y, this.frog.points, scoreConfig).setOrigin(0.5)
            const poof = this.add.sprite(this.frog.x, this.frog.y, 'poof', 0).setOrigin(0.5, 0.5).setScale(3.5)
            this.frog.defeated()
            poof.anims.play('boss-poof').once('animationcomplete', () => {
                poof.destroy()
                score_text.destroy()
            })
        
        })
    }

    fateSealed() {
        //turn off normal UI and camera
        if(this.stop_the_count) {
            return
        }
        this.scene.get('playScene').toggleUI(false)
        this.scene.get('playScene').toggleBossUI(false)
        this.player.visible = false
        this.player.setVelocity(0)
        this.stopEntities = true
        this.cameras.main.startFollow(this.frog, false, 0.5, 0.5)
        this.cameras.main.zoom = 3
        this.time.delayedCall(6000, () => {
            this.frog_active = false
            this.UIon = false
            this.player.visible = true
            this.stopEntities = false
            this.cameras.main.startFollow(this.player, false, 0.5, 0.5)
            this.cameras.main.zoom = 1
            //respawn player
            this.scene.get('playScene').damage()
            this.player.setPosition(this.player_spawn.x*3, this.player_spawn.y*3)
            //reset frog
        });

    }

    update() {
        if (this.player.x > this.enter_cave_x && this.UIon == false) {
            this.UIon = true
            this.scene.get('playScene').toggleUI(true)
        } else if (this.player.x <= this.enter_cave_x && this.UIon == true) {
            this.UIon = false
            this.scene.get('playScene').toggleUI(false)
        }

        if(this.player.x >= this.fight_frog_x && this.frog_active == false && this.frog.health > 0) {
            this.frog_active = true
            this.scene.get('playScene').toggleBossUI(true)
        } else if((this.player.x < this.fight_frog_x && this.frog_active)) {
            this.frog_active = false
            this.scene.get('playScene').toggleBossUI(false)
        }

        if(this.player.x >= this.door.x) {
            this.stopEntities = true
            this.scene.get('playScene').toggleUI(false)
            this.scene.get('playScene').toggleBossUI(false)
            let winScreen =  this.add.sprite(this.cameras.main.scrollX+game.config.width/2, this.cameras.main.scrollY+game.config.height/2, 'win-screen').setScale(3).setOrigin(0.5, 0.5)
            this.startDelay = this.time.delayedCall(1500, () => {
                this.scene.start('startScene')
            });
        }

        //PLAYER FSM STEP
        if(!this.stopEntities) {
            
            this.GuardianFSM.step()
            if(this.frog_active) {
                this.FrogFSM.step()
            }
        }

        this.player.OnGround = false
    }

}