let ASSET_MANAGER;
function startGame() {
    console.log("Game Starting...");

    // First clean up any existing game engine
    if (window.gameEngine) {
        console.log("Cleaning up existing game engine");
        if (window.gameEngine.running) {
            window.gameEngine.running = false;
        }
        if (window.gameEngine.timer) {
            window.gameEngine.timer.stop();
        }

        // Completely null out all entities
        if (window.gameEngine.entities) {
            // Explicitly remove any event listeners on entities
            window.gameEngine.entities = [];
        }

        // Clear key states
        window.gameEngine.keys = {};

        // Remove references to the engine
        window.gameEngine = null;
    }

    // Reset the canvas to ensure it's visible
    resetGameCanvas();

    // Create new game engine
    const gameEngine = new GameEngine();
    window.gameEngine = gameEngine; // Ensure it's globally accessible

    // If ASSET_MANAGER was already initialized, don't reinitialize it
    if (!ASSET_MANAGER) {
        ASSET_MANAGER = new AssetManager();

        // Load transition assets first (priority loading)
        ASSET_MANAGER.queueDownload("./sprites/elevator_left.png");
        ASSET_MANAGER.queueDownload("./sprites/elevator_right.png");

        // Download just these two assets first
        ASSET_MANAGER.downloadAll(() => {
            console.log("Transition assets loaded successfully");

            // Now that transition assets are loaded, initialize the transition manager
            if (window.ELEVATOR_TRANSITION) {
                window.ELEVATOR_TRANSITION.init();
                console.log("Elevator transition system initialized with priority assets");
            }

            // Continue with loading the rest of the game assets
            loadGameAssets(gameEngine);
        });
    } else {
        // Always refresh the canvas context before using existing asset manager
        const canvas = document.getElementById("gameWorld");
        if (canvas) {
            // Re-acquire a fresh context
            const ctx = canvas.getContext("2d", { alpha: false }); // Force non-transparent canvas
            if (ctx) {
                // Force a visible reset
                ctx.fillStyle = '#222222';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Check if we need to queue more assets
        if (ASSET_MANAGER.downloadQueue.length < 2) {
            // May need to reload transition assets
            if (!ASSET_MANAGER.getAsset("./sprites/elevator_left.png")) {
                ASSET_MANAGER.queueDownload("./sprites/elevator_left.png");
            }
            if (!ASSET_MANAGER.getAsset("./sprites/elevator_right.png")) {
                ASSET_MANAGER.queueDownload("./sprites/elevator_right.png");
            }

            ASSET_MANAGER.downloadAll(() => {
                // Initialize transition system if needed
                if (window.ELEVATOR_TRANSITION && !window.ELEVATOR_TRANSITION.isInitialized) {
                    window.ELEVATOR_TRANSITION.init();
                }

                // Load game assets
                loadGameAssets(gameEngine);
            });
        } else {
            // ASSET_MANAGER already exists with assets, just load game assets
            loadGameAssets(gameEngine);
        }
    }
}

// Separate function to load game assets
function loadGameAssets(gameEngine) {
    // "block/tiles"
    ASSET_MANAGER.queueDownload("./sprites/block.png");
    ASSET_MANAGER.queueDownload("./sprites/block2.png");
    ASSET_MANAGER.queueDownload("./sprites/block3.png");
    ASSET_MANAGER.queueDownload("./sprites/block4.png");
    ASSET_MANAGER.queueDownload("./sprites/block5_forestgreen.png")
    ASSET_MANAGER.queueDownload("./sprites/block6_amber.png")
    ASSET_MANAGER.queueDownload("./sprites/block7_ocean.png")
    ASSET_MANAGER.queueDownload("./sprites/block8_burgundy.png")
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

    // Note: transition assets were already loaded in the first phase

    ASSET_MANAGER.downloadAll(async () => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false; // uncomment this if we're using pixel art

        await gameEngine.init(ctx);
        gameEngine.levelConfig = new LevelConfig(gameEngine);

        // The transition manager should already be initialized
        console.log("All game assets loaded successfully");

        // Initialize the game menu
        if (!window.GAME_MENU) {
            window.GAME_MENU = new GameMenu(gameEngine);
        }
        window.GAME_MENU.show();

        // Check if a specific level was requested
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

    if (window.ELEVATOR_TRANSITION) {
        console.log("Using elevator transition to show levels");
        // Use the elevator transition
        window.ELEVATOR_TRANSITION.transition(() => {
            // Hide game canvas
            const gameCanvas = document.getElementById('gameWorld');
            if (gameCanvas) {
                gameCanvas.style.display = 'none';
            }

            // Show the levels screen
            const levelsScreen = new LevelsScreen();
            levelsScreen.show();
        });
    } else {
        console.log("No elevator transition available, showing levels directly");
        // Fallback without transition
        // Hide game canvas
        const gameCanvas = document.getElementById('gameWorld');
        if (gameCanvas) {
            gameCanvas.style.display = 'none';
        }

        // Show the levels screen
        const levelsScreen = new LevelsScreen();
        levelsScreen.show();
    }
}

function emergencyCleanup() {
    console.log("Emergency cleanup initiated");

    // Stop animation frame loop
    if (window.gameEngine && window.gameEngine.running) {
        window.gameEngine.running = false;
    }

    // Stop any timers
    if (window.gameEngine && window.gameEngine.timer) {
        try {
            window.gameEngine.timer.stop();
            window.gameEngine.timer.isRunning = false;
        } catch(e) {
            console.error("Error stopping timer:", e);
        }
    }

    // Stop any key event handling
    if (window.gameEngine) {
        window.gameEngine.keys = {};
    }

    // Clear game canvas
    const gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas) {
        try {
            const ctx = gameCanvas.getContext("2d");
            if (ctx) {
                // Reset any transformations
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

                // Force a visible background to show it's working
                ctx.fillStyle = "#111";
                ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            }

            // Ensure canvas is visible
            gameCanvas.style.display = "block";
            gameCanvas.style.zIndex = "1"; // Reset z-index
        } catch(e) {
            console.error("Error clearing canvas:", e);
        }
    }

    // Remove any event listeners that might be causing issues
    try {
        // Replace the canvas with a clone to remove event listeners
        if (gameCanvas) {
            const oldCanvas = gameCanvas;
            const newCanvas = oldCanvas.cloneNode(true);
            oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

            // Re-add any necessary default event listeners to the new canvas
            newCanvas.addEventListener("click", (e) => {
                console.log("Canvas click detected");
            });
        }
    } catch(e) {
        console.error("Error cleaning up event listeners:", e);
    }

    // Handle audio transitions
    if (window.AUDIO_MANAGER) {
        try {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        } catch(e) {
            console.error("Error handling audio:", e);
        }
    }

    // Modify transition system state if needed
    if (window.ELEVATOR_TRANSITION && window.ELEVATOR_TRANSITION.isTransitioning) {
        try {
            // Force finish any hanging transitions
            window.ELEVATOR_TRANSITION.isTransitioning = false;

            // Reset door positions
            if (window.ELEVATOR_TRANSITION.leftDoorCanvas) {
                window.ELEVATOR_TRANSITION.leftDoorCanvas.style.left = "-960px";
            }
            if (window.ELEVATOR_TRANSITION.rightDoorCanvas) {
                window.ELEVATOR_TRANSITION.rightDoorCanvas.style.right = "-960px";
            }

            console.log("Forced elevator transition reset");
        } catch(e) {
            console.error("Error resetting transition:", e);
        }
    }

    // Clear all references to the game engine
    window.gameEngine = null;

    // Force garbage collection hint
    setTimeout(() => {
        console.log("Emergency cleanup complete");
    }, 100);

    return true;
}

function resetGameCanvas() {
    const canvas = document.getElementById("gameWorld");
    if (!canvas) return false;

    // Make sure canvas is visible
    canvas.style.display = "block";

    // Get a fresh context - this is crucial
    const ctx = canvas.getContext("2d");

    // Clear any transformations that might be persisting
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear the canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Force a visible background to confirm rendering is working
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log("Canvas reset and confirmed visible");
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the asset manager for early loading of transition assets
    if (!ASSET_MANAGER) {
        ASSET_MANAGER = new AssetManager();

        // Load transition assets immediately
        ASSET_MANAGER.queueDownload("./sprites/elevator_left.png");
        ASSET_MANAGER.queueDownload("./sprites/elevator_right.png");

        // Download these assets before anything else
        ASSET_MANAGER.downloadAll(() => {
            console.log("Transition assets loaded on DOM Content Loaded");

            // Initialize the transition manager
            if (window.ELEVATOR_TRANSITION) {
                window.ELEVATOR_TRANSITION.init();
                console.log("Elevator transition system initialized early");
            }

            // Continue with DOM Content Loaded sequence
            initializeGameComponents();
        });
    } else {
        // Asset manager already exists, just continue
        initializeGameComponents();
    }
});

// Function to initialize other game components
function initializeGameComponents() {
    // Initialize audio settings
    if (window.AUDIO_MANAGER) {
        window.AUDIO_MANAGER.loadVolumeSettings();
    }

    // Create welcome screen with callbacks
    new WelcomeScreen(startGame, showLevels);

    // Create volume button
    createVolumeToggleButton();

    // Add keyboard shortcut for volume panel
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm') {
            console.log("M key pressed");
            if (window.VOLUME_CONTROL) {
                console.log("Toggling volume control via keyboard");
                window.VOLUME_CONTROL.toggle();
            }
        }
    });
}

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