class Play extends Phaser.Scene {
    constructor() {
        super("playScene")

    }

    create() {
        // GAME PRESETS
        this.lives = 3
        this.score = 0
        this.life_tokens = []
        this.UIelements = this.add.group()
        this.UIbaritems = this.add.group()
        this.UIon = false


        // SETUP STUFF
        
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
            fixedWidth: 200
          }
        this.scoreui = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, 60, this.score, scoreConfig)
        this.UIbaritems.add(this.scoreui)

        //GROUP TOGETHER AND SET TO FRONT
        this.UIbaritems.setVisible(false)
        this.UIelements.depth = 1000
        this.UIbaritems.depth = 1001
        
    }

    damage() {
        if(this.lives > 0) {
            this.life_tokens[this.lives-1].destroy()
            this.lives -= 1
        }
    }

    addScore(add_pts) {
        this.score += add_pts
        this.scoreui.text = this.score
    }

    toggleUI(on_off) { //trur for on
        this.UIon = on_off
    }

    update () {
        if (this.UIon && this.UIbar.y < 60) {
            this.UIbar.y += 4
            if(this.UIbar.y == 60) {
                this.UIbaritems.setVisible(true)
            }
        } else if (!this.UIon && this.UIbar.y > -120) {
            if(this.UIbar.y == 60) {
                this.UIbaritems.setVisible(false)
            }
            this.UIbar.y -= 4
        }

    }

}