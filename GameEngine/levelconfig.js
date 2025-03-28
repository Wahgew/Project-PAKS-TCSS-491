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
                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 400,
                        y: 300, // More visible mid-screen position
                        direction: 'RIGHT',
                        length: 400, // Longer
                        color: 'red',
                        glowColor: 'rgba(255, 0, 0, 0.5)',
                        width: 10, // Thicker
                        glowWidth: 30 // Larger glow
                    }),

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
                    new BigBlock(this.game, 25, 420, 330, 900), // bot left block
                    new BigBlock(this.game, 320, 600, 500, 900), // bot left block
                    new BigBlock(this.game, 1300, 25 , 1875, 300), // top right block.
                    ]
            },

            2: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 25, 700),
                exitDoor: () => new exitDoor(this.game, 1800, 68),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 650, y: 430, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 350, y: 430, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 980, y: 573, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 980, y: 530, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1275, y: 360, speed: 50, moving: true, direction: 'LEFT', tracking: false, reverseTime: 3}),
                    new BigBlock(this.game, 25, 25, 1375, 240),
                    new BigBlock(this.game, 800, 624, 1875, 875),
                ]
            },

            3: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 925, 700),
                exitDoor: () => new exitDoor(this.game, 1190, 69, 1),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 1190, y: 730, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 375, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),
		    new Spike({gameEngine: this.game, x: 520, y: 440, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
		    new Spike({gameEngine: this.game, x: 1400, y: 210, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
		    new Spike({gameEngine: this.game, x: 1780, y: 500, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new ProjectileLauncher({gameEngine: this.game, x: 930, y: 75,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 100,
                        shotdirec: "DOWN"}),
                    new Lever({gameEngine: this.game, x: 140, y: 90, speed: 0, moving: false, direction: null, reverseTime: 0}),

                ]
            },

            4: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 90, 840),
                exitDoor: () => new exitDoor(this.game, 1450, 117),
                hazards: () => [
                    //Beginning Spikes
                    new Spike({gameEngine: this.game, x: 60, y: 310, speed: 120, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 60, y: 645, speed: 120, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 2}),

                    // Falling Spikes
                    new Spike({gameEngine: this.game, x: 500, y: 400, speed: 120, moving: false, direction: 'RIGHT', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 635, y: 825, speed: 120, moving: false, direction: 'RIGHT', tracking: false, reverseTime: 2}),

                    //Corridor Spikes
                    new Spike({gameEngine: this.game, x: 890, y: 690, speed: 120, moving: true, direction: 'UP', tracking: false, reverseTime: 1}),
                    new Spike({gameEngine: this.game, x: 1175, y: 690, speed: 120, moving: true, direction: 'UP', tracking: false, reverseTime: 1}),
                    new Spike({gameEngine: this.game, x: 1480, y: 690, speed: 120, moving: true, direction: 'UP', tracking: false, reverseTime: 1}),

                    new ProjectileLauncher({gameEngine: this.game, x: 1830, y: 300,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 5,
                        projspd: 100,
                        shotdirec: "LEFT"}),


                    new BigBlock(this.game, 25, 25, 700, 125), // top left

                    new BigBlock(this.game, 425, 750, 525, 875), // bottom mid

                    new BigBlock(this.game, 1775, 775, 1875, 875), // bottom right

                    new BigBlock(this.game, 1600, 25, 1875, 200), // top right

                    new Spike({gameEngine: this.game, x: 1330, y: 250, speed: 120, moving: false, direction: 'RIGHT', tracking: false, reverseTime: 2}),


                    //Beginning platfrom
                    new Platform({
                        gameEngine: this.game, x: 90, y: 410, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),
                    new Platform({
                        gameEngine: this.game, x: 90, y: 720, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),
                    new Platform({
                        gameEngine: this.game, x: 90, y: 555, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),

                    //Ending platform
                    new Platform({
                        gameEngine: this.game, x: 1050, y: 330, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    })
                ]
            },

            5: {
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

                    new Spike({gameEngine: this.game, x: 1445, y: 315, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1420, y: 550, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1485, y: 600, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1550, y: 650, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 320, y: 700, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 320, y: 600, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 320, y: 500, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 820, y: 800, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 820, y: 700, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 820, y: 500, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new BigBlock(this.game, 675, 25, 1150, 150),
                    new BigBlock(this.game, 900, 730, 1150, 875),
                    new BigBlock(this.game, 360, 800, 750, 875),


                    //platform
                    new Platform({
                        gameEngine: this.game, x: 1200, y: 370, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),
                    new Platform({
                        gameEngine: this.game, x: 50, y: 740, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),
                    new Platform({
                        gameEngine: this.game, x: 50, y: 575, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),
                    // Levers that need to be collected
                    new Lever({gameEngine: this.game, x: 150, y: 490, speed: 0, moving: false, direction: null, reverseTime: 0}),
                ]

            },

            6: {
                // replace with real second map
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 975, 870),
                exitDoor: () => new exitDoor(this.game, 928, 793, 2),
                hazards: () => [
                    //new BigBlock(this.game, 26, 870, 100, 100),
                    // new BigBlock(this.game, 800, 624, 1875, 875),
                    //new Spike({gameEngine: this.game, x: 650, y: 430, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    //new Spike({gameEngine: this.game, x: 980, y: 573, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    // moving spikes
                    new Spike({gameEngine: this.game, x: 180, y: 30, speed: 100, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 1680, y: 30, speed: 100, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),

                    new Spike({gameEngine: this.game, x: 380, y: 400, speed: 120, moving: true, direction: 'LEFT', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 1475, y: 400, speed: 120, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 3}),

                    // mon moving spikes
                    new Spike({gameEngine: this.game, x: 26, y: 26, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 433, y: 26, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1835, y: 26, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1426, y: 26, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 55, y: 540, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1805, y: 540, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 26, y: 250, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1834, y: 250, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 475, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 520, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 565, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 610, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 655, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 700, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 745, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 790, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 835, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1051, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1093, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1135, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1177, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1219, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1260, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1300, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1340, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1380, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),


                    // Levers that need to be collected
                    new Lever({gameEngine: this.game, x: 23, y: 120, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1853, y: 120, speed: 0, moving: false, direction: 'LEFT', reverseTime: 0}),


                    new Platform({
                        gameEngine: this.game, x: 225, y: 250, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game, x: 1450, y: 250, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game, x: 125, y: 540, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game, x: 1551, y: 540, speed: 0, moving: false, direction: "RIGHT", reverseTime: 0, size: "SHORT"
                    }),

                    new BigBlock(this.game, 475, 25, 1425, 400),
                    new BigBlock(this.game, 25, 700, 475, 875),
                    new BigBlock(this.game, 1425, 700, 1875, 875),
                ]
            },

            7: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 945, 676), // Player starts in center
                exitDoor: () => new exitDoor(this.game, 915, 480, 4), // Exit door in center, requiring 4 levers
                hazards: () => [
                    // Four quadrant blocks
                    // Top-Left Block
                    new BigBlock(this.game, 100, 150, 799, 337),

                    // Top-Right Block
                    new BigBlock(this.game, 1100, 151, 1799, 337),

                    // Bottom-Left Block
                    new BigBlock(this.game, 100, 587, 799, 774),

                    // Bottom-Right Block
                    new BigBlock(this.game, 1100, 587, 1799, 774),

                    // Platforms for additional challenge
                    new Platform({
                        gameEngine: this.game,
                        x: 835,
                        y: 560,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),
                    new Platform({
                        gameEngine: this.game,
                        x: 835,
                        y: 390,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 835,
                        y: 220,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    // Levers that need to be collected
                    new Lever({
                        gameEngine: this.game,
                        x: 100,
                        y: 75,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 100,
                        y: 800,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 1778,
                        y: 75,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 1778,
                        y: 800,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    // Projectile launchers for additional challenge
                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1818,
                        y: 75,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 650,
                        shotdirec: "LEFT"
                    }),
                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 25,
                        y: 830,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 650,
                        shotdirec: "RIGHT"
                    }),

                    new Spike({gameEngine: this.game, x: 100, y: 546, speed: 120, moving: true, direction: "RIGHT", tracking: false, reverseTime: 5.5}),
                    new Spike({gameEngine: this.game, x: 770, y: 546, speed: 120, moving: true, direction: "LEFT", tracking: false, reverseTime: 5.5}),
                    new Spike({gameEngine: this.game, x: 100, y: 340, speed: 120, moving: true, direction: "RIGHT", tracking: false, reverseTime: 5.5}),
                    new Spike({gameEngine: this.game, x: 770, y: 340, speed: 120, moving: true, direction: "LEFT", tracking: false, reverseTime: 5.5}),

                    new Spike({gameEngine: this.game, x: 1100, y: 546, speed: 120, moving: true, direction: "RIGHT", tracking: false, reverseTime: 5.5}),
                    new Spike({gameEngine: this.game, x: 1775, y: 546, speed: 120, moving: true, direction: "LEFT", tracking: false, reverseTime: 5.5}),
                    new Spike({gameEngine: this.game, x: 1100, y: 340, speed: 120, moving: true, direction: "RIGHT", tracking: false, reverseTime: 5.5}),
                    new Spike({gameEngine: this.game, x: 1775, y: 340, speed: 120, moving: true, direction: "LEFT", tracking: false, reverseTime: 5.5}),

                    //new Laser({gameEngine: this.game, x: 811, y: 760, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0, length: 300}),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 800,
                        y: 770,
                        direction: 'HORIZONTAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 300,
                        color: 'red',
                        glowColor: 'rgba(255, 0, 0, 0.7)', // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 12           // Increased glow for visibility
                    })
                ]
            },

            8: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 50, 150),
                exitDoor: () => new exitDoor(this.game, 1800, 193, 3),
                hazards: () => [
                    new Platform({
                            gameEngine: this.game,
                            x: 1140,
                            y: 554,
                            speed: 0,
                            moving: false,
                            direction: null,
                            reverseTime: 0,
                            size: "SHORT"
                    }),

                    new Spike({gameEngine: this.game, x: 1250, y: 120, speed: 120, moving: true, direction: null, tracking: true, reverseTime: 5.5}),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 190,
                        y: 330,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 415,
                        color: 'black',
                        glowColor: 'rgba(240, 240, 240, 0.7)', // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 12           // Increased glow for visibility
                    }),

                    new Lever( {
                        gameEngine: this.game,
                        x: 945,
                        y: 550,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new Lever( {
                        gameEngine: this.game,
                        x: 90,
                        y: 805,
                        speed: 0,
                        moving: false,
                        direction: "RIGHT",
                        reverseTime: 0
                    }),

                    new Lever( {
                        gameEngine: this.game,
                        x: 1800,
                        y: 805,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 325,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 650,
                        shotdirec: "DOWN"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 800,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 650,
                        shotdirec: "DOWN"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1500,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 650,
                        shotdirec: "DOWN"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1230,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 650,
                        shotdirec: "DOWN"
                    }),
                ]

            },

            9: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 50, 150),
                exitDoor: () => new exitDoor(this.game, 1650, 93, 4),
                hazards: () => [

                    new Platform({
                        gameEngine: this.game,
                        x: 812,
                        y: 556,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 980,
                        y: 320,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1345,
                        y: 175,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1650,
                        y: 475,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),


                    new Spike({
                        gameEngine: this.game,
                        x: 1767,
                        y: 120,
                        speed: 70,
                        moving: true,
                        direction: null,
                        tracking: true,
                        reverseTime: 0
                    }),


                    new Spike({
                        gameEngine: this.game,
                        x: 175,
                        y: 645,
                        speed: 80,
                        moving: true,
                        direction: "RIGHT",
                        tracking: false,
                        reverseTime: 2
                    }),

                    new Spike({
                        gameEngine: this.game,
                        x: 1833,
                        y: 425,
                        speed: 60,
                        moving: false,
                        direction: null,
                        tracking: false,
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 333,
                        y: 100,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 1777,
                        y: 410,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 62,
                        y: 800,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 732,
                        y: 300,
                        speed: 0,
                        moving: false,
                        direction: "LEFT",
                        reverseTime: 0
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 500,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 1.8,
                        projspd: 250,
                        shotdirec: "DOWN"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1777,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 300,
                        shotdirec: "DOWN"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1080,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 1.5,
                        projspd: 350,
                        shotdirec: "DOWN"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 885,
                        y: 25,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2.2,
                        projspd: 280,
                        shotdirec: "DOWN"
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 420,
                        y: 750,
                        direction: 'HORIZONTAL',
                        flow: 'DOWN',
                        length: 200,
                        color: 'red'
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 25,
                        y: 750,
                        direction: 'HORIZONTAL',
                        flow: 'DOWN',
                        length: 150,
                        color: 'red'
                    }),
                ]

            },
				10: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 50, 85), // Player starts in top left
                exitDoor: () => new exitDoor(this.game, 1750, 94, 3), // Exit door top right
                hazards: () => [

                    new BigBlock(this.game, 1000, 25, 1425, 400),

                    new Lever({
                        gameEngine: this.game,
                        x: 250,
                        y: 600,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 850,
                        y: 460,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0
                    }),

                    new Lever({
                        gameEngine: this.game,
                        x: 1225,
                        y: 730,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0
                    }),

                    new Spike({gameEngine: this.game, x: 1013, y: 714, speed: 140, moving: true, direction: null, tracking: true, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 750, y: 65, speed: 100, moving: true, direction: null, tracking: true, reverseTime: 0}),


                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 850,
                        y: 845,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 325,
                        shotdirec: "UP"
                    }),

                    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1830,
                        y: 730,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 4,
                        projspd: 175,
                        shotdirec: "LEFT"
                    }),

		    new ProjectileLauncher({
                        gameEngine: this.game,
                        x: 1830,
                        y: 605,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 4,
                        projspd: 175,
                        shotdirec: "LEFT"
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 30,
                        y: 880,
                        direction: 'HORIZONTAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 1840,
                        color: 'red',
                        glowColor: 'rgba(255, 0, 0, 0.7)', // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 12           // Increased glow for visibility
                    })

                ]
            },

            11: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 276, 80),
                exitDoor: () => new exitDoor(this.game, 1800, 818, 3),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 1190, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 1290, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),

                    new Spike({gameEngine: this.game, x: 475, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 375, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),

                    new Spike({gameEngine: this.game, x: 800, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 900, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),

                    new Spike({gameEngine: this.game, x: 1600, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 1700, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),


                    new Spike({gameEngine: this.game, x: 25, y: 80, speed: 30, moving: true, direction: null, tracking: true, reverseTime: 0}),


                    new BigBlock(this.game, 225, 375, 1875, 500),


                    new ProjectileLauncher({gameEngine: this.game, x: 1800, y: 55,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 200,
                        shotdirec: "LEFT"}),
                    new Lever({gameEngine: this.game, x: 150, y: 70, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1854, y: 223, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 24, y: 325, speed: 0, moving: false, direction: null, reverseTime: 0}),



                    new ProjectileLauncher({gameEngine: this.game, x: 40, y: 225,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 200,
                        shotdirec: "RIGHT"}),
                ]
            },

            12: {
                map: () => new drawMap(this.TILE_SIZE, this.game),
                player: () => new Player(this.game, 955, 750), // Player starts in center
                exitDoor: () => new exitDoor(this.game, 935, 93, 4), // Exit door in center, requiring 4 levers
                hazards: () => [
                    // new Spike({gameEngine: this.game, x: 1190, y: 730, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    // new Spike({gameEngine: this.game, x: 375, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),
                    // new ProjectileLauncher({gameEngine: this.game, x: 930, y: 75,speed: 0,
                    //     moving: false,
                    //     direction: null,
                    //     reverseTime: 0,
                    //     atkspd: 2,
                    //     projspd: 100,
                    //     shotdirec: "DOWN"}),
                    new Lever({gameEngine: this.game, x: 24, y: 90, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1853, y: 90, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),

                    new Lever({gameEngine: this.game, x: 750, y: 360, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1135, y: 360, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),

                    new BigBlock(this.game, 850, 224, 1075, 250),


                    new Platform({
                        gameEngine: this.game,
                        x: 168,
                        y: 766,
                        speed: 100,
                        moving: true,
                        direction: "RIGHT",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1568,
                        y: 766,
                        speed: 100,
                        moving: true,
                        direction: "LEFT",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 200,
                        y: 270,
                        speed: 150,
                        moving: true,
                        direction: "UP",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1400,
                        y: 270,
                        speed: 150,
                        moving: true,
                        direction: "UP",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 735,
                        y: 450,
                        speed: 0,
                        moving: true,
                        direction: "UP",
                        reverseTime: 3,
                        size: "WIDE"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 735,
                        y: 600,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "WIDE"
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 30,
                        y: 880,
                        direction: 'HORIZONTAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 1840,
                        color: 'Blue',
                        glowColor: 'rgba(255, 0, 0, 0.7)', // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 12           // Increased glow for visibility
                    }),

                    new Spike({gameEngine: this.game, x: 750, y: 250, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1135, y: 250, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 955, y: 850, speed: 70, moving: true, direction: null, tracking: true, reverseTime: 0}),
                ]
            },

            13: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 1855, 700),
                exitDoor: () => new exitDoor(this.game, 665, 794, 7),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 25, y: 132, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 84, y: 460, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 25, y: 870, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 936, y: 730, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 936, y: 730, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 836, y: 410, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 936, y: 410, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1036, y: 410, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 740, y: 820, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),


                    new Spike({gameEngine: this.game, x: 1834, y: 25, speed: 200, moving: true, direction: "LEFT", tracking: false, reverseTime: 7}),
                    new Spike({gameEngine: this.game, x: 26, y: 25, speed: 200, moving: true, direction: "RIGHT", tracking: false, reverseTime: 7}),

                    new Spike({gameEngine: this.game, x: 160, y: 150, speed: 300, moving: true, direction: "RIGHT", tracking: false, reverseTime: 5}),
                    new Spike({gameEngine: this.game, x: 1634, y: 150, speed: 300, moving: true, direction: "LEFT", tracking: false, reverseTime: 5}),

                    new Spike({gameEngine: this.game, x: 305, y: 280, speed: 50, moving: true, direction: "UP", tracking: false, reverseTime: 15}),
                    new Spike({gameEngine: this.game, x: 1493, y: 280, speed: 50, moving: true, direction: "UP", tracking: false, reverseTime: 20}),


                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 532,
                        y: 532,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 460,
                        color: 'red',
                        glowColor: 'rgba(255, 0, 0, 0.7)', // More opaque for visibility
                        width: 4,               // Increased width
                        glowWidth: 8           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1605,
                        y: 270,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 460,
                        color: 'red',
                        glowColor: 'rgba(255, 0, 0, 0.7)', // More opaque for visibility
                        width: 4,               // Increased width
                        glowWidth: 8           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1670,
                        y: 270,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 460,
                        color: 'red',
                        glowColor: 'rgba(255, 0, 0, 0.7)', // More opaque for visibility
                        width: 4,               // Increased width
                        glowWidth: 8           // Increased glow for visibility
                    }),



                    new Lever({gameEngine: this.game, x: 123, y: 50, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1133, y: 694, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1852, y: 929, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1780, y: 130, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 478, y: 929, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 936, y: 50, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 936, y: 300, speed: 0, moving: false, direction: null, reverseTime: 0}),
                ]
            },

            14: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 925, 930),
                exitDoor: () => new exitDoor(this.game, 915, 50, 2),
                hazards: () => [
                    new BigBlock(this.game, 25, 149, 900, 25),
                    new BigBlock(this.game, 1875, 149, 999, 25),

                    // new Spike({gameEngine: this.game, x: 1190, y: 730, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    // new Spike({gameEngine: this.game, x: 950, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),
                    // new ProjectileLauncher({gameEngine: this.game, x: 930, y: 75,speed: 0,
                    //     moving: false,
                    //     direction: null,
                    //     reverseTime: 0,
                    //     atkspd: 2,
                    //     projspd: 100,
                    //     shotdirec: "DOWN"}),

                    new Spike({gameEngine: this.game, x: 650, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 400, y: 586, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 150, y: 336, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 1210, y: 835, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1459, y: 586, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1709, y: 336, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new ProjectileLauncher({gameEngine: this.game, x: 650, y: 150,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 500,
                        shotdirec: "DOWN"}),

                    new ProjectileLauncher({gameEngine: this.game, x: 410, y: 150,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 600,
                        shotdirec: "DOWN"}),



                    new ProjectileLauncher({gameEngine: this.game, x: 1210, y: 150,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 500,
                        shotdirec: "DOWN"}),

                    new ProjectileLauncher({gameEngine: this.game, x: 1460, y: 150,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 2,
                        projspd: 600,
                        shotdirec: "DOWN"}),

                    new Lever({gameEngine: this.game, x: 24, y: 170, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1853, y: 170, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),

                    new Lever({gameEngine: this.game, x: 24, y: 170, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1853, y: 170, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),

                    new Lever({gameEngine: this.game, x: 933, y: 650, speed: 0, moving: false, direction: null, reverseTime: 0}),

                    new Platform({
                        gameEngine: this.game,
                        x: 720,
                        y: 100,
                        speed: 250,
                        moving: true,
                        direction: "UP",
                        reverseTime: 2,
                        size: "WIDE"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 720,
                        y: 340,
                        speed: 100,
                        moving: true,
                        direction: "UP",
                        reverseTime: 4,
                        size: "WIDE"
                    }),
                ]
            },

            15: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 426, 97),
                exitDoor: () => new exitDoor(this.game, 1806, 393, 6),
                hazards: () => [
                    new ProjectileLauncher({gameEngine: this.game, x: 1450, y:423,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 5,
                        projspd: 100,
                        shotdirec: "UP"}),

                    new ProjectileLauncher({gameEngine: this.game, x: 1509, y:423,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 5,
                        projspd: 100,
                        shotdirec: "UP"}),

                    new ProjectileLauncher({gameEngine: this.game, x: 1567, y:423,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 5,
                        projspd: 100,
                        shotdirec: "UP"}),

                    new ProjectileLauncher({gameEngine: this.game, x: 1626, y:423,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 5,
                        projspd: 100,
                        shotdirec: "UP"}),

                    new Lever({gameEngine: this.game, x: 448, y: 498, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 448, y: 423, speed: 0, moving: false, direction: null, reverseTime: 0}),


                    new Lever({gameEngine: this.game, x: 654, y: 498, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 698, y: 498, speed: 0, moving: false, direction: null, reverseTime: 0}),

                    new Lever({gameEngine: this.game, x: 903, y: 498, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 903, y: 423, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),

                    new Lever({gameEngine: this.game, x: 1404, y: 498, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1449, y: 498, speed: 0, moving: false, direction: null, reverseTime: 0}),



                    new Platform({
                        gameEngine: this.game,
                        x: 90,
                        y: 565,
                        speed: 100,
                        moving: true,
                        direction: "UP",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1055,
                        y: 655,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1055,
                        y: 280,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),


                    new Platform({
                        gameEngine: this.game,
                        x: 570,
                        y: 282,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1800,
                        y: 560,
                        direction: 'HORIZONTAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 250,
                        color: '#00FFFF',  // Cyan,
                        glowColor: 'rgba(0, 255, 255, 0.7)', // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 16           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1800,
                        y: 666,
                        direction: 'HORIZONTAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 250,
                        color: '#FF00FF',  // Magenta
                        glowColor: 'rgba(255, 0, 255, 0.7)', // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 16           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1550,
                        y: 560,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 110,
                        color: '#FFFF00',  // Yellow
                        glowColor: 'rgba(255, 255, 0, 0.7)', // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 16           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1800,
                        y: 560,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 110,
                        color: '#00FF00',  // Green
                        glowColor: 'rgba(0, 255, 0, 0.7)',  // More opaque for visibility
                        width: 8,               // Increased width
                        glowWidth: 16           // Increased glow for visibility
                    }),

                    new Spike({gameEngine: this.game, x: 1250, y: 500, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),
                    new Spike({gameEngine: this.game, x: 375, y: 505, speed: 200, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 968, y: 505, speed: 200, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 968, y: 400, speed: 200, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),


                    new Spike({gameEngine: this.game, x: 515, y: 26, speed: 400, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 615, y: 26, speed: 400, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 715, y: 26, speed: 400, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 815, y: 26, speed: 400, moving: true, direction: 'DOWN', tracking: false, reverseTime: 2}),

                    new Spike({gameEngine: this.game, x: 24, y: 210, speed: 500, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 1}),
                    new Spike({gameEngine: this.game, x: 24, y: 280, speed: 500, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 24, y: 350, speed: 500, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 2}),

                    new Spike({gameEngine: this.game, x: 30, y: 910, speed: 100, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 20}),




                ]
            },

            16: {
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 124, 106),
                exitDoor: () => new exitDoor(this.game, 1742, 743, 6),
                hazards: () => [
                    new Lever({gameEngine: this.game, x: 450, y: 65, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 950, y: 65, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1450, y: 65, speed: 0, moving: false, direction: null, reverseTime: 0}),

                    new Lever({gameEngine: this.game, x: 700, y: 65, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1200, y: 65, speed: 0, moving: false, direction: null, reverseTime: 0}),
                    new Lever({gameEngine: this.game, x: 1835, y: 757, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}),


                    //top
                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 30,
                        y: 30,
                        direction: 'HORTIZONTAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 1840,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    //left
                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 30,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 850,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    //right
                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1870,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'LEFT',          // Direction of particle animation
                        length: 850,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),


                    //bottom
                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 30,
                        y: 885,
                        direction: 'HORTIZONTAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 1840,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 340,
                        y: 700,
                        direction: 'HORTIZONTAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 1530,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),


                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 340,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 400,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 578,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 400,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),


                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 835,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 400,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1078,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 400,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1337,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 400,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),

                    new GlowingLaser({
                        gameEngine: this.game,
                        x: 1579,
                        y: 30,
                        direction: 'VERTICAL', // New clearer orientation system
                        flow: 'RIGHT',          // Direction of particle animation
                        length: 400,
                        color: 'Black',  // Green
                        glowColor: 'rgba(0, 0, 0, 0.7)',  // More opaque for visibility
                        width: 12,               // Increased width
                        glowWidth: 18           // Increased glow for visibility
                    }),


                    new Platform({
                        gameEngine: this.game,
                        x: 27,
                        y: 666,
                        speed: 200,
                        moving: true,
                        direction: "RIGHT",
                        reverseTime: 8.15,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1290,
                        y: 823,
                        speed: 100,
                        moving: true,
                        direction: "LEFT",
                        reverseTime: 11.75,
                        size: "WIDE"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 845,
                        y: 620,
                        speed: Math.floor(Math.random() * (166 - 87 + 1)) + 87,
                        moving: true,
                        direction: "DOWN",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 345,
                        y: 620,
                        speed: Math.floor(Math.random() * (166 - 87 + 1)) + 87,
                        moving: true,
                        direction: "DOWN",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1345,
                        y: 620,
                        speed: Math.floor(Math.random() * (166 - 87 + 1)) + 87, // random speed from 87 - 150
                        moving: true,
                        direction: "DOWN",
                        reverseTime: 3,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 595,
                        y: 428,
                        speed: 0,
                        moving: true,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 595,
                        y: 510,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1096,
                        y: 428,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),

                    new Platform({
                        gameEngine: this.game,
                        x: 1096,
                        y: 510,
                        speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        size: "SHORT"
                    }),


                    new Spike({gameEngine: this.game, x: 440, y: 435, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 935, y: 435, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new Spike({gameEngine: this.game, x: 1444, y: 435, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),

                    new Spike({gameEngine: this.game, x: 440, y: 850, speed: 75, moving: true, direction: "DOWN", tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 935, y: 850, speed: 75, moving: true, direction: "DOWN", tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 1444, y: 850, speed: 75, moving: true, direction: "DOWN", tracking: false, reverseTime: 3}),
                ]
            },
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
        this.currentLevel = levelNumber;
        const levelConfig = this.getLevelEntities(levelNumber);
        if (!levelConfig) return false;

        // Make sure any level completion UI is hidden first
        if (this.game.levelUI) {
            this.game.levelUI.hideLevelComplete();
            this.game.levelUI.resetUIState();
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
        if (this.currentLevel < 17) {
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