class Guardian extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(3)

      //swordsman physics
      this.body.setSize(20,27).setOffset(8, 4)
      this.body.pushable = false
      this.setGravityY(10);
      this.speed = 10

      //state variables
      this.OnGround = true

      //attacking data
      this.atk_type = 'punch'
      this.item_type = 'bomb'


      // initialize state machine managing hero (initial state, possible states, state args[])
      scene.GuardianFSM = new StateMachine('dancing', {
        dancing: new DanceState(),
        idle: new IdleState(),
        walk: new WalkState(),
        jump: new JumpState(),
        attack: new AttackState(),
        final_hit: new FinalHitState(),
        bomb: new BombState()

      }, [scene, this])
    }
}

class DanceState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-dance').once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
}

class IdleState extends State {
    enter(scene, guardian) {
        guardian.setVelocityX(0)
        guardian.anims.stop()
        guardian.anims.play('guardian-walk')
        guardian.anims.stop()
    }
    execute(scene, guardian) {
        if (keyLEFT.isDown ||keyRIGHT.isDown) {
            this.stateMachine.transition('walk')
        }

        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.stateMachine.transition('jump')
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.stateMachine.transition('attack')
        }
    }
}

class WalkState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-walk', true)
    }
    execute(scene, guardian) {
        if (keyLEFT.isDown) {
            guardian.setFlipX(true)
            guardian.setVelocityX(-50)
        }

        else if (keyRIGHT.isDown) {
            guardian.setFlipX(false)
            guardian.setVelocityX(50)
        }
        else {
            this.stateMachine.transition('idle')
        }
    }
}

class JumpState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-jump').once('animationcomplete', () => {
            guardian.setVelocityY(0)
            this.stateMachine.transition('idle')
        })
        guardian.setVelocityY(-200)
        guardian.OnGround = false
    }
}

class AttackState extends State {
    enter(scene, guardian) {
        guardian.anims.play(`guardian-${guardian.atk_type}`).once('animationcomplete', () => {
            
            this.stateMachine.transition('final_hit')
        })
    }
}

class FinalHitState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-final-hit').once('animationcomplete', () => {

            this.stateMachine.transition('idle')
        })
    }
}

class BombState extends State {

}