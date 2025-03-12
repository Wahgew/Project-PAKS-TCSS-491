class WelcomeScreen {
    constructor(startCallback, levelsCallback, aboutCallback) {
        // We'll ignore the startCallback and use our own implementation

        this.levelsCallback = levelsCallback;
        this.aboutCallback = aboutCallback;
        this.createWelcomeScreen();

        // Start playing menu music if audio manager exists
        if (window.AUDIO_MANAGER) {
            //window.AUDIO_MANAGER.playMenuMusic();
        }
    }

    createWelcomeScreen() {
        // Create container
        this.welcomeContainer = document.createElement("div");
        this.welcomeContainer.id = "welcomeScreen";
        this.welcomeContainer.style.position = "fixed";
        // Set container dimensions to the image's natural size:
        this.welcomeContainer.style.width = "980px";
        this.welcomeContainer.style.height = "743px";
        // Center the container in the viewport:
        this.welcomeContainer.style.left = "50%";
        this.welcomeContainer.style.top = "50%";
        this.welcomeContainer.style.transform = "translate(-50%, -50%)";
        this.welcomeContainer.style.backgroundColor = "transparent";
        this.welcomeContainer.style.backgroundImage = "url('./sprites/BG.webp')";
        // Zoom in the background image slightly while preserving its aspect ratio:
        this.welcomeContainer.style.backgroundSize = "100%";
        this.welcomeContainer.style.backgroundPosition = "center";
        this.welcomeContainer.style.backgroundRepeat = "no-repeat";
        this.welcomeContainer.style.display = "flex";
        this.welcomeContainer.style.flexDirection = "column";
        this.welcomeContainer.style.alignItems = "center";
        this.welcomeContainer.style.justifyContent = "center";
        this.welcomeContainer.style.textAlign = "center";
        this.welcomeContainer.style.zIndex = "2";

        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "row";
        buttonContainer.style.gap = "20px";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.alignItems = "center";

        // Define buttons - replace startCallback with goToGame
        const buttons = [
            { src: "./sprites/start.png", callback: () => this.goToGame(), width: "150px" },
            { src: "./sprites/aboutme.png", callback: this.aboutCallback, width: "120px" },
            { src: "./sprites/levels.png", callback: () => this.goToLevels(), width: "150px" }
        ];

        // Create buttons
        buttons.forEach(button => {
            const buttonImg = document.createElement("img");
            buttonImg.src = button.src;
            buttonImg.style.width = button.width;
            buttonImg.style.cursor = "pointer";
            buttonImg.style.transition = "0.3s ease-in-out";

            // Add hover effects
            buttonImg.addEventListener("mouseover", () => {
                buttonImg.style.transform = "scale(1.1) rotate(5deg)";
                buttonImg.style.filter = "drop-shadow(0 0 15px gray)";
            });
            buttonImg.addEventListener("mouseout", () => {
                buttonImg.style.transform = "scale(1)";
                buttonImg.style.filter = "none";
            });

            // About Me button uses the overlay; other buttons hide the welcome screen.
            if (button.src.includes("aboutme")) {
                buttonImg.addEventListener("click", () => {
                    this.showAboutOverlay();
                });
            } else {
                buttonImg.addEventListener("click", () => {
                    // Just hide welcome screen, transition handles the rest
                    this.hideWelcomeScreen();
                    button.callback();
                });
            }

            buttonContainer.appendChild(buttonImg);
        });

        this.welcomeContainer.appendChild(buttonContainer);
        document.body.appendChild(this.welcomeContainer);
    }

    // goToGame method to use elevator transition properly
    goToGame() {
        // Hide welcome screen first
        this.hideWelcomeScreen();

        // Force a more thorough cleanup
        emergencyCleanup();

        // Reset the canvas explicitly to ensure it's visible
        resetGameCanvas();

        // Ensure the correct level is resumed
        let levelToLoad = window.CURRENT_GAME_LEVEL || 1;
        console.log("Starting/resuming game at level:", levelToLoad);

        // Now check for elevator transition
        if (window.ELEVATOR_TRANSITION) {
            console.log("Using elevator transition to start game");
            // Check if ASSET_MANAGER is ready
            if (ASSET_MANAGER && ASSET_MANAGER.successCount >= 2) {
                // Assets are loaded, we can safely use the transition
                window.ELEVATOR_TRANSITION.transition(() => {
                    // Force render a loading screen
                    const canvas = document.getElementById("gameWorld");
                    if (canvas) {
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                            ctx.fillStyle = '#333';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = '#fff';
                            ctx.font = '24px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('Loading game...', canvas.width/2, canvas.height/2);
                        }
                    }
                    this.startOrResumeGame(levelToLoad);
                });
            } else {
                console.log("Assets not fully loaded yet, using fallback method");
                // Create a simple visual transition effect instead
                this.createSimpleTransition(() => {
                    this.startOrResumeGame(levelToLoad);
                });
            }
        } else {
            console.log("No elevator transition available, starting game directly");
            // Fallback without transition
            this.startOrResumeGame(levelToLoad);
        }
    }

// Create a simple transition when elevator transition isn't ready
    createSimpleTransition(callback) {
        // Create a simple overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        overlay.style.transition = 'background-color 0.5s ease-in-out';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);

        // Play door sound if available
        try {
            const doorSound = new Audio('./sounds/elevator-ding.mp3');
            doorSound.volume = 0.3;
            doorSound.play().catch(e => console.log("Could not play door sound:", e));
        } catch (error) {
            console.log("Could not play sound:", error);
        }

        // Fade to black
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }, 100);

        // Execute callback after fade is complete
        setTimeout(() => {
            if (callback) callback();

            // Fade back in
            setTimeout(() => {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';

                // Remove overlay when done
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 600);
            }, 100);
        }, 700);
    }

    // Modified to use elevator transition
    goToLevels() {
        // Hide welcome screen
        this.hideWelcomeScreen();

        if (window.ELEVATOR_TRANSITION) {
            console.log("Using elevator transition to show levels");
            window.ELEVATOR_TRANSITION.transition(() => {
                // After transition closes, show levels screen
                const levelsScreen = new LevelsScreen();
                levelsScreen.show();
            });
        } else {
            console.log("No elevator transition available, showing levels directly");
            // Fallback without transition
            this.levelsCallback();
        }
    }

    // Helper method to start or resume the game
    startOrResumeGame(levelToLoad) {
        // Always make sure the canvas is visible
        const gameCanvas = document.getElementById("gameWorld");
        if (gameCanvas) {
            gameCanvas.style.display = "block";
        }

        // Check if we need to start the game fresh
        if (!window.gameEngine) {
            console.log("No existing game engine, starting fresh with level:", levelToLoad);
            window.targetLevelToLoad = levelToLoad;
            startGame();
        } else {
            console.log("Using existing game engine, resuming at level:", levelToLoad);
            // Resume with existing game engine
            if (window.gameEngine.levelConfig) {
                window.gameEngine.levelConfig.currentLevel = levelToLoad;
                window.gameEngine.levelConfig.loadLevel(levelToLoad);

                // Switch music back to game music
                if (window.AUDIO_MANAGER) {
                    window.AUDIO_MANAGER.stopMenuMusic();
                    window.AUDIO_MANAGER.playGameMusic();
                }

                // Make sure the game is running
                if (!window.gameEngine.running) {
                    window.gameEngine.running = true;
                    window.gameEngine.start();
                }
            } else {
                console.error("Game engine exists but no level config found, starting fresh");
                window.targetLevelToLoad = levelToLoad;
                startGame();
            }
        }
    }

    createAboutContent() {
        return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <img src="./sprites/AboutUsNewSmall.gif" alt="Profile" style="width: 300px; border-radius: 8px; margin-bottom: 20px;">
                
                <p style="margin: 0; line-height: 1.6; font-family: 'Molot', Arial, sans-serif; font-weight: normal; font-size: 20px; color: white; text-align: center;">
                    Hello, Welcome to P.A.K.S
                </p>
            </div>
        `;
    }

    showAboutOverlay() {
        // Create backdrop to cover the welcome screen.
        const backdrop = document.createElement("div");
        backdrop.style.position = "fixed";
        backdrop.style.top = "0";
        backdrop.style.left = "0";
        backdrop.style.width = "100%";
        backdrop.style.height = "100%";
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        backdrop.style.zIndex = "1000";

        // Create and style the overlay container.
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.width = "600px";
        overlay.style.maxHeight = "80vh";
        overlay.style.backgroundColor = "rgba(40, 40, 40, 0.95)";
        overlay.style.color = "white";
        overlay.style.borderRadius = "8px";
        overlay.style.zIndex = "1001";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";

        // Create header.
        const header = document.createElement("div");
        header.style.padding = "20px";
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";

        // Add title.
        const title = document.createElement("h2");
        title.textContent = "About Me";
        title.style.margin = "0";
        title.style.fontSize = "32px";
        title.style.fontFamily = "Molot, sans-serif";
        title.style.fontWeight = "normal";
        header.appendChild(title);

        // Add close button.
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "×";
        closeButton.style.fontSize = "32px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "white";
        closeButton.style.opacity = "0.8";
        closeButton.style.transition = "opacity 0.2s";
        closeButton.style.userSelect = "none";
        closeButton.addEventListener("mouseover", () => closeButton.style.opacity = "1");
        closeButton.addEventListener("mouseout", () => closeButton.style.opacity = "0.8");
        closeButton.addEventListener("click", () => {
            overlay.remove();
            backdrop.remove();
            // Remove the blur effect from the welcome screen.
            this.welcomeContainer.style.filter = "none";
        });
        header.appendChild(closeButton);
        overlay.appendChild(header);

        // Create content container with scrollbar.
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.overflowY = "auto";
        content.style.maxHeight = "calc(80vh - 81px)"; // Account for header height.
        // Set an ID to allow for custom scrollbar styling.
        content.id = "aboutContent";
        content.innerHTML = this.createAboutContent();
        overlay.appendChild(content);

        // Add scrollbar styles.
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            #aboutContent::-webkit-scrollbar {
                width: 8px;
            }
            #aboutContent::-webkit-scrollbar-track {
                background: #333;
                border-radius: 4px;
            }
            #aboutContent::-webkit-scrollbar-thumb {
                background: #666;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(styleSheet);

        // Append backdrop and overlay to the document.
        document.body.appendChild(backdrop);
        document.body.appendChild(overlay);

        // Apply a blur effect to the welcome screen.
        this.welcomeContainer.style.filter = "blur(3px)";
    }

    hideWelcomeScreen() {
        this.welcomeContainer.style.display = "none";
    }

    showWelcomeScreen() {
        this.welcomeContainer.style.display = "flex";

        // Ensure we're playing menu music when returning to welcome screen
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
    }
}

class ElevatorDoorSequence {
    constructor(callback) {
        this.callback = callback;
        // Prevent audio from playing automatically
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopMenuMusic();
        }
        this.createDoorSequence();
    }

    createDoorSequence() {
        // Create container
        this.container = document.createElement("div");
        this.container.style.position = "fixed";
        this.container.style.top = "0";
        this.container.style.left = "0";
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.style.backgroundColor = "#111";
        this.container.style.zIndex = "9999"; // Very high z-index to ensure it's on top
        this.container.style.display = "flex";
        this.container.style.justifyContent = "center";
        this.container.style.alignItems = "center";
        this.container.style.cursor = "pointer";

        // Main container with game dimensions
        const gameContainer = document.createElement("div");
        gameContainer.style.position = "relative";
        gameContainer.style.width = "1024px"; // Match game canvas
        gameContainer.style.height = "768px"; // Match game canvas
        gameContainer.style.maxWidth = "90vw";
        gameContainer.style.maxHeight = "90vh";
        gameContainer.style.display = "flex";
        gameContainer.style.justifyContent = "center";
        gameContainer.style.alignItems = "center";

        // Create elevator frame/threshold (outer frame)
        const elevatorFrame = document.createElement("div");
        elevatorFrame.style.position = "relative";
        elevatorFrame.style.width = "600px";
        elevatorFrame.style.height = "500px";
        elevatorFrame.style.backgroundColor = "#333";
        elevatorFrame.style.border = "10px solid #8a8a8a";
        elevatorFrame.style.borderRadius = "5px";
        elevatorFrame.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.7)";

        // PAKS indicator panel - firmly attach it to the elevator frame
        const namePanel = document.createElement("div");
        namePanel.style.position = "absolute";
        namePanel.style.top = "-40px";
        namePanel.style.left = "50%";
        namePanel.style.transform = "translateX(-50%)";
        namePanel.style.width = "150px";
        namePanel.style.height = "30px";
        namePanel.style.backgroundColor = "#222";
        namePanel.style.border = "3px solid #8a8a8a";
        namePanel.style.borderRadius = "3px";
        namePanel.style.display = "flex";
        namePanel.style.justifyContent = "center";
        namePanel.style.alignItems = "center";
        namePanel.style.zIndex = "9999"; // Ensure visibility

        // Create digital PAKS display
        const paksDisplay = document.createElement("div");
        paksDisplay.style.width = "130px";
        paksDisplay.style.height = "20px";
        paksDisplay.style.backgroundColor = "#00cc00";
        paksDisplay.style.fontFamily = "monospace";
        paksDisplay.style.fontWeight = "bold";
        paksDisplay.style.fontSize = "16px";
        paksDisplay.style.color = "#003300";
        paksDisplay.style.display = "flex";
        paksDisplay.style.justifyContent = "center";
        paksDisplay.style.alignItems = "center";
        paksDisplay.innerHTML = "P.A.K.S"; // Using innerHTML to ensure text appears
        paksDisplay.style.boxShadow = "0 0 10px rgba(0, 204, 0, 0.7)";
        namePanel.appendChild(paksDisplay);

        // Doors container - this holds both sliding doors
        const doorsContainer = document.createElement("div");
        doorsContainer.style.position = "absolute";
        doorsContainer.style.width = "92%";
        doorsContainer.style.height = "94%";
        doorsContainer.style.top = "3%";
        doorsContainer.style.left = "4%";
        doorsContainer.style.overflow = "hidden"; // Important: hide doors when they slide
        doorsContainer.style.backgroundColor = "#444";

        // Create left door
        this.leftDoor = document.createElement("div");
        this.leftDoor.style.height = "100%";
        this.leftDoor.style.width = "50%";
        this.leftDoor.style.backgroundColor = "#a0a0a0";
        this.leftDoor.style.position = "absolute";
        this.leftDoor.style.left = "0";
        this.leftDoor.style.top = "0";
        this.leftDoor.style.transition = "transform 1.5s ease-in-out";
        this.leftDoor.style.borderRight = "2px solid #888";
        this.leftDoor.style.boxShadow = "inset 0 0 10px rgba(0, 0, 0, 0.5)";

        // Create right door
        this.rightDoor = document.createElement("div");
        this.rightDoor.style.height = "100%";
        this.rightDoor.style.width = "50%";
        this.rightDoor.style.backgroundColor = "#a0a0a0";
        this.rightDoor.style.position = "absolute";
        this.rightDoor.style.right = "0";
        this.rightDoor.style.top = "0";
        this.rightDoor.style.transition = "transform 1.5s ease-in-out";
        this.rightDoor.style.borderLeft = "2px solid #888";
        this.rightDoor.style.boxShadow = "inset 0 0 10px rgba(0, 0, 0, 0.5)";

        // Add horizontal lines to doors to make them look more like elevator doors
        for (let i = 1; i < 10; i++) {
            const leftLine = document.createElement("div");
            leftLine.style.position = "absolute";
            leftLine.style.width = "100%";
            leftLine.style.height = "1px";
            leftLine.style.backgroundColor = "#888";
            leftLine.style.top = `${i * 10}%`;

            const rightLine = document.createElement("div");
            rightLine.style.position = "absolute";
            rightLine.style.width = "100%";
            rightLine.style.height = "1px";
            rightLine.style.backgroundColor = "#888";
            rightLine.style.top = `${i * 10}%`;

            this.leftDoor.appendChild(leftLine);
            this.rightDoor.appendChild(rightLine);
        }

        // Create call button panel on the side
        const callButtonPanel = document.createElement("div");
        callButtonPanel.style.position = "absolute";
        callButtonPanel.style.right = "-70px";
        callButtonPanel.style.top = "50%";
        callButtonPanel.style.transform = "translateY(-50%)";
        callButtonPanel.style.width = "50px";
        callButtonPanel.style.height = "120px";
        callButtonPanel.style.backgroundColor = "#333";
        callButtonPanel.style.border = "4px solid #555";
        callButtonPanel.style.borderRadius = "5px";
        callButtonPanel.style.display = "flex";
        callButtonPanel.style.flexDirection = "column";
        callButtonPanel.style.alignItems = "center";
        callButtonPanel.style.justifyContent = "space-evenly";
        callButtonPanel.style.padding = "10px 0";
        callButtonPanel.style.zIndex = "9999"; // Ensure visibility

        // Up button
        const upButton = document.createElement("div");
        upButton.style.width = "35px";
        upButton.style.height = "35px";
        upButton.style.backgroundColor = "#222";
        upButton.style.border = "2px solid #666";
        upButton.style.borderRadius = "50%";
        upButton.style.display = "flex";
        upButton.style.justifyContent = "center";
        upButton.style.alignItems = "center";
        upButton.style.cursor = "pointer";
        upButton.style.marginBottom = "10px";

        // Up arrow symbol
        const upArrow = document.createElement("div");
        upArrow.innerHTML = "▲"; // Simple unicode triangle
        upArrow.style.color = "#aaa";
        upArrow.style.fontSize = "14px";
        upButton.appendChild(upArrow);

        // Down button
        const downButton = document.createElement("div");
        downButton.style.width = "35px";
        downButton.style.height = "35px";
        downButton.style.backgroundColor = "#222";
        downButton.style.border = "2px solid #666";
        downButton.style.borderRadius = "50%";
        downButton.style.display = "flex";
        downButton.style.justifyContent = "center";
        downButton.style.alignItems = "center";
        downButton.style.cursor = "pointer";

        // Down arrow symbol
        const downArrow = document.createElement("div");
        downArrow.innerHTML = "▼"; // Simple unicode triangle
        downArrow.style.color = "#aaa";
        downArrow.style.fontSize = "14px";
        downButton.appendChild(downArrow);

        // Make one button appear pressed
        const randomButton = Math.random() > 0.5 ? upButton : downButton;
        randomButton.style.backgroundColor = "#ffcc00";
        randomButton.querySelector("div").style.color = "#333";
        randomButton.style.boxShadow = "0 0 10px #ffcc00";

        // Add buttons to panel
        callButtonPanel.appendChild(upButton);
        callButtonPanel.appendChild(downButton);

        // Add button handlers for opening doors
        upButton.addEventListener("click", (e) => {
            e.stopPropagation();
            this.openDoors();
        });

        downButton.addEventListener("click", (e) => {
            e.stopPropagation();
            this.openDoors();
        });

        // Create prompt text
        this.prompt = document.createElement("div");
        this.prompt.style.position = "absolute";
        this.prompt.style.bottom = "50px";
        this.prompt.style.width = "100%";
        this.prompt.style.textAlign = "center";
        this.prompt.style.color = "#ffcc00";
        this.prompt.style.fontFamily = "monospace";
        this.prompt.style.fontSize = "24px";
        this.prompt.style.textShadow = "0 0 10px rgba(255, 204, 0, 0.5)";
        this.prompt.innerHTML = "Click or press any key to open doors";
        this.prompt.style.zIndex = "10000"; // Ensure visibility

        // Assembly in proper order - doors go into doors container
        doorsContainer.appendChild(this.leftDoor);
        doorsContainer.appendChild(this.rightDoor);

        // Add everything to the elevator frame
        elevatorFrame.appendChild(doorsContainer);
        elevatorFrame.appendChild(namePanel);
        elevatorFrame.appendChild(callButtonPanel);

        // Add elevator to game container
        gameContainer.appendChild(elevatorFrame);
        gameContainer.appendChild(this.prompt);

        // Add everything to main container
        this.container.appendChild(gameContainer);

        // Add to body
        document.body.appendChild(this.container);

        console.log("Elevator door sequence created");

        // Handle interaction
        this.container.addEventListener("click", () => this.openDoors());
        document.addEventListener("keydown", (e) => {
            if (this.container.parentNode) {
                this.openDoors();
            }
        });
    }

    openDoors() {
        // Prevent multiple clicks
        if (this.doorsOpening) return;
        this.doorsOpening = true;

        console.log("Opening doors...");

        // Hide prompt
        this.prompt.style.display = "none";

        // Play door ding sound if available
        const doorSound = new Audio('./sounds/elevator-ding.mp3');
        doorSound.volume = 0.3;
        doorSound.play().catch(e => console.log("Could not play door sound:", e));

        // Animate doors opening
        setTimeout(() => {
            this.leftDoor.style.transform = "translateX(-100%)";
            this.rightDoor.style.transform = "translateX(100%)";
            console.log("Door animation started");
        }, 200); // Short delay after the ding

        // Start menu music when doors start opening
        setTimeout(() => {
            if (window.AUDIO_MANAGER) {
                window.AUDIO_MANAGER.playMenuMusic();
                console.log("Menu music started");
            }
        }, 500); // Slight delay so the ding can be heard first

        // Remove container after animation
        setTimeout(() => {
            this.container.remove();
            console.log("Elevator door sequence removed");
            if (this.callback) this.callback();
        }, 2000); // Give enough time for doors to fully open
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing elevator door sequence");

    // Show the elevator door sequence first
    new ElevatorDoorSequence(() => {
        console.log("Doors opened, game ready");
    });
});