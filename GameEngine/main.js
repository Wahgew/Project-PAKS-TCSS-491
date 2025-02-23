let ASSET_MANAGER;
function startGame() {
    console.log("Game Starting...");
    const gameEngine = new GameEngine();
    ASSET_MANAGER = new AssetManager(); // Declared globally, accessible everywhere if I set it to const the map not gonna load when pressing start

    ASSET_MANAGER.queueDownload("./sprites/block.png");
    ASSET_MANAGER.queueDownload("./sprites/block2.png");
    ASSET_MANAGER.queueDownload("./sprites/block3.png");
    ASSET_MANAGER.queueDownload("./sprites/block4.png");
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

<<<<<<< Updated upstream
    ASSET_MANAGER.queueDownload("./sprites/Rwalk.png");
    ASSET_MANAGER.queueDownload("./sprites/Rrun.png");
    ASSET_MANAGER.queueDownload("./sprites/Rslide.png");
    ASSET_MANAGER.queueDownload("./sprites/Rjump.png");
    ASSET_MANAGER.queueDownload("./sprites/plat_wide.png");
    ASSET_MANAGER.queueDownload("./sprites/plat_short.png");
    ASSET_MANAGER.queueDownload("./sprites/lever_uncollected.png");
    ASSET_MANAGER.queueDownload("./sprites/lever_collected.png");
    ASSET_MANAGER.queueDownload("./sprites/exitDoor.png");
    ASSET_MANAGER.queueDownload("./sprites/elevator_right.png");
    ASSET_MANAGER.queueDownload("./sprites/elevator_left.png");
=======
ASSET_MANAGER.queueDownload("./sprites/block.png");
ASSET_MANAGER.queueDownload("./sprites/block2.png");
ASSET_MANAGER.queueDownload("./sprites/block3.png");
ASSET_MANAGER.queueDownload("./sprites/block4.png");
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
>>>>>>> Stashed changes

    ASSET_MANAGER.downloadAll(() => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

        gameEngine.init(ctx);
        gameEngine.levelConfig = new LevelConfig(gameEngine);
        gameEngine.levelConfig.loadLevel(1);
        gameEngine.start();
        gameEngine.levelTimesManager.debugPrintAllTimes();
        // gameEngine.levelTimesManager.resetBestTime(0, 3000)
        // gameEngine.levelTimesManager.debugPrintAllTimes();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    new WelcomeScreen(startGame);
});