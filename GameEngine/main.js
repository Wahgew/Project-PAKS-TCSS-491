function startGame() {
    console.log("Game Starting...");
	const gameEngine = new GameEngine();
	ASSET_MANAGER = new AssetManager(); // Declared globally, accessible everywhere if I set it to const the map not gonna load when pressing start

	ASSET_MANAGER.queueDownload("./sprites/block.png");
	ASSET_MANAGER.queueDownload("./sprites/idle.png");
	ASSET_MANAGER.queueDownload("./sprites/run.png");
	ASSET_MANAGER.queueDownload("./sprites/jump.png");
	ASSET_MANAGER.queueDownload("./sprites/temptest.png");
	ASSET_MANAGER.queueDownload("./sprites/spike_small.png");
	ASSET_MANAGER.queueDownload("./sprites/launcher_small.png");
	ASSET_MANAGER.queueDownload("./sprites/tempproj3.png");
	ASSET_MANAGER.queueDownload("./sprites/laser_test.png");
	ASSET_MANAGER.queueDownload("./sprites/slide.png");
	ASSET_MANAGER.queueDownload("./sprites/walk.png");

	ASSET_MANAGER.queueDownload("./sprites/Rwalk.png");
	ASSET_MANAGER.queueDownload("./sprites/Rrun.png");
	ASSET_MANAGER.queueDownload("./sprites/Rslide.png");
	ASSET_MANAGER.queueDownload("./sprites/Rjump.png");
	ASSET_MANAGER.queueDownload("./sprites/plat_wide.png");
	ASSET_MANAGER.queueDownload("./sprites/plat_short.png");
	ASSET_MANAGER.queueDownload("./sprites/lever_uncollected.png");
	ASSET_MANAGER.queueDownload("./sprites/lever_collected.png");
	ASSET_MANAGER.queueDownload("./sprites/exitDoor.png");

	ASSET_MANAGER.queueDownload("./sprites/background.gif");

	ASSET_MANAGER.downloadAll(() => {
		const canvas = document.getElementById("gameWorld");
		const ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

		gameEngine.init(ctx);

		// Create map with tile size (adjust size as needed)
		// const TILE_SIZE = 25;
		// const map = new testMap(TILE_SIZE);
		// gameEngine.addEntity(map);

		// Player position calculations
		//const playerWidth = 109;  // Player sprite width
		//const playerHeight = 120; // Player sprite height

		// Position player in tile [16][2] - adjusting calculation to properly align with tiles
		//const playerX = 2 * TILE_SIZE; // Align with left edge of tile
		//const playerY = 16 * TILE_SIZE - playerHeight + TILE_SIZE; // Align with bottom of tile, adding TILE_SIZE to offset

		//console.log(`Spawning player at tile [16][2] (${playerX}, ${playerY})`);
		//gameEngine.addEntity(new Player(gameEngine, playerX, playerY));

		// const player = new Player(gameEngine, 75, 400);
		// gameEngine.addEntity(player);
		// gameEngine.addEntity(new Spike({gameEngine, x: 100, y: 100, speed: 50, moving: true, direction: null, tracking: true, reverseTime: 0}));
		// gameEngine.addEntity(new Spike({gameEngine, x: 500, y: 125, speed: 100, moving: true, direction: "LEFT", tracking: false, reverseTime: 4}));
		// gameEngine.addEntity(new Spike({gameEngine, x: 350, y: 125, speed: 0, moving: false, direction: null, tracking: false, reverseTime: 0}));
		// gameEngine.addEntity(new ProjectileLauncher({gameEngine, x: 975, y: 325, speed: 0, moving: false, direction: null,
		// 													reverseTime: 0, atkspd: 2, projspd: 100, shotdirec: "LEFT"}));
		// gameEngine.addEntity(new Laser({gameEngine, x: 25, y: 50, speed: 20, moving: true, direction: "DOWN", shotdirec: "RIGHT", length: 975})); sorta works but looks jank.



		gameEngine.levelConfig = new LevelConfig(gameEngine);
		gameEngine.levelConfig.loadLevel(1);
		gameEngine.start();

	});
}
ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

	gameEngine.init(ctx);
	gameEngine.levelConfig = new LevelConfig(gameEngine);
	gameEngine.levelConfig.loadLevel(0);
	gameEngine.start();
	gameEngine.levelTimesManager.debugPrintAllTimes();
	// gameEngine.levelTimesManager.resetBestTime(0, 3000)
	// gameEngine.levelTimesManager.debugPrintAllTimes();
});

document.addEventListener("DOMContentLoaded", () => {
    new WelcomeScreen(startGame);
});