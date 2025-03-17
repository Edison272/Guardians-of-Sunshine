class Bunny extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.visible = false
      this.setScale(3)

      //bunny physics
      this.body.setSize(36,47).setOffset(0, 0)
      this.body.pushable = false
      this.body.setGravityY(1000)


      this.max_health = 9
      this.health = 15
      this.points = 800

      this.bound_x_min = 0
      this.bound_x_max = 100

      this.damaged = false

      //attack stuff
      this.lasers = 3
      this.wait_time = 2000



      // initialize state machine managing hero (initial state, possible states, state args[])
      scene.BunnyFSM = new StateMachine('not_spawned', {
        not_spawned: new NotSpawnedState(),
        spawn: new SpawnState(),
        hop: new HopState(),
        bunny_shoot: new BunnyShootState(),
        wait: new WaitState()

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
        this.visible = false
    }

}

class NotSpawnedState extends State {
  enter(scene, bunny) {
    bunny.visible = false
  }
  execute(scene, bunny) {
    if(scene.bunny_active) {
      this.stateMachine.transition('spawn')
    }
  }
}

class SpawnState extends State {
  enter(scene, bunny) {
    bunny.visible = true
    bunny.anims.play('bunny-spawn').once('animationcomplete', () => {
      this.stateMachine.transition('wait')
    })
  }
}

class HopState extends State {
  enter(scene, bunny) {
    if(!bunny.visible) {
      return
    }
    bunny.anims.play('bunny-jump').once('animationcomplete', () => {
      if(scene.player.x < bunny.x) {
        bunny.setFlipX(false)
        bunny.body.setVelocity(-200 + Math.floor(Math.random()*-100), -400)
      } else {
        bunny.setFlipX(true)
        bunny.body.setVelocity(200 + Math.floor(Math.random()*100), -400)
      }
      bunny.anims.play('bunny-idle')
      const waiting = scene.time.delayedCall(bunny.wait_time/2, () => {
        bunny.setVelocity(0)
        this.stateMachine.transition('bunny_shoot')
      })
    })
  }
}

class BunnyShootState extends State {
  enter(scene, bunny) {
    if(!bunny.visible) {
      return
    }
    bunny.anims.play('bunny-shoot').once('animationcomplete', () => {
      bunny.lasers -= 1
      scene.shootLaser(bunny.x, bunny.y-20)
      scene.shootLaser(bunny.x, bunny.y)
      bunny.anims.play('bunny-idle-short').once('animationcomplete', () => {
        if(bunny.lasers > 0 && scene.player.x > bunny.bound_x_min) {
          this.stateMachine.transition('bunny_shoot')
        } else {
          this.stateMachine.transition('wait')
        }
      })
    })
  }
  execute(scene, bunny) {
      if(scene.player.x < bunny.x) {
        bunny.setFlipX(false)
      } else {
        bunny.setFlipX(true)
      }
  }
}

class WaitState extends State {
  enter(scene, bunny) {
    if(!bunny.visible) {
      return
    }
    bunny.lasers = 3
    bunny.anims.play('bunny-idle')
    const waiting = scene.time.delayedCall(bunny.wait_time, () => {
      if(bunny.lasers > 0 && scene.player.x > bunny.bound_x_min) {
        this.stateMachine.transition('hop')
      } else {
        this.stateMachine.transition('wait')
      }
    })
  }
}