const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/temptest.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	//ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

	gameEngine.addEntity(new Player(gameEngine, 292, 500)); // remember to change this x, y when not testing

	gameEngine.init(ctx);

	gameEngine.start();
});
