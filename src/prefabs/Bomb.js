class Bomb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture)
      scene.add.existing(this)
      scene.physics.add.existing(this)
      this.setGravityY(1000);

      this.body.setSize(12,12).setOffset(2, 12)
      this.body.enable = false
      this.body.pushable = false
      this.throw_speed = 700
      this.bomb_dmg = 9

      this.setScale(3)
      this.setOrigin(0.5, 1)

      this.anims.play('bomb-sparkle')
      
    }

    throw(right_or_left) {
        this.body.enable = true
        this.body.setVelocityY(-200)
        if(right_or_left) { //true for right, false for left
            this.body.setVelocityX(this.throw_speed)
        } else {
            this.body.setVelocityX(-this.throw_speed)
        }
    }

    detonate() {
        this.scene.cameras.main.shake(500, 0.02)
        this.destroy()
    }
}