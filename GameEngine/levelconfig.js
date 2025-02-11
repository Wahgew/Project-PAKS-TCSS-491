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
            1: {
                map: () => new drawMap(this.TILE_SIZE),
                player: () => new Player(this.game, 85, 400),
                player: () => new Player(this.game, 75, 400),
                exitDoor: () => new exitDoor(this.game, 200, 175, 50),
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
                    new Lever({gameEngine: this.game, x: 640, y: 100, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 750, y: 450, speed: 0, moving: false, direction: null, reverseTime: 0})
                ]
            },

            // add second map example

            2: {
                // replace with real second map
                map: () => new drawMap(this.TILE_SIZE),
                player: () => new Player(this.game, 600, 400),
                exitDoor: () => new exitDoor(this.game, 100, 200),
                hazards: () => []
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

        // clear existing entities and player reference
        this.game.entities = [];
        this.game.Player = null;


        // first create and add the map
        const map = levelConfig.map();
        this.game.addEntity(map);

        // create and add the player
        const player = levelConfig.player();
        this.game.addEntity(player);

        // create and add the exit door
        const exitDoor = levelConfig.exitDoor();
        this.game.addEntity(exitDoor);

        // add any obstacles
        const obstacles = levelConfig.hazards();
        obstacles.forEach(obstacle => {
            this.game.addEntity(obstacle);
        });

        // Reset timer
        if (this.game.timer) {
            this.game.timer.reset();
        }

        return true;
    }
}