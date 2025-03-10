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
                    new BigBlock(this.game, 25, 420, 330, 900), // bot left block
                    new BigBlock(this.game, 320, 600, 500, 900), // bot left block
                    new BigBlock(this.game, 1300, 25 , 1875, 300), // top right block.
                    ]
            },

            2: {
                // replace with real second map
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 25, 700),
                exitDoor: () => new exitDoor(this.game, 1800, 43),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 650, y: 430, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 980, y: 573, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}),
                    new BigBlock(this.game, 25, 25, 1375, 240),
                    new BigBlock(this.game, 800, 624, 1875, 875),
                ]
            },

            3: {
                // replace with real second map
                map: () => new drawMap(this.TILE_SIZE,this.game),
                player: () => new Player(this.game, 925, 700),
                exitDoor: () => new exitDoor(this.game, 1190, 69, 1),
                hazards: () => [
                    new Spike({gameEngine: this.game, x: 1190, y: 730, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 3}),
                    new Spike({gameEngine: this.game, x: 375, y: 625, speed: 50, moving: true, direction: 'UP', tracking: false, reverseTime: 4}),
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
                exitDoor: () => new exitDoor(this.game, 1800, 117),
                hazards: () => [
                    //Beginning Spikes
                    new Spike({gameEngine: this.game, x: 60, y: 310, speed: 120, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 2}),
                    new Spike({gameEngine: this.game, x: 60, y: 645, speed: 120, moving: true, direction: 'RIGHT', tracking: false, reverseTime: 2}),

                    //Corridor Spikes
                    new Spike({gameEngine: this.game, x: 890, y: 690, speed: 120, moving: true, direction: 'UP', tracking: false, reverseTime: 1}),
                    new Spike({gameEngine: this.game, x: 1175, y: 690, speed: 120, moving: true, direction: 'UP', tracking: false, reverseTime: 1}),
                    new Spike({gameEngine: this.game, x: 1480, y: 690, speed: 120, moving: true, direction: 'UP', tracking: false, reverseTime: 1}),

                    new ProjectileLauncher({gameEngine: this.game, x: 1830, y: 300,speed: 0,
                        moving: false,
                        direction: null,
                        reverseTime: 0,
                        atkspd: 10,
                        projspd: 50,
                        shotdirec: "LEFT"}),


                    new BigBlock(this.game, 25, 25, 425, 100),


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


                    //platfrom
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
                player: () => new Player(this.game, 945, 450), // Player starts in center
                exitDoor: () => new exitDoor(this.game, 915, 480, 4), // Exit door in center, requiring 4 levers
                hazards: () => [
                    // Four quadrant blocks
                    // Top-Left Block
                    new BigBlock(this.game, 100, 150, 799, 337),

                    // Top-Right Block
                    new BigBlock(this.game, 1100, 150, 1799, 337),

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
                        y: 50,
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
                        y: 820,
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