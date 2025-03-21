class Bee extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(3)

      //swordsman physics
      this.body.setSize(57,43).setOffset(0, 0)
      this.body.pushable = false
      this.speed = 10
      this.max_health = 18
      this.health = 18
      this.points = 500

      this.active_x = 0

      this.bound_x_min = 0
      this.bound_x_max = 100
      this.target_x = 0

      this.damaged = false


      // initialize state machine managing hero (initial state, possible states, state args[])
      scene.BeeFSM = new StateMachine('entry', {
        entry: new EntryState(),
        retreat: new RetreatState(),
        charge: new ChargeState(),
        bee_shoot: new BeeShootState(),

      }, [scene, this])
    }

    damage(dmg = 1) {
        this.health -= dmg
        if(this.health < 0) {
            this.health = 0
        }
    }
    defeated() {
        this.scene.sound.play('Restart')
        this.anims.stop()
        this.visible = false
    }
}

class EntryState extends State {
    enter(scene, bee) {
        bee.anims.play('bee-fly')
    }
    execute(scene, bee) {
        if(scene.bee_active) {
            if(bee.x > bee.active_x){
                bee.x -= 3
            } else {
                this.stateMachine.transition('charge')
            }
        }
    }
}

class RetreatState extends State {
    enter(scene, bee) {
        bee.anims.play('bee-fly')
        bee.target_x = bee.bound_x_min + Math.floor(Math.random() * (bee.bound_x_max-bee.bound_x_min))
    }
    execute(scene, bee) {
        if(bee.x < bee.target_x + 10 && bee.x > bee.target_x - 10) {
            this.stateMachine.transition('charge')
        } else {
            if(bee.x < bee.target_x) {
                bee.setFlipX(true)
                bee.x += 4
            } else {
                bee.setFlipX(false)
                bee.x -= 4
            }
        }
    }
}

class ChargeState extends State {
    enter(scene, bee) {
        bee.anims.play('bee-charge').once('animationcomplete', () => {
            this.stateMachine.transition('bee_shoot')
        })
    }
}

class BeeShootState extends State {
    enter(scene, bee) {
        scene.shootStingers()
        bee.anims.play('bee-fire').once('animationcomplete', () => {
            this.stateMachine.transition('retreat')
        })
    }
}