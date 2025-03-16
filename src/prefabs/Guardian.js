class Guardian extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)

      this.setScale(2.5)

      //swordsman physics
      this.body.setSize(8,28).setOffset(8, 4)
      this.body.pushable = false
      this.setGravityY(1000);
      this.speed = 10

      //state variables
      this.OnGround = false
      this.isAttacking = false
      this.finalHit = false

      //attacking data
      this.atk_type = 'punch'
      this.item_type = 'bomb'
      this.item_uses = 20 //default


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

        if (Phaser.Input.Keyboard.JustDown(keyUP) && guardian.OnGround == true) {
            this.stateMachine.transition('jump')
        }
        if (Phaser.Input.Keyboard.JustDown(keyZ)) {
            this.stateMachine.transition('attack')
        }
        if (Phaser.Input.Keyboard.JustDown(keyX) && guardian.item_uses > 0) {
            guardian.item_uses -= 1
            this.stateMachine.transition(guardian.item_type)
        }
    }
}

class WalkState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-walk', true)
    }
    execute(scene, guardian) {
        if (Phaser.Input.Keyboard.JustDown(keyZ)) {
            guardian.setVelocityX(0)
            this.stateMachine.transition('attack')
        } else if (Phaser.Input.Keyboard.JustDown(keyX) && guardian.item_uses > 0) {
            guardian.item_uses -= 1
            guardian.setVelocityX(0)
            this.stateMachine.transition(guardian.item_type)
        } else if (keyLEFT.isDown) {
            guardian.setFlipX(true)
            if (Phaser.Input.Keyboard.JustDown(keyUP) && guardian.OnGround) {
                guardian.setVelocityX(-300)
                this.stateMachine.transition('jump')
            } else {
                guardian.setVelocityX(-200)
            }
            
        } else if (keyRIGHT.isDown) {
            guardian.setFlipX(false)
            if (Phaser.Input.Keyboard.JustDown(keyUP) && guardian.OnGround) {
                guardian.setVelocityX(300)
                this.stateMachine.transition('jump')
            } else {
                guardian.setVelocityX(200)
            }
            
        } else {
            this.stateMachine.transition('idle')
        }


    }
}

class JumpState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-jump').once('animationcomplete', () => {
            guardian.OnGround = false
            guardian.setVelocityY(0)
            if (keyLEFT.isDown ||keyRIGHT.isDown) {
                this.stateMachine.transition('walk')
            } else {
                this.stateMachine.transition('idle')
            }
        })
        guardian.setVelocityY(-500)
    }
}

class AttackState extends State {
    enter(scene, guardian) {
        guardian.isAttacking = true
        guardian.body.setSize(20,28).setOffset(2, 4)
        guardian.anims.play(`guardian-${guardian.atk_type}`).once('animationcomplete', () => {
            guardian.isAttacking = false
            guardian.body.setSize(8,28).setOffset(8, 4)
            if(guardian.finalHit) {
                this.stateMachine.transition('final_hit')
            } else {
                this.stateMachine.transition('idle')
            }
        })
    }
}

class FinalHitState extends State {
    enter(scene, guardian) {
        guardian.finalHit = false
        guardian.anims.play('guardian-final-hit').once('animationcomplete', () => {

            this.stateMachine.transition('idle')
        })
    }
}

class BombState extends State {
    enter(scene, guardian) {
        guardian.anims.play('guardian-bomb').once('animationcomplete', () => {
            scene.bombs.add(new Bomb(scene, guardian.x-guardian.width/1.35, guardian.y-70, 'bomb'))
            scene.scene.get('playScene').useBomb()
            scene.bombs.getChildren().forEach(bomb => {bomb.throw(!guardian.flipX)})
            guardian.anims.play('guardian-bomb-throw').once('animationcomplete', () => {
                this.stateMachine.transition('idle')
            })
        })
    }
}