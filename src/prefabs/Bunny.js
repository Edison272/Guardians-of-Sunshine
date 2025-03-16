class Bunny extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(3)

      //swordsman physics
      this.body.setSize(57,43).setOffset(0, 0)
      this.body.pushable = false
      this.speed = 10
      this.max_health = 10
      this.health = 10
      this.points = 500

      this.active_x = 0

      this.bound_x_min = 0
      this.bound_x_max = 100
      this.target_x = 0

      this.damaged = false


      // initialize state machine managing hero (initial state, possible states, state args[])
      scene.BeeFSM = new StateMachine('spawn', {
        spawn: new SpawnState(),

      }, [scene, this])
    }

}

class SpawnState extends State {

}