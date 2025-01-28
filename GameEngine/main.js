const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/block.png");
ASSET_MANAGER.queueDownload("./sprites/idle.png");
ASSET_MANAGER.queueDownload("./sprites/run.png");
ASSET_MANAGER.queueDownload("./sprites/jump.png");

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
	//const playerWidth = 109;  // Player sprite width
	//const playerHeight = 120; // Player sprite height

	// Position player in tile [16][2] - adjusting calculation to properly align with tiles
	//const playerX = 2 * TILE_SIZE; // Align with left edge of tile
	//const playerY = 16 * TILE_SIZE - playerHeight + TILE_SIZE; // Align with bottom of tile, adding TILE_SIZE to offset

	//console.log(`Spawning player at tile [16][2] (${playerX}, ${playerY})`);
	//gameEngine.addEntity(new Player(gameEngine, playerX, playerY));
	
	const player = new Player(gameEngine, 2 * TILE_SIZE, 1 * TILE_SIZE);
	gameEngine.addEntity(player);
	gameEngine.start();
});
