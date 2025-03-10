class Firepit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(4)

      //coin physics
      this.body.setSize(37,10).setOffset(0, 20)
      this.body.pushable = true
      this.points = 50
    }
}