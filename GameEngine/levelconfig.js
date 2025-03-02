/**
 * Handles level configurations, including loading maps, players, and hazards.
 *
 * @author Peter Madin
 * @version 0.0.1
 * @date 02/7/25
 */
class LevelConfig {
    /**
     * Creates an instance of LevelConfig.
     * @param {object} gameEngine - The game engine instance.
     */
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentLevel = 1; // sets the current level
        this.TILE_SIZE = 25;
    }

    /**
     * Retrieves the entity configurations for a given level.
     *
     * @param {number} levelNumber - The level number to load.
     * @returns {object|null} Level configuration containing map, player, and hazards, or null if level does not exist.
     */
    getLevelEntities(levelNumber) {
        // first create the player instance
        // Each level configuration returns an array of entities (saves initial state)
        // This will be setup up for each map
        const levels = {
            0: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 85, 400),
                exitDoor: () => new exitDoor(this.game, 1075, 175, 2),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 100, y: 50, speed: 25, moving: true, direction: null, tracking: true, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 500, y: 265, speed: 150, moving: true, direction: "RIGHT", tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 350, y: 250, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1075,
                        y: 450,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 100,
                        shotdirec: "LEFT"
                    }),
                    new Platform({
                        gameEngine: this.game, x: 550, y: 225, speed: 0, moving: false, direction: null, reverseTime: 0, size: "SHORT"
                    }),
                    new Lever({gameEngine: this.game, x: 640, y: 90, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 750, y: 450, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Laser({gameEngine: this.game, x: 280, y: 55, speed: 100, moving: true, direction: 'RIGHT', reverseTime: 2, shotdirec: 'RIGHT', length: 500})
                ]
            },

            // add second map example

            1: {
                // replace with real second map
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 1000, 830),
                exitDoor: () => new exitDoor(this.game, 30, 95),
                hazards: () =>
                    [new Spike({gameEngine: this.game, x: 180, y: 260, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 220, y: 260, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 510, y: 360, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 550, y: 360, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 810, y: 460, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 850, y: 460, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1120, y: 560, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1160, y: 560, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1520, y: 760, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1520, y: 720, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1775, y: 575, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1775, y: 615, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    ]
            },

            2: {
                // replace with real second map
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 25, 700),
                exitDoor: () => new exitDoor(this.game, 1305, 320),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 420, y: 470, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 440, y: 470, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 735, y: 470, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 755, y: 470, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                ]
            },

            3: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 170, 130), // Starting position near top left
                exitDoor: () => new exitDoor(this.game, 1805, 119,1), // Exit door near top right
                hazards: () => [
                    // Some spike hazards at strategic positions
                    new Spike({gameEngine: this.game, x: 260, y: 240, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 480, y: 300, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 540, y: 300, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 600, y: 300, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 850, y: 390, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 895, y: 435, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 805, y: 350, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 40, y: 175, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1680, y: 235, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1090, y: 490, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1150, y: 520, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1210, y: 550, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1450, y: 305, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1420, y: 550, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1485, y: 600, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1550, y: 650, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 320, y: 800, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 320, y: 700, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 320, y: 600, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 320, y: 500, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 820, y: 800, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 820, y: 700, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 820, y: 600, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 820, y: 500, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),




                    //platfrom
                    new Platform({
                        gameEngine: this.game, x: 1200, y: 370, speed: 50, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),
                    // Levers that need to be collected
                    new Lever({gameEngine: this.game, x: 30, y: 800, speed: 0, moving: false, direction: null, reverseTime: 0}),
                ]
            }

            // add more levels below
        };

        // If a valid level exists, call the function for that level, otherwise return null.
        return levels[levelNumber] || null;
    }

    /**
     * Loads a level by creating and adding entities in the correct order: map, player, and hazards.
     *
     * @param {number} levelNumber - The level number to load.
     * @returns {boolean} True if the level was loaded successfully, false otherwise.
     */
    loadLevel(levelNumber) {
        const levelConfig = this.getLevelEntities(levelNumber);
        if (!levelConfig) return false;

        // Make sure any level completion UI is hidden first
        if (this.game.levelUI) {
            this.game.levelUI.hideLevelComplete();
        }

        // clear existing entities and player reference
        this.game.entities = [];
        this.game.Player = null;

        // first create and add the map
        const map = levelConfig.map();
        console.log("Map instance created");
        map.loadMap(levelNumber);
        console.log("Map after loadMap:", map.map);
        this.game.addEntity(map);

        // create and add the exit door
        const exitDoor = levelConfig.exitDoor();
        this.game.addEntity(exitDoor);

        // add any obstacles
        const obstacles = levelConfig.hazards();
        obstacles.forEach(obstacle => {
            this.game.addEntity(obstacle);
        });

        // create and add the player
        // player is created last so they are at the front of sprites
        const player = levelConfig.player();
        this.game.addEntity(player);

        // Reset timer
        if (this.game.timer) {
            this.game.timer.reset();
        }

        // Add "elevator ding" sound effect when level loads
        // this.playElevatorDing();

        return true;
    }

    getCurrentLevel() {
        return this.currentLevel
    }

    loadNextLevel() {
        if (this.currentLevel < 10) {
            // Make sure any level completion UI is hidden before loading next level
            if (this.game.levelUI) {
                this.game.levelUI.hideLevelComplete();
            }

            // Increment the current level BEFORE loading it
            const nextLevel = this.currentLevel + 1;

            // Add a small delay to ensure UI is properly cleared
            setTimeout(() => {
                console.log(`Loading next level: ${nextLevel}`);

                // Update currentLevel before loading the level
                this.currentLevel = nextLevel;

                // Now load the updated level
                this.loadLevel(nextLevel);

                // Play a random game track for the new level
                if (window.AUDIO_MANAGER) {
                    window.AUDIO_MANAGER.playGameMusic();
                }
            }, 100);
        }
    }

    /**
     * Plays an elevator "ding" sound effect when changing levels
     */
    playElevatorDing() {
        // Create a temporary audio element for the ding sound
        const dingSound = new Audio('./sounds/sample-adinghere.mp3');

        // Set volume based on current audio manager settings
        if (window.AUDIO_MANAGER) {
            dingSound.volume = window.AUDIO_MANAGER.isMuted ? 0 : window.AUDIO_MANAGER.volume;
        } else {
            dingSound.volume = 0.5;
        }

        // Play the sound
        dingSound.play().catch(error => {
            console.error("Error playing elevator ding:", error);
        });
    }
}