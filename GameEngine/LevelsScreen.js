class LevelsScreen {
    constructor() {
        this.currentLevel = 1;
        this.levelButtons = []; // Store references to level buttons
        
        // Create progress manager instance
        window.LEVEL_PROGRESS = new LevelProgressManager();
        
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
        const button = document.createElement("img");
        button.src = "./sprites/buttons.png"; // Use your original button image
        button.alt = `Level ${level}`;
        button.dataset.level = level; // Store level number for reference
        button.style.position = "absolute";
        button.style.width = "16px"; // Keep your original size 
        button.style.height = "16px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;

        // Add a lock overlay for locked levels
        const lockOverlay = document.createElement("div");
        lockOverlay.className = "lock-overlay";
        lockOverlay.style.position = "absolute";
        lockOverlay.style.width = "100%";
        lockOverlay.style.height = "100%";
        lockOverlay.style.top = "0";
        lockOverlay.style.left = "0";
        lockOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Semi-transparent overlay
        lockOverlay.style.borderRadius = "50%";
        lockOverlay.style.display = "flex";
        lockOverlay.style.justifyContent = "center";
        lockOverlay.style.alignItems = "center";
        lockOverlay.style.display = "none"; // Initially hidden
        
        // Small lock icon
        const lockIcon = document.createElement("div");
        lockIcon.innerHTML = "🔒";
        lockIcon.style.fontSize = "10px";
        lockOverlay.appendChild(lockIcon);
        button.appendChild(lockOverlay);

        // Store reference to the button
        this.levelButtons.push({
            element: button,
            level: level,
            lockOverlay: lockOverlay
        });

        // Add hover effects - these will check lock status when triggered
        button.addEventListener("mouseover", async () => {
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                button.style.transform = "scale(1.1) rotate(5deg)";
                button.style.filter = "drop-shadow(0 0 7px black)";
            }
        });

        button.addEventListener("mouseout", async () => {
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                button.style.transform = "scale(1)";
                button.style.filter = "none";
            }
        });

        // Attach click handler with level unlock check
        button.addEventListener("click", async () => {
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                clickHandler();
            } else {
                this.showLockedLevelMessage(level);
            }
        });

        this.levelsContainer.appendChild(button);
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
            messageEl.style.color = '#ffcc00';
            messageEl.style.fontFamily = "'Molot', sans-serif";
            messageEl.style.borderRadius = '8px';
            messageEl.style.textAlign = 'center';
            messageEl.style.zIndex = '10';
            messageEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            this.levelsContainer.appendChild(messageEl);
        }

        // Update message content
        messageEl.textContent = `Floor ${level} is locked! Complete previous floors first.`;
        
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
                // These are always unlocked
                button.style.opacity = "1";
                button.style.filter = "none";
                button.style.cursor = "pointer";
                continue;
            }
            
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            const isCompleted = await window.LEVEL_PROGRESS.isLevelCompleted(level);
            
            if (isUnlocked) {
                // Unlocked level
                button.style.opacity = "1";
                button.style.cursor = "pointer";
                button.style.filter = isCompleted ? "brightness(1.2) sepia(0.3)" : "none";
                
                // Hide lock overlay
                if (lockOverlay) {
                    lockOverlay.style.display = "none";
                }
            } else {
                // Locked level appearance
                button.style.opacity = "0.7";
                button.style.filter = "grayscale(100%)";
                button.style.cursor = "not-allowed";
                
                // Show lock overlay
                if (lockOverlay) {
                    lockOverlay.style.display = "flex";
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
    
        // Add hover effects
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 5px black)";
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
        
        // Add hover effects
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 5px black)";
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
        this.createInstructionsButton(75, 135, 15, () => this.showInstructions());
    }

    createResetLevelButton() {
        this.createResetLevelButtonElement(75, 535, 16, () => this.resetLevels());
    }

    resetLevels() {
        window.resetLevelProgress()
        .then(() => {
            console.log("Level progress reset successfully");
            this.updateLevelButtonStates();
            // Ensure the player can only access level 1 now
            this.currentLevel = 1;
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
            
            this.currentLevel = levelNum;
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
        await this.loadLevel(0);
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
    
        if (window.gameEngine && window.gameEngine.levelConfig) {
            this.currentLevel = window.gameEngine.levelConfig.currentLevel;
        }
        
        if (window.gameEngine) {
            const gameCanvas = document.getElementById("gameWorld");
            if (gameCanvas) {
                gameCanvas.style.display = "block";
            }
            
            if (window.gameEngine.levelConfig) {
                window.gameEngine.levelConfig.currentLevel = this.currentLevel;
                window.gameEngine.levelConfig.loadLevel(this.currentLevel);
            }
        } else {
            await this.loadLevel(this.currentLevel);
        }
    }
}

// Hook into level completion in LevelConfig
const hookLevelCompletion = () => {
    if (typeof LevelConfig !== 'undefined') {
        const originalLoadNextLevel = LevelConfig.prototype.loadNextLevel;
        LevelConfig.prototype.loadNextLevel = function() {
            const completedLevel = this.currentLevel;
            
            if (originalLoadNextLevel) {
                originalLoadNextLevel.call(this);
            } else {
                if (this.currentLevel < 12) {
                    this.currentLevel += 1;
                    this.loadLevel(this.currentLevel);
                }
            }
            
            if (window.LEVEL_PROGRESS) {
                window.LEVEL_PROGRESS.completeLevel(completedLevel)
                    .catch(err => console.error('Error completing level:', err));
            }
        };
    }
};

// Helper functions for debugging
window.unlockAllLevels = async function() {
    if (window.LEVEL_PROGRESS) {
        try {
            for (let i = 1; i <= 12; i++) {
                await window.LEVEL_PROGRESS.unlockLevel(i);
            }
            
            const levelsScreen = document.getElementById("levelsScreen");
            if (levelsScreen && levelsScreen.style.display !== "none") {
                for (let key in window) {
                    if (window[key] instanceof LevelsScreen) {
                        await window[key].updateLevelButtonStates();
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error unlocking levels:", error);
        }
    }
};

window.resetLevelProgress = async function() {
    if (window.LEVEL_PROGRESS) {
        try {
            await window.LEVEL_PROGRESS.resetProgress();
            
            const levelsScreen = document.getElementById("levelsScreen");
            if (levelsScreen && levelsScreen.style.display !== "none") {
                for (let key in window) {
                    if (window[key] instanceof LevelsScreen) {
                        await window[key].updateLevelButtonStates();
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error resetting progress:", error);
        }
    }
};

// Initialize hook when DOM loads or with delay
document.addEventListener('DOMContentLoaded', hookLevelCompletion);
setTimeout(hookLevelCompletion, 1000);
