// Name: Edison Chan
// Date: 3/4/25

// TECHNICAL COMPONENTS ======================================================================================================

// - Tilemap - maps made from tilemap, use tilemap objects to mark spawn points and location-sensitive events

// - Physics - All important entities (player, bee, bunny, frog) use a physics body to some extent, in order to track hits and interact with the map
//           - player needs physics body to collect coins and take damage from hazards

// - StateMachines - All important entities use a state machine to perform different moves

// - Animation Manager - animation manager used to give entities unique animations, 
//                     - used animation events to help with some state machine transitions

// - Cameras - Camera is programmed to follow the player, but only within the bounds of the tilemap

// - Timers - Timer counts down between levels, and some entities have internal timers for specific abilities

// - Parallel Scenes - Launches a UI scene that runs along side the level scene, which is used to manage the Player's UI
//                   - UI scene has function calls that are accessed by the level scene to update UI

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
    scene: [Load, Start, Play, Level_1, Level_2, Level_3]
}

let game = new Phaser.Game(config)
let { height, width } = game.config
let borderUISize = game.config.height / 25
let borderPadding = borderUISize / 3
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyZ, keyX