let ASSET_MANAGER;
function startGame() {
    console.log("Game Starting...");
    const gameEngine = new GameEngine();
    ASSET_MANAGER = new AssetManager(); // Declared globally, accessible everywhere if I set it to const the map not gonna load when pressing start

    // block
    ASSET_MANAGER.queueDownload("./sprites/block.png");
    // player assets
    ASSET_MANAGER.queueDownload("./sprites/idle.png");
    ASSET_MANAGER.queueDownload("./sprites/walk.png");
    ASSET_MANAGER.queueDownload("./sprites/run.png");
    ASSET_MANAGER.queueDownload("./sprites/jump.png");
    ASSET_MANAGER.queueDownload("./sprites/skid.png");
    ASSET_MANAGER.queueDownload("./sprites/slide.png");
    ASSET_MANAGER.queueDownload("./sprites/wall-slide.png");
    ASSET_MANAGER.queueDownload("./sprites/crouch.png");
    ASSET_MANAGER.queueDownload("./sprites/fall.png");

    // hazard assets
    ASSET_MANAGER.queueDownload("./sprites/spike_small.png");
    ASSET_MANAGER.queueDownload("./sprites/launcher_small.png");
    ASSET_MANAGER.queueDownload("./sprites/laser_test.png");
    // level assets
    ASSET_MANAGER.queueDownload("./sprites/plat_wide.png");
    ASSET_MANAGER.queueDownload("./sprites/plat_short.png");
    ASSET_MANAGER.queueDownload("./sprites/lever_uncollected.png");
    ASSET_MANAGER.queueDownload("./sprites/lever_collected.png");
    ASSET_MANAGER.queueDownload("./sprites/exitDoor.png");

    ASSET_MANAGER.downloadAll(async () => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

        await gameEngine.init(ctx);
        gameEngine.levelConfig = new LevelConfig(gameEngine);
        gameEngine.levelConfig.loadLevel(1);
        gameEngine.start();
        await gameEngine.levelTimesManager.debugPrintAllTimes();
        // gameEngine.levelTimesManager.resetBestTime(0, 3000)
        // gameEngine.levelTimesManager.debugPrintAllTimes();
    });
}
function showLevels() {
    const levelsScreen = new LevelsScreen();
    levelsScreen.show();
}

document.addEventListener("DOMContentLoaded", () => {
    new WelcomeScreen(startGame, showLevels);
});