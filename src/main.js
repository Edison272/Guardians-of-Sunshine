// Name: Edison Chan
// Date: 3/4/25

let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Load, Start, Play, Level_1]
}

let game = new Phaser.Game(config)
let { height, width } = game.config
let borderUISize = game.config.height / 25
let borderPadding = borderUISize / 3
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE