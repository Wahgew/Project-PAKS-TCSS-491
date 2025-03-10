// Global variable to track current level across game states
window.CURRENT_GAME_LEVEL = 1;

class LevelsScreen {
    constructor(currentLevel) {
        // Use the provided current level or get it from the global variable if available
        this.currentLevel = currentLevel || window.CURRENT_GAME_LEVEL || 1;
        this.levelButtons = []; // Store references to level buttons
        
        // Create progress manager instance if it doesn't exist yet
        if (!window.LEVEL_PROGRESS) {
            window.LEVEL_PROGRESS = new LevelProgressManager();
        }
        
        console.log("LevelsScreen initialized with level:", this.currentLevel);
        
        this.createLevelsScreen();
    }

    createLevelsScreen() {
        // Create container
        this.levelsContainer = document.createElement("div");
        this.levelsContainer.id = "levelsScreen";
        this.levelsContainer.style.position = "fixed";
        this.levelsContainer.style.width = "980px";
        this.levelsContainer.style.height = "743px";
        this.levelsContainer.style.left = "50%";
        this.levelsContainer.style.top = "50%";
        this.levelsContainer.style.transform = "translate(-50%, -50%)";
        this.levelsContainer.style.backgroundColor = "transparent";
        this.levelsContainer.style.backgroundImage = "url('./sprites/levelBackground.jpg')";
        this.levelsContainer.style.backgroundSize = "100%"; 
        this.levelsContainer.style.backgroundPosition = "center";
        this.levelsContainer.style.backgroundRepeat = "no-repeat";
        this.levelsContainer.style.display = "none"; 
        this.levelsContainer.style.zIndex = "3";

        // Manually create 12 level buttons
        this.createLevel1Button();
        this.createLevel2Button();
        this.createLevel3Button();
        this.createLevel4Button();
        this.createLevel5Button();
        this.createLevel6Button();
        this.createLevel7Button();
        this.createLevel8Button();
        this.createLevel9Button();
        this.createLevel10Button();
        this.createLevel11Button();
        this.createLevel12Button();
        this.createnextButton();
        this.createbackButton();
        
        this.createInstructionButton();
        this.createResetLevelButton();
        this.createHomeLevelButton();
        this.createClickLevelsButton();
        // Append levels screen to body
        document.body.appendChild(this.levelsContainer);
    }

    async show() {
        // Update button states before showing the screen
        await this.updateLevelButtonStates();
        this.levelsContainer.style.display = "block";
    }

    hide() {
        this.levelsContainer.style.display = "none";
    }

    // Modified createButton method to add lock overlay when locked
    createButton(x, y, level, clickHandler) {
        // Create a container div to hold both button and lock
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "level-button-container";
        buttonContainer.style.position = "absolute";
        buttonContainer.style.width = "16px";
        buttonContainer.style.height = "16px";
        buttonContainer.style.left = `${x}px`;
        buttonContainer.style.top = `${y}px`;
        
        // Create the button image
        const button = document.createElement("img");
        button.src = "./sprites/buttons.png";
        button.alt = `Level ${level}`;
        button.dataset.level = level;
        button.style.position = "absolute";
        button.style.width = "100%";
        button.style.height = "100%";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.zIndex = "1"; // Button below lock
        
        // Create the lock overlay
        const lockOverlay = document.createElement("img");
        lockOverlay.src = "./sprites/lock.png";
        lockOverlay.className = "lock-overlay";
        lockOverlay.style.position = "absolute";
        lockOverlay.style.width = "24px";
        lockOverlay.style.height = "24px";
        lockOverlay.style.top = "-4px"; // Center over button
        lockOverlay.style.left = "-4px"; // Center over button
        lockOverlay.style.zIndex = "2"; // Lock above button
        lockOverlay.style.display = "none"; // Initially hidden
        lockOverlay.style.pointerEvents = "none"; // Make lock non-interactive so clicks go to button
        
        // Add button and lock to the container
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(lockOverlay);
        
        // Store reference to button and lock in array
        this.levelButtons.push({
            element: button,
            level: level,
            lockOverlay: lockOverlay
        });
        
        // Add hover effects to the button
        button.addEventListener("mouseover", async () => {
            // Special handling for navigation buttons (level 13+)
            if (level >= 13) {
                button.style.transform = "scale(1.1) rotate(5deg)";
                button.style.filter = "drop-shadow(0 0 7px black)";
                return;
            }
            
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                button.style.transform = "scale(1.1) rotate(5deg)";
                button.style.filter = "drop-shadow(0 0 7px black)";
            }
        });
        
        button.addEventListener("mouseout", async () => {
            // Special handling for navigation buttons (level 13+)
            if (level >= 13) {
                button.style.transform = "scale(1)";
                button.style.filter = "none";
                return;
            }
            
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                button.style.transform = "scale(1)";
                button.style.filter = "none";
            }
        });
        
        // Add click handler with level unlock check
        button.addEventListener("click", async () => {
            // Special handling for navigation buttons (level 13+)
            if (level >= 13) {
                clickHandler();
                return;
            }
            
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                clickHandler();
            } else {
                this.showLockedLevelMessage(level);
            }
        });
        
        this.levelsContainer.appendChild(buttonContainer);
        return button;
    }

    // Shows a message when player tries to access a locked level
    showLockedLevelMessage(level) {
        // Create message element if it doesn't exist
        let messageEl = document.getElementById('lockedLevelMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'lockedLevelMessage';
            messageEl.style.position = 'absolute';
            messageEl.style.left = '50%';
            messageEl.style.top = '520px';
            messageEl.style.transform = 'translateX(-50%)';
            messageEl.style.padding = '15px';
            messageEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            messageEl.style.color = '#ff3333';
            messageEl.style.fontFamily = "'Molot', sans-serif";
            messageEl.style.borderRadius = '8px';
            messageEl.style.textAlign = 'center';
            messageEl.style.zIndex = '10';
            messageEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            messageEl.style.top = '72%';        
            messageEl.style.marginTop = '50px';
            this.levelsContainer.appendChild(messageEl);
        }

        // Update message content
        messageEl.textContent = `🔒Floor ${level} is locked! Complete previous floors first.`;
        messageEl.style.textTransform = 'uppercase';
        // Show message with animation
        messageEl.style.animation = 'none';
        void messageEl.offsetWidth; // Trigger reflow
        messageEl.style.animation = 'fadeInOut 2s forwards';
        
        // Create the animation if it doesn't exist
        if (!document.querySelector('#lockedLevelAnimation')) {
            const style = document.createElement('style');
            style.id = 'lockedLevelAnimation';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -10px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Update the visual state of all level buttons - now async
    async updateLevelButtonStates() {
        for (const buttonObj of this.levelButtons) {
            const button = buttonObj.element;
            const level = buttonObj.level;
            const lockOverlay = buttonObj.lockOverlay;
            
            // Special handling for navigation buttons (level 13+)
            if (level >= 13) {
                // Navigation buttons are always unlocked
                button.style.opacity = "1";
                button.style.filter = "none";
                button.style.cursor = "pointer";
                
                // Ensure lock is hidden for navigation buttons
                if (lockOverlay) {
                    lockOverlay.style.display = "none";
                }
                
                // Skip the rest of the loop iteration for navigation buttons
                continue;
            }
            
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            const isCompleted = await window.LEVEL_PROGRESS.isLevelCompleted(level);
            
            if (isUnlocked) {
                // Unlocked level styling
                button.style.opacity = "1";
                button.style.cursor = "pointer";
                button.style.filter = isCompleted ? "brightness(1.2) sepia(0.3)" : "none";
                
                // Hide lock overlay for unlocked levels
                if (lockOverlay) {
                    lockOverlay.style.display = "none";
                }
            } else {
                // Locked level styling
                button.style.opacity = "0.7";
                button.style.filter = "grayscale(100%)";
                button.style.cursor = "not-allowed";
                
                // Show lock overlay for locked levels with animation
                if (lockOverlay) {
                    lockOverlay.style.display = "block";
                    lockOverlay.style.animation = "lockPulse 2s infinite alternate";
                }
            }
        }
    }

    createInstructionsButton(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/instructions.png";
        button.alt = `Instructions`;
        button.style.position = "absolute";
        button.style.width = "225px"; 
        button.style.height = "50px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
    
        // Add hover effects with lighter glow
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 5px rgba(177, 177, 177, 0.8))";
            // You can also add brightness to make the whole button lighter
            button.style.filter += " brightness(1.2)";
        });

        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });
    
        button.addEventListener("click", clickHandler);
    
        this.levelsContainer.appendChild(button);
        return button;
    }

    createResetLevelButtonElement(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/resetLevel.png";
        button.alt = `Reset Levels`;
        button.style.position = "absolute";
        button.style.width = "215px"; 
        button.style.height = "54px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        
        // Add hover effects with lighter glow
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 5px rgba(177, 177, 177, 0.8))";
            // You can also add brightness to make the whole button lighter
            button.style.filter += " brightness(1.2)";
        });

        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });
        
        button.addEventListener("click", clickHandler);
        
        this.levelsContainer.appendChild(button);
        return button;
    }


    createHomeButtonElement(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/home.png";
        button.alt = `Reset Levels`;
        button.style.position = "absolute";
        button.style.width = "144px"; 
        button.style.height = "51px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        
        // Add hover effects with lighter glow
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 5px rgba(177, 177, 177, 0.8))";
            // You can also add brightness to make the whole button lighter
            button.style.filter += " brightness(1.2)";
        });

        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });
        
        button.addEventListener("click", clickHandler);
        
        this.levelsContainer.appendChild(button);
        return button;
    }
    
    // Individual methods for each level button
    createLevel1Button() {
        this.createButton(115, 244, 1, () => this.goToLevel1());
    }

    createLevel2Button() {
        this.createButton(196, 244, 2, () => this.goToLevel2());
    }

    createLevel3Button() {
        this.createButton(279, 244, 3, () => this.goToLevel3());
    }

    createLevel4Button() {
        this.createButton(115, 298, 4, () => this.goToLevel4());
    }

    createLevel5Button() {
        this.createButton(196, 298, 5, () => this.goToLevel5());
    }

    createLevel6Button() {
        this.createButton(279, 298, 6, () => this.goToLevel6());
    }

    createLevel7Button() {
        this.createButton(117, 353, 7, () => this.goToLevel7());
    }

    createLevel8Button() {
        this.createButton(197, 353, 8, () => this.goToLevel8());
    }

    createLevel9Button() {
        this.createButton(280.5, 353, 9, () => this.goToLevel9());
    }

    createLevel10Button() {
        this.createButton(117, 409, 10, () => this.goToLevel10());
    }

    createLevel11Button() {
        this.createButton(197, 409, 11, () => this.goToLevel11());
    }

    createLevel12Button() {
        this.createButton(280.95, 409, 12, () => this.goToLevel12());
    }

    createnextButton() {
        this.createButton(153, 455, 13, () => {
            this.hide();
            const welcomeScreen = document.getElementById("welcomeScreen");
            if (welcomeScreen) {
                welcomeScreen.style.display = "flex";
            }
        });
    }

    createbackButton() {
        this.createButton(234, 454.5, 14, () => this.goTogame());
    }

    createInstructionButton() {
        this.createInstructionsButton(610, 582, 15, () => this.showInstructions());
    }

    createResetLevelButton() {
        this.createResetLevelButtonElement(200, 580, 16, () => this.resetLevels());
    }

    createHomeLevelButton() {
        this.createHomeButtonElement(440, 582, 17, () => this.goToWelcomeScreen());
    }

    createClickLevelsButton() {
        const button = document.createElement("img");
        button.src = "./sprites/level.png"; 
        button.alt = "Click Levels Here";
        button.style.position = "absolute";
        button.style.width = "276px"; 
        button.style.height = "51px";
        button.style.cursor = "pointer";
        button.style.left = "50px";
        button.style.top = "135px";
        
        // Create CSS animation for pulsing/popping effect using Javascript
        if (!document.querySelector('#buttonAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'buttonAnimationStyle';
            style.textContent = `
                @keyframes buttonPulse {
                    0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(177, 177, 177, 0.5)) brightness(1); }
                    50% { transform: scale(1.05) rotate(0.1deg); filter: drop-shadow(0 0 5px rgba(177, 177, 177, 0.8)) brightness(1.1); }
                    100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(177, 177, 177, 0.5)) brightness(1); }
                }
                
                .pulsing-button {
                    animation: buttonPulse 2s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Apply the animation class
        button.classList.add('pulsing-button');
    
        button.addEventListener("mouseout", () => {
            // Resume animation when not hovering
            button.style.animation = "";
            button.style.transform = "";
            button.style.filter = "";
        });
        
        this.levelsContainer.appendChild(button);
        return button;
    }

    goToWelcomeScreen() {
        // Hide the levels screen
        this.hide();
        const welcomeScreen = document.getElementById("welcomeScreen");
        if (welcomeScreen) {
            welcomeScreen.style.display = "flex";
        }
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
        
        console.log("Returning to welcome screen");
    }

    resetLevels() {
        window.resetLevelProgress()
        .then(() => {
            console.log("Level progress reset successfully");
            this.updateLevelButtonStates();
            // Ensure the player can only access level 1 now
            this.currentLevel = 1;
            window.CURRENT_GAME_LEVEL = 1;
        })
        .catch(error => {
            console.error("Error resetting levels:", error);
        });
    }

    showInstructions() {
        let instructionsPanel = document.getElementById("instructionsPanel");
        
        if (instructionsPanel) {
            if (instructionsPanel.style.display === "none") {
                instructionsPanel.style.display = "block";
            } else {
                instructionsPanel.style.display = "none";
            }
            return;
        }
        
        instructionsPanel = document.createElement("div");
        instructionsPanel.id = "instructionsPanel";
        instructionsPanel.style.position = "fixed";
        instructionsPanel.style.width = "500px";
        instructionsPanel.style.height = "400px";
        instructionsPanel.style.left = "50%";
        instructionsPanel.style.top = "50%";
        instructionsPanel.style.transform = "translate(-50%, -50%)";
        instructionsPanel.style.zIndex = "10";
        instructionsPanel.style.background = "transparent"; 
        
        const instructionsImage = document.createElement("img");
        instructionsImage.src = "./sprites/instructionsUI.png"; 
        instructionsImage.style.width = "100%";
        instructionsImage.style.height = "100%";
        instructionsImage.style.objectFit = "contain";
        
        instructionsPanel.appendChild(instructionsImage);
        
        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "25px";
        closeButton.style.right = "30px";
        closeButton.style.background = "rgba(0, 0, 0, 0.7)";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "50%";
        closeButton.style.width = "20px";
        closeButton.style.height = "20px";
        closeButton.style.fontSize = "16px"; 
        closeButton.style.lineHeight = "1";
        closeButton.style.paddingBottom = "2px"; 
        closeButton.style.cursor = "pointer";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.addEventListener("click", () => {
            instructionsPanel.style.display = "none";
        });
        
        instructionsPanel.appendChild(closeButton);
        document.body.appendChild(instructionsPanel);
    }

    // Level loading approach that checks if level is unlocked
    async loadLevel(levelNum) {
        try {
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(levelNum);
            if (!isUnlocked) {
                this.showLockedLevelMessage(levelNum);
                return;
            }
    
            // Update global and instance level tracking
            window.CURRENT_GAME_LEVEL = levelNum;
            this.currentLevel = levelNum;
            console.log("Updated CURRENT_GAME_LEVEL to:", levelNum);
    
            this.hide();
            window.targetLevelToLoad = levelNum;
    
            if (!window.gameEngine) {
                if (!window.checkGameEngineInterval) {
                    window.checkGameEngineInterval = setInterval(() => {
                        if (window.gameEngine && window.gameEngine.levelConfig) {
                            window.gameEngine.levelConfig.currentLevel = window.targetLevelToLoad;
                            window.gameEngine.levelConfig.loadLevel(window.targetLevelToLoad);
                            const gameCanvas = document.getElementById("gameWorld");
                            if (gameCanvas) {
                                gameCanvas.style.display = "block";
                            }
                            if (window.AUDIO_MANAGER) {
                                window.AUDIO_MANAGER.stopMenuMusic();
                                window.AUDIO_MANAGER.playGameMusic();
                            }
                            clearInterval(window.checkGameEngineInterval);
                            window.checkGameEngineInterval = null;
                        }
                    }, 200);
                }
                startGame();
            } else {
                if (window.gameEngine.levelConfig) {
                    window.gameEngine.levelConfig.currentLevel = levelNum;
                    window.gameEngine.levelConfig.loadLevel(levelNum);
                    const gameCanvas = document.getElementById("gameWorld");
                    if (gameCanvas) {
                        gameCanvas.style.display = "block";
                    }
                    if (window.AUDIO_MANAGER) {
                        window.AUDIO_MANAGER.stopMenuMusic();
                        window.AUDIO_MANAGER.playGameMusic();
                    }
                }
            }
        } catch (error) {
            console.error("Error in loadLevel:", error);
        }
    }
    
    // Level-specific methods
    async goToLevel1() {
        await this.loadLevel(1);
    }

    async goToLevel2() {
        await this.loadLevel(2);
    }

    async goToLevel3() {
        await this.loadLevel(3);
    }

    async goToLevel4() {
        await this.loadLevel(4); // Fixed from 0 to 4
    }

    async goToLevel5() {
        await this.loadLevel(5);
    }

    async goToLevel6() {
        await this.loadLevel(6);
    }

    async goToLevel7() {
        await this.loadLevel(7);
    }

    async goToLevel8() {
        await this.loadLevel(8);
    }

    async goToLevel9() {
        await this.loadLevel(9);
    }

    async goToLevel10() {
        await this.loadLevel(10);
    }

    async goToLevel11() {
        await this.loadLevel(11);
    }

    async goToLevel12() {
        await this.loadLevel(12);
    }

    async goTogame() {
        this.hide();
    
        // Ensure the correct level is resumed
        let levelToLoad = window.CURRENT_GAME_LEVEL || 1; 
        console.log("Returning to level:", levelToLoad);
    
        if (window.gameEngine) {
            // Ensure the game canvas is visible
            const gameCanvas = document.getElementById("gameWorld");
            if (gameCanvas) {
                gameCanvas.style.display = "block";
            }
    
            // Resume the game with the most recent level
            if (window.gameEngine.levelConfig) {
                window.gameEngine.levelConfig.currentLevel = levelToLoad;
                window.gameEngine.levelConfig.loadLevel(levelToLoad);
                
                // Switch music back to game music
                if (window.AUDIO_MANAGER) {
                    window.AUDIO_MANAGER.stopMenuMusic();
                    window.AUDIO_MANAGER.playGameMusic();
                }
            }
        } else {
            // If game engine isn't initialized yet, load the level
            console.log("Game engine not found, loading level:", levelToLoad);
            await this.loadLevel(levelToLoad);
        }
    }
}