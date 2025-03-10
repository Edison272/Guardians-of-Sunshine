class Play extends Phaser.Scene {
    constructor() {
        super("playScene")

    }

    create() {
        // GAME PRESETS
        this.lives = 3
        this.life_tokens = []
        this.UIelements = this.add.group()
        this.UIbaritems = this.add.group()
        this.UIon = false


        // SETUP STUFF
        this.UIbar = this.add.image(game.config.width/2, -100, 'ui-bar').setOrigin(0.5, 0.5).setScale(3.5)
        this.UIelements.add(this.UIbar)

        let life_box_width = 250
        for(let i = 0; i < this.lives; i++) {
            this.life_tokens[i] = this.add.image((game.config.width/4.75) - (life_box_width/2) + (life_box_width/this.lives)*i, 100, 'life-counter').setOrigin(0.5, 0.5).setScale(3.5)
            this.UIelements.add(this.life_tokens[i])
            this.UIbaritems.add(this.life_tokens[i])
        }


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