class LevelConfig {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentLevel = 1; // sets the current level
        this.TILE_SIZE = 25;
    }

    getLevelEntities(levelNumber) {
        // first create the player instance
        // Each level configuration returns an array of entities (saves initial state)
        // This will be setup up for each map
        const levels = {
            1: {
                map: () => new testMap(this.TILE_SIZE),
                player: () => new Player(this.game, 75, 400),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 100, y: 100, speed: 50, moving: true, direction: null, tracking: true, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 500, y: 125, speed: 100, moving: true, direction: "LEFT", tracking: false, reverseTime: 4}),
                    new Spike({gameEngine: this.game, x: 350, y: 125, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 975,
                        y: 325,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 100,
                        shotdirec: "LEFT"
                    })
                ]
            },

            // add second map example

            2: {
                // replace with real second map
                map: () => new testMap(this.TILE_SIZE),
                player: () => new Player(this.game, 600, 400),
                hazards: () => []
            }
            // add more levels below
        };

        // If a valid level exists, call the function for that level, otherwise return null.
        return levels[levelNumber] || null;
    }

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