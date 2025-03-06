class Play extends Phaser.Scene {
    constructor() {
        super("playScene")

    }

    create() {
        // GAME PRESETS
        this.lives = 3
        this.life_tokens = []


        // SETUP STUFF
        this.add.image(game.config.width/2, 100, 'ui-bar').setOrigin(0.5, 0.5).setScale(3.5)

        let life_box_width = 250
        for(let i = 0; i < this.lives; i++) {
            this.life_tokens[i] = this.add.image((game.config.width/4.75) - (life_box_width/2) + (life_box_width/this.lives)*i, 100, 'life-counter').setOrigin(0.5, 0.5).setScale(3.5)
        }
    }

    damage() {
        if(this.lives > 0) {
            this.life_tokens[this.lives-1].destroy()
            this.lives -= 1
        }
    }


    update() {

    }

}