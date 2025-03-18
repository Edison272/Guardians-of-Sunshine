class Play extends Phaser.Scene {
    constructor() {
        super("playScene")

    }

    create() {
        // GAME PRESETS
        this.lives = 3
        this.bombs = 2
        this.score = 0
        this.life_tokens = []
        this.bomb_tokens = []
        this.UIelements = this.add.group()
        this.UIbaritems = this.add.group()
        this.UIon = false
        this.BossUI_on = false

        this.winScreens = []

        this.currentLevel = 'level_1_Scene'


        // SETUP STUFF

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        
        //ui bar
        this.UIbar = this.add.image(game.config.width/2, -100, 'ui-bar').setOrigin(0.5, 0.5).setScale(3.5)
        this.UIelements.add(this.UIbar)


        //lives
        let life_box_width = 250
        for(let i = 0; i < this.lives; i++) {
            this.life_tokens[i] = this.add.image((game.config.width/4.75) - (life_box_width/2) + (life_box_width/this.lives)*i, 100, 'life-counter').setOrigin(0.5, 0.5).setScale(3.5)
            this.UIelements.add(this.life_tokens[i])
            this.UIbaritems.add(this.life_tokens[i])
        }

        //bombs
        for(let i = 0; i < this.bombs; i++) {
            this.bomb_tokens[i] = this.add.image((game.config.width/1.15) - (life_box_width/2) + (life_box_width/this.bombs)*i, 100, 'bomb').setOrigin(0.5, 0.75).setScale(3.5)
            this.UIelements.add(this.bomb_tokens[i])
            this.UIbaritems.add(this.bomb_tokens[i])
        }

        //score board
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '54px',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: '#a8e61d',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 1000
          }
        this.scoreui = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, 60, this.score, scoreConfig)
        this.UIbaritems.add(this.scoreui)

        //boss stuff
        this.boss_bar = this.add.sprite(game.config.width/2, game.config.height/1.1+120, 'boss-bar').setScale(3.5)
        this.boss_health = this.add.rectangle(game.config.width/2-450, game.config.height/1.1, 298, 28, 0xA8E61D).setScale(3,1.5).setOrigin(0, 0.5)
        this.boss_name_tag = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, game.config.height/1.35, 'default', scoreConfig)
        this.UIbossBarItems = this.add.group([this.boss_health, this.boss_name_tag])
        this.UIelements.add(this.boss_bar)

        //GROUP TOGETHER AND SET TO FRONT
        this.UIbaritems.setVisible(false)
        this.UIelements.depth = 1000
        this.UIbaritems.depth = 1001

        this.UIbossBarItems.setVisible(false)

        
    }

    damage() {
        if(this.lives > 0) {
            this.life_tokens[this.lives-1].destroy()
            this.lives -= 1
            if(this.lives == 0) {
                let lose_screen = this.add.sprite(game.config.width/2, game.config.height/2, 'lose-screen').setScale(4).setOrigin(0.5, 0.5)
                this.scene.get(this.currentLevel).bgMusic.stop()
                this.scene.get(this.currentLevel).player.StopAudio()
                this.sound.play('GameOver')
                this.startDelay = this.time.delayedCall(1500, () => {
                    this.scene.restart()
                    this.scene.get(this.currentLevel).scene.start('level_1_Scene')
                    
                });
            }
        }
    }

    useBomb() {
        if(this.bombs > 0) {
            this.bomb_tokens[this.bombs-1].destroy()
            this.bombs -= 1
        }
    }

    addScore(add_pts) {
        this.score += add_pts
        this.scoreui.text = this.score
    }

    setupBoss(boss_name) {
        this.boss_name_tag.text = boss_name

        this.boss_health.scaleX = 3
    }

    updateBossHealth(health_percent) {
        this.boss_health.scaleX = 3*health_percent
    }

    toggleUI(on_off) { //trur for on
        this.UIon = on_off
    }

    toggleBossUI(on_off) {
        this.BossUI_on = on_off
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
            this.scene.get(this.currentLevel).bgMusic.stop()
            this.scene.get(this.currentLevel).player.StopAudio()
            this.scene.stop()
            this.scene.get(this.currentLevel).scene.start('startScene')
                
        }
        if (this.UIon && this.UIbar.y < 60) {
            this.UIbar.y += 4
            if(this.UIbar.y >= 60) {
                this.UIbaritems.setVisible(true)
            }
        } else if (!this.UIon && this.UIbar.y > -100) {
            if(this.UIbar.y <= 60) {
                this.UIbaritems.setVisible(false)
            }
            this.UIbar.y -= 4
        }

        if(this.BossUI_on && this.boss_bar.y > game.config.height/1.1) {
            this.boss_bar.y -= 4
            if(this.boss_bar.y <= game.config.height/1.1+12) {
                this.UIbossBarItems.setVisible(true)
            }
        } else if(!this.BossUI_on && this.boss_bar.y < game.config.height/1.1+120) {
            this.boss_bar.y += 4
            if(this.boss_bar.y > game.config.height/1.1) {
                this.UIbossBarItems.setVisible(false)
            }
        }


    }

    winScreen() {
        let win_screen = this.add.sprite(game.config.width/2, game.config.height/2, 'win-screen').setScale(4).setOrigin(0.5, 0.5)
    }

}