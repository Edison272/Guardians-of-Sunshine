class BeeStinger extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.body.setSize(5,7).setOffset(0, 0)
      this.body.pushable = false
      this.fall_speed = 10
    }
}