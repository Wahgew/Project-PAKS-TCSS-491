const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/block.png");
ASSET_MANAGER.queueDownload("./sprites/temptest.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	//ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art


	// Create map with tile size (adjust size as needed)
	const TILE_SIZE = 25;
	const map = new testMap(TILE_SIZE);
	gameEngine.addEntity(map);

	// Player position calculations
	const playerWidth = 219;  // Player sprite width
	const playerHeight = 240; // Player sprite height

	// Position player in tile [16][2] - adjusting calculation to properly align with tiles
	const playerX = 2 * TILE_SIZE; // Align with left edge of tile
	const playerY = 16 * TILE_SIZE - playerHeight + TILE_SIZE; // Align with bottom of tile, adding TILE_SIZE to offset

	console.log(`Spawning player at tile [16][2] (${playerX}, ${playerY})`);
	gameEngine.addEntity(new Player(gameEngine, playerX, playerY));

	gameEngine.init(ctx);
	gameEngine.start();
});
