const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/block.png");
ASSET_MANAGER.queueDownload("./sprites/temptest.png");
ASSET_MANAGER.queueDownload("./sprites/spike_small.png");
ASSET_MANAGER.queueDownload("./sprites/launcher_small.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art
	
	gameEngine.init(ctx);

	// Create map with tile size (adjust size as needed)
	const TILE_SIZE = 25;
	const map = new testMap(TILE_SIZE);
	gameEngine.addEntity(map);

	// Player position calculations
	const playerWidth = 109;  // Player sprite width
	const playerHeight = 120; // Player sprite height

	// Position player in tile [16][2] - adjusting calculation to properly align with tiles
	const playerX = 2 * TILE_SIZE; // Align with left edge of tile
	const playerY = 16 * TILE_SIZE - playerHeight + TILE_SIZE; // Align with bottom of tile, adding TILE_SIZE to offset

	console.log(`Spawning player at tile [16][2] (${playerX}, ${playerY})`);
	gameEngine.addEntity(new Player(gameEngine, playerX, playerY));
	gameEngine.addEntity(new Spike({gameEngine, x: 500, y: 250, speed: 50, moving: true, direction: null, tracking: true, reverseTime: 0}));
	gameEngine.addEntity(new Spike({gameEngine, x: 500, y: 125, speed: 100, moving: true, direction: "LEFT", tracking: false, reverseTime: 400}));
	gameEngine.addEntity(new Spike({gameEngine, x: 350, y: 125, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}));
	gameEngine.addEntity(new ProjectileLauncher({gameEngine, x: 975, y: 325, speed: 0, moving: false, direction: false, reverseTime: 0}));
	
	gameEngine.start();
});
