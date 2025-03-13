class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(2.5)
      this.setOrigin(0.5, 0.5)

      this.anims.play('coin-idle')

      //coin physics
      this.body.setSize(7,17).setOffset(1, 0)
      this.body.pushable = true
      this.points = 50
    }

    collect() {
        this.body.enable = false
        this.scene.sound.play('coin-jingle')
        this.anims.play('coin-collect').once('animationcomplete', () => {
            
            this.destroy()
        })

    }
}