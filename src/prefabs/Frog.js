class Frog extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(3)

      //forg physics
      this.body.setSize(22,100).setOffset(23, -80)
      this.body.pushable = false

      this.max_health = 100
      this.health = 100
      this.points = 1300

      this.damaged = false

      //attack stuff
      this.wait_time = 3000
      this.wait_atk


      this.anims.play('frog-sleep')



      // initialize state machine managing hero (initial state, possible states, state args[])
      scene.FrogFSM = new StateMachine('sleeping', {
        sleeping: new SleepState(),
        awaken: new AwakenState(),
        wait: new WaitingState()

      }, [scene, this])
    }

    damage(dmg = 1) {
      this.health -= dmg
      if(this.health < 0) {
          this.health = 0
      }
    }
    defeated() {
        this.anims.stop()
        this.body.enable = false
        this.visible = false
    }

}

class SleepState extends State {
    enter(scene, frog) {
        frog.anims.play('frog-sleep')
    }
    execute(scene, frog) {
      if(scene.frog_active) {
        this.stateMachine.transition('awaken')
      }
    }
  }
  
  class AwakenState extends State {
    enter(scene, frog) {
        frog.anims.play('frog-wake').once('animationcomplete', () => {
            this.stateMachine.transition('wait')
        })
    }
  }

  class WaitingState extends State {
    enter(scene, frog) {
      frog.anims.play('frog-wait')
        this.wait_atk = scene.time.delayedCall(frog.wait_time, () => {
            scene.fateSealed()
            frog.anims.play('frog-eat').once('animationcomplete', () => {
                this.stateMachine.transition('sleeping')
            })
      })
    }
  }