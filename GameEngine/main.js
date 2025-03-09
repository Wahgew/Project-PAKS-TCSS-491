let ASSET_MANAGER;
function startGame() {
    console.log("Game Starting...");
    const gameEngine = new GameEngine();
    ASSET_MANAGER = new AssetManager(); // Declared globally, accessible everywhere if I set it to const the map not gonna load when pressing start

    // "block/tiles"
    ASSET_MANAGER.queueDownload("./sprites/block.png");
    ASSET_MANAGER.queueDownload("./sprites/block2.png");
    ASSET_MANAGER.queueDownload("./sprites/block3.png");
    ASSET_MANAGER.queueDownload("./sprites/block4.png");
    // player assets
    ASSET_MANAGER.queueDownload("./sprites/bigblock.png");
    ASSET_MANAGER.queueDownload("./sprites/idle.png");
    ASSET_MANAGER.queueDownload("./sprites/walk.png");
    ASSET_MANAGER.queueDownload("./sprites/run.png");
    ASSET_MANAGER.queueDownload("./sprites/jump.png");
    ASSET_MANAGER.queueDownload("./sprites/skid.png");
    ASSET_MANAGER.queueDownload("./sprites/slide.png");
    ASSET_MANAGER.queueDownload("./sprites/wall-slide.png");
    ASSET_MANAGER.queueDownload("./sprites/crouch.png");
    ASSET_MANAGER.queueDownload("./sprites/fall.png");
    ASSET_MANAGER.queueDownload("./sprites/menu.png");

    // hazard assets
    ASSET_MANAGER.queueDownload("./sprites/spike_small.png");
    ASSET_MANAGER.queueDownload("./sprites/proj_small.png");
    ASSET_MANAGER.queueDownload("./sprites/launcher_small.png");
    // level assets
    ASSET_MANAGER.queueDownload("./sprites/plat_wide.png");
    ASSET_MANAGER.queueDownload("./sprites/plat_short.png");
    ASSET_MANAGER.queueDownload("./sprites/leverOn.png");
    ASSET_MANAGER.queueDownload("./sprites/leverOff.png");
    ASSET_MANAGER.queueDownload("./sprites/exit_door_locked.png");
    ASSET_MANAGER.queueDownload("./sprites/exit_door_unlocked.png");
    // transitions
    ASSET_MANAGER.queueDownload("./sprites/elevator_left.png");
    ASSET_MANAGER.queueDownload("./sprites/elevator_right.png");

    ASSET_MANAGER.downloadAll(async () => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

        await gameEngine.init(ctx);
        gameEngine.levelConfig = new LevelConfig(gameEngine);
        gameEngine.levelConfig.loadLevel(1);
        
        if (!window.GAME_MENU) {
            window.GAME_MENU = new GameMenu(gameEngine);
        }
        window.GAME_MENU.show();

        // Check if a specific level was requested from LevelsScreen
        // I replaced the hardcoded set to level 1
        if (window.targetLevelToLoad !== undefined) {
            // Load the level that was requested from LevelsScreen
            gameEngine.levelConfig.currentLevel = window.targetLevelToLoad;
            gameEngine.levelConfig.loadLevel(window.targetLevelToLoad);
        } else {
            // Default to level 1 if no specific level was requested
            gameEngine.levelConfig.loadLevel(1);
        }

        // Switch from menu music to game music
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopMenuMusic();
            window.AUDIO_MANAGER.playGameMusic();
        }

        gameEngine.start();
        await gameEngine.levelTimesManager.debugPrintAllTimes();
        // gameEngine.levelTimesManager.resetBestTime(0, 3000)
        // gameEngine.levelTimesManager.debugPrintAllTimes();
    });
}

function showLevels() {
    // Hide game menu if it exists
    if (window.GAME_MENU) {
        window.GAME_MENU.hide();
    }
    
    // Hide game canvas
    const gameCanvas = document.getElementById('gameWorld');
    if (gameCanvas) {
        gameCanvas.style.display = 'none';
    }
    
    const levelsScreen = new LevelsScreen();
    levelsScreen.show();
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize audio settings when the DOM is loaded
    if (window.AUDIO_MANAGER) {
        window.AUDIO_MANAGER.loadVolumeSettings();
    }

    // Create welcome screen with start game and show levels callbacks
    new WelcomeScreen(startGame, showLevels);

    function createVolumeToggleButton() {
        console.log("Creating volume toggle button");

        const volumeToggleBtn = document.createElement('button');
        volumeToggleBtn.innerHTML = '🎵';
        volumeToggleBtn.style.position = 'fixed';
        volumeToggleBtn.style.top = '20px';
        volumeToggleBtn.style.right = '20px';
        volumeToggleBtn.style.backgroundColor = '#333';
        volumeToggleBtn.style.color = '#ffcc00';
        volumeToggleBtn.style.border = '2px solid #555';
        volumeToggleBtn.style.borderRadius = '5px';
        volumeToggleBtn.style.padding = '5px 10px';
        volumeToggleBtn.style.cursor = 'pointer';
        volumeToggleBtn.style.zIndex = '1000';
        volumeToggleBtn.style.fontSize = '16px';
        volumeToggleBtn.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        // Add a class name to help with styling and debugging
        volumeToggleBtn.className = 'volume-toggle-button';

        // Add a hover effect
        volumeToggleBtn.onmouseover = function() {
            this.style.backgroundColor = '#444';
            this.style.boxShadow = '0 0 15px rgba(255, 204, 0, 0.3)';
        };

        volumeToggleBtn.onmouseout = function() {
            this.style.backgroundColor = '#333';
            this.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        };

        // Add onclick handler with explicit debug
        volumeToggleBtn.onclick = function() {
            console.log("Volume button clicked");
            if (window.VOLUME_CONTROL) {
                console.log("VOLUME_CONTROL exists, calling toggle()");
                window.VOLUME_CONTROL.toggle();
            } else {
                console.error("VOLUME_CONTROL is undefined");
                // Fallback: create volume control if it doesn't exist
                window.VOLUME_CONTROL = new VolumeControl();
                setTimeout(() => {
                    if (window.VOLUME_CONTROL) {
                        window.VOLUME_CONTROL.show();
                    }
                }, 100);
            }
        };

        document.body.appendChild(volumeToggleBtn);
        console.log("Volume toggle button added to document body");
        return volumeToggleBtn;
    }

    createVolumeToggleButton();

    // Add keyboard shortcut for volume panel (M key)
    // Add keyboard shortcut for volume panel (M key)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm') {
            console.log("M key pressed");
            if (window.VOLUME_CONTROL) {
                console.log("Toggling volume control via keyboard");
                window.VOLUME_CONTROL.toggle();
            }
        }
    });
});