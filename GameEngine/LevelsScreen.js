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
        
        // Setup debug mode integration
        this.setupDebugModeIntegration();
        
        console.log("LevelsScreen initialized with level:", this.currentLevel);
        
        this.createLevelsScreen();
    }

    setupDebugModeIntegration() {
        // Check for existing debug indicator
        let indicator = document.getElementById('debugModeIndicator');
        
        // Create debug indicator if it doesn't exist
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'debugModeIndicator';
            indicator.style.position = 'fixed';
            indicator.style.top = '10px';
            indicator.style.right = '10px';
            indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
            indicator.style.color = 'white';
            indicator.style.padding = '5px 10px';
            indicator.style.borderRadius = '4px';
            indicator.style.fontFamily = 'Arial, sans-serif';
            indicator.style.fontSize = '12px';
            indicator.style.fontWeight = 'bold';
            indicator.style.zIndex = '9999';
            indicator.style.display = 'none';
            indicator.textContent = 'DEBUG MODE';
            
            document.body.appendChild(indicator);
        }
        
        // Get debug checkbox
        const debugBox = document.getElementById("debug");
        
        if (debugBox) {
            // Update debug indicator based on current state
            if (debugBox.checked) {
                indicator.style.display = 'block';
                
                // If debug mode is already enabled, unlock all levels
                setTimeout(() => {
                    if (window.LEVEL_PROGRESS) {
                        window.unlockAllLevels();
                    }
                }, 500);
            } else {
                indicator.style.display = 'none';
            }
            
            // Add event listener for debug checkbox changes
            debugBox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    indicator.style.display = 'block';
                    
                    // Unlock all levels when debug mode is enabled
                    if (window.LEVEL_PROGRESS) {
                        window.unlockAllLevels().then(() => {
                            // Update button states if level screen is visible
                            if (this.levelsContainer.style.display !== "none") {
                                this.updateLevelButtonStates();
                            }
                        });
                    }
                } else {
                    indicator.style.display = 'none';
                }
            });
        }
    }

    isDebugModeEnabled() {
        return document.getElementById("debug") && document.getElementById("debug").checked;
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

        // Create animation style for lock pulse if doesn't exist
        if (!document.querySelector('#lockAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'lockAnimationStyle';
            style.textContent = `
                @keyframes lockPulse {
                    0% { transform: scale(1); opacity: 0.9; }
                    100% { transform: scale(1.15); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Manually create level buttons
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

        // Create special levels 13-16
        this.createLevel13Button();
        this.createLevel14Button();
        this.createLevel15Button();
        this.createLevel16Button();

        // Create navigation buttons
        this.createnextButton();
        this.createbackButton();
        
        // Create utility buttons
        this.createInstructionButton();
        this.createResetLevelButton();
        this.createHomeLevelButton();
        this.createClickLevelsButton();
        
        // Append levels screen to body
        document.body.appendChild(this.levelsContainer);
    }

    async show() {
        // Force reset any old messages
        let existingMessage = document.getElementById('lockedLevelMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // If in debug mode, ensure all levels are unlocked
        if (this.isDebugModeEnabled() && window.LEVEL_PROGRESS) {
            await window.unlockAllLevels();
        }
        
        // Update button states before showing the screen
        await this.updateLevelButtonStates();
        
        // Always make sure we're using the correct current level
        this.currentLevel = window.CURRENT_GAME_LEVEL || 1;
        console.log("Showing levels screen with current level:", this.currentLevel);
        
        // Show the levels screen
        this.levelsContainer.style.display = "block";
    }
    

    hide() {
        this.levelsContainer.style.display = "none";
    }

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
        
        // Create the lock overlay - only for levels 1-12
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
        
        // Add button to the container
        buttonContainer.appendChild(button);
        
        // Only add lock overlay for levels 1-12
        if (level <= 12) {
            buttonContainer.appendChild(lockOverlay);
        }
        
        // Store reference to button and lock in array
        this.levelButtons.push({
            element: button,
            level: level,
            lockOverlay: level <= 12 ? lockOverlay : null // No lock overlay for levels 13+
        });
        
        // Add hover effects to the button with debug mode check
        button.addEventListener("mouseover", async () => {
            // In debug mode, all buttons should have hover effects
            if (this.isDebugModeEnabled()) {
                button.style.transform = "scale(1.1) rotate(5deg)";
                button.style.filter = "drop-shadow(0 0 7px black)";
                return;
            }
            
            // Standard hover behavior for non-debug mode
            // Navigation buttons (level 17+)
            if (level >= 17) {
                button.style.transform = "scale(1.1) rotate(5deg)";
                button.style.filter = "drop-shadow(0 0 7px black)";
                return;
            }
            
            // Special levels 13-16
            if (level >= 13 && level <= 16) {
                const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
                if (isLevel12Completed) {
                    button.style.transform = "scale(1.1) rotate(5deg)";
                    button.style.filter = "drop-shadow(0 0 7px black)";
                }
                return;
            }
            
            // Regular levels 1-12
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                button.style.transform = "scale(1.1) rotate(5deg)";
                button.style.filter = "drop-shadow(0 0 7px black)";
            }
        });
        
        button.addEventListener("mouseout", () => {
            // Reset effects for all buttons
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });
        
        // Add click handler with debug mode check
        button.addEventListener("click", async () => {
            // In debug mode, all levels are accessible
            if (this.isDebugModeEnabled()) {
                clickHandler();
                return;
            }
            
            // Regular click handling for non-debug mode
            // Navigation buttons (level 17+)
            if (level >= 17) {
                clickHandler();
                return;
            }
            
            // Special levels 13-16
            if (level >= 13 && level <= 16) {
                const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
                if (isLevel12Completed) {
                    clickHandler();
                } else {
                    // Make sure we're using the instance method
                    this.showLockedLevelMessage(level);
                }
                return;
            }
            
            // Regular levels 1-12
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            if (isUnlocked) {
                clickHandler();
            } else {
                // Make sure we're using the instance method and force message display
                this.showLockedLevelMessage(level);
            }
        });
        
        this.levelsContainer.appendChild(buttonContainer);
        return button;
    }

    // Shows a message when player tries to access a locked level
    showLockedLevelMessage(level) {
        // Remove any existing message first
        let existingMessage = document.getElementById('lockedLevelMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create a new message element
        let messageEl = document.createElement('div');
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
        messageEl.style.top = '65%';  // Moves it higher
        messageEl.style.marginTop = '20px'; // Reduce extra spacing
        this.levelsContainer.appendChild(messageEl);
    
        // Different message for levels 13-16
        let message;
        if (level >= 13 && level <= 16) {
            message = `🔒Floor ${level} is locked! Complete Floor 12 first to unlock the all mystery levels!`;
        } else {
            message = `🔒Floor ${level} is locked! Complete previous floors first.`;
        }
    
        // Update message content
        messageEl.textContent = message;
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
        
        // Force the message to be visible
        console.log("Showing locked message for level:", level);
    }

    // Update the visual state of all level buttons
    async updateLevelButtonStates() {
        // Check if level 12 is completed for special levels (13-16)
        const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
        
        for (const buttonObj of this.levelButtons) {
            const button = buttonObj.element;
            const level = buttonObj.level;
            const lockOverlay = buttonObj.lockOverlay;
            
            // In debug mode, all levels are accessible
            if (this.isDebugModeEnabled()) {
                // Always unlocked in debug mode
                button.style.opacity = "1";
                button.style.filter = "none";
                button.style.cursor = "pointer";
                
                // Hide lock overlay in debug mode
                if (lockOverlay) {
                    lockOverlay.style.display = "none";
                }
                continue;
            }
            
            // Regular non-debug mode behavior
            
            // Navigation buttons (level 17+)
            if (level >= 17) {
                // Always unlocked
                button.style.opacity = "1";
                button.style.filter = "none";
                button.style.cursor = "pointer";
                continue;
            }
            
            // Special levels (13-16)
            if (level >= 13 && level <= 16) {
                if (isLevel12Completed) {
                    // Unlocked if level 12 is completed
                    button.style.opacity = "1";
                    button.style.filter = "none";
                    button.style.cursor = "pointer";
                } else {
                    // Locked if level 12 is not completed
                    button.style.opacity = "0.7";
                    button.style.filter = "grayscale(100%)";
                    button.style.cursor = "not-allowed";
                    // No lock icon by design
                }
                continue;
            }
            
            // Regular levels (1-12)
            const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(level);
            const isCompleted = await window.LEVEL_PROGRESS.isLevelCompleted(level);
            
            if (isUnlocked) {
                // Unlocked level styling
                button.style.opacity = "1";
                button.style.cursor = "pointer";
                button.style.filter = isCompleted ? "brightness(1.2) sepia(0.3)" : "none";
                
                // Hide lock overlay
                if (lockOverlay) {
                    lockOverlay.style.display = "none";
                }
            } else {
                // Locked level styling
                button.style.opacity = "0.7";
                button.style.filter = "grayscale(100%)";
                button.style.cursor = "not-allowed";
                
                // Show lock overlay with animation
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
        button.alt = `Home`;
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

    //extra button
    createLevel13Button() {
        //this.createButton(750.1, 414, 13, () => this.goToLevel13());
        // Create a container div for the button
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "radiation-button-container";
        buttonContainer.style.position = "absolute";
        buttonContainer.style.width = "18px"; // Adjusted size for the hazard icon
        buttonContainer.style.height = "18px";
        buttonContainer.style.left = "749px"; // Keep original position
        buttonContainer.style.top = "414px";
        buttonContainer.style.zIndex = "5"; // Ensure it's above other elements
        
        // Create the radiation hazard button image
        const button = document.createElement("img");
        button.src = "./sprites/toxic.png"; // Update path to your radiation image
        button.alt = "Radiation Level";
        button.dataset.level = 13;
        button.style.position = "absolute";
        button.style.width = "100%";
        button.style.height = "100%";
        button.style.cursor = "pointer";
        button.style.transition = "all 0.3s ease-in-out"; // Apply to all properties
        button.style.zIndex = "5"; // Ensure it's above other elements
        
        // Force the initial state explicitly
        button.style.transform = "scale(1)";
        button.style.filter = "none";
        
        // Add hover effects with glow
        button.addEventListener("mouseover", async () => {
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (this.isDebugModeEnabled() || isLevel12Completed) {
                button.style.transform = "scale(1.05) rotate(0.1deg)";
                button.style.filter = "drop-shadow(0 0 5px rgba(255, 0, 0, 0.8)) brightness(1.2)";
                console.log("Radiation button hover activated");
            }
        });
        
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
            console.log("Radiation button hover deactivated");
        });
        
        // Add click handler
        button.addEventListener("click", async () => {
            console.log("Radiation button clicked");
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (this.isDebugModeEnabled() || isLevel12Completed) {
                this.goToLevel13();
            } else {
                this.showLockedLevelMessage(13);
            }
        });
        
        // Store reference in levelButtons array for state management
        this.levelButtons.push({
            element: button,
            level: 13,
            lockOverlay: null // No lock overlay for special levels
        });
        
        buttonContainer.appendChild(button);
        this.levelsContainer.appendChild(buttonContainer);
        
        return button;
    }

    createLevel14Button() {
        //this.createButton(745, 445, 14, () => this.goToLevel14());
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "toxic-button-container";
        buttonContainer.style.position = "absolute";
        buttonContainer.style.width = "25px"; // Adjusted size for the hazard icon
        buttonContainer.style.height = "18px";
        buttonContainer.style.left = "740px"; // Keep original position
        buttonContainer.style.top = "445px";
        buttonContainer.style.zIndex = "5"; // Ensure it's above other elements
        
        // Create the toxic hazard button image
        const button = document.createElement("img");
        button.src = "./sprites/redToxic.png"; // Update path to your toxic image
        button.alt = "Toxic Level";
        button.dataset.level = 14;
        button.style.position = "absolute";
        button.style.width = "100%";
        button.style.height = "100%";
        button.style.cursor = "pointer";
        button.style.transition = "all 0.3s ease-in-out"; // Apply to all properties
        button.style.zIndex = "5"; // Ensure it's above other elements
        
        // Force the initial state explicitly
        button.style.transform = "scale(1)";
        button.style.filter = "none";
        
        // Add hover effects with glow
        button.addEventListener("mouseover", async () => {
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (this.isDebugModeEnabled() || isLevel12Completed) {
                button.style.transform = "scale(1.05) rotate(0.1deg)";
                button.style.filter = "drop-shadow(0 0 5px rgba(255, 255, 0, 0.8)) brightness(1.2)";
                console.log("Toxic button hover activated");
            }
        });
        
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
            console.log("Toxic button hover deactivated");
        });
        
        // Add click handler
        button.addEventListener("click", async () => {
            console.log("Toxic button clicked");
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (this.isDebugModeEnabled() || isLevel12Completed) {
                this.goToLevel14();
            } else {
                this.showLockedLevelMessage(14);
            }
        });
        
        // Store reference in levelButtons array for state management
        this.levelButtons.push({
            element: button,
            level: 14,
            lockOverlay: null // No lock overlay for special levels
        });
        
        buttonContainer.appendChild(button);
        this.levelsContainer.appendChild(buttonContainer);
        
        return button;
    }

    createLevel15Button() {
        //this.createButton(809, 445, 15, () => this.goToLevel15());
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "biohazard-button-container";
        buttonContainer.style.position = "absolute";
        buttonContainer.style.width = "15px"; // Adjusted size for the hazard icon
        buttonContainer.style.height = "15px";
        buttonContainer.style.left = "812px"; // Keep original position
        buttonContainer.style.top = "446px";
        buttonContainer.style.zIndex = "5"; // Ensure it's above other elements
        
        // Create the hazard button image
        const button = document.createElement("img");
        button.src = "./sprites/hazard.png"; // Update path to your biohazard or another hazard image
        button.alt = "Biohazard Level";
        button.dataset.level = 15;
        button.style.position = "absolute";
        button.style.width = "100%";
        button.style.height = "100%";
        button.style.cursor = "pointer";
        button.style.transition = "all 0.3s ease-in-out"; // Apply to all properties
        button.style.zIndex = "5"; // Ensure it's above other elements
        
        // Force the initial state explicitly
        button.style.transform = "scale(1)";
        button.style.filter = "none";
        
        // Add hover effects with glow
        button.addEventListener("mouseover", async () => {
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (this.isDebugModeEnabled() || isLevel12Completed) {
                button.style.transform = "scale(1.05) rotate(0.1deg)";
                button.style.filter = "drop-shadow(0 0 5px rgba(0, 255, 0, 0.8)) brightness(1.2)"; // Green glow to differentiate
                console.log("Biohazard button hover activated");
            }
        });
        
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
            console.log("Biohazard button hover deactivated");
        });
        
        // Add click handler
        button.addEventListener("click", async () => {
            console.log("Biohazard button clicked");
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (this.isDebugModeEnabled() || isLevel12Completed) {
                this.goToLevel15();
            } else {
                this.showLockedLevelMessage(15);
            }
        });
        
        // Store reference in levelButtons array for state management
        this.levelButtons.push({
            element: button,
            level: 15,
            lockOverlay: null // No lock overlay for special levels
        });
        
        buttonContainer.appendChild(button);
        this.levelsContainer.appendChild(buttonContainer);
        
        return button;
    }

    createLevel16Button() {
        // Create a container div for the button
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "exit-button-container";
        buttonContainer.style.position = "absolute";
        buttonContainer.style.width = "140px"; 
        buttonContainer.style.height = "52px";
        buttonContainer.style.left = "453px";
        buttonContainer.style.top = "122px";
        buttonContainer.style.zIndex = "5"; // Ensure it's above other elements
        
        // Create the logo png button image
        const button = document.createElement("img");
        button.src = "./sprites/PAKS.png";
        button.alt = "EXIT";
        button.dataset.level = 16;
        button.style.position = "absolute";
        button.style.width = "100%";
        button.style.height = "100%";
        button.style.cursor = "pointer";
        button.style.transition = "all 0.3s ease-in-out"; // Apply to all properties
        button.style.zIndex = "5"; // Ensure it's above other elements
        
        // Force the initial state explicitly
        button.style.transform = "scale(1)";
        button.style.filter = "none";
        
        // Add hover effects with lighter glow - simplify for testing
        button.addEventListener("mouseover", () => {
            // Remove the level check temporarily for testing
            button.style.transform = "scale(1.05) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 5px rgba(177, 177, 177, 0.8)) brightness(1.2)";
            console.log("Button hover activated"); // Add logging
        });
        
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
            console.log("Button hover deactivated"); // Add logging
        });
        
        // Add click handler
        button.addEventListener("click", async () => {
            console.log("Button clicked"); // Add logging
            const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
            if (isLevel12Completed) {
                this.goToLevel16();
            } else {
                this.showLockedLevelMessage(16);
            }
        });
        
        // Store reference in levelButtons array for state management
        this.levelButtons.push({
            element: button,
            level: 16,
            lockOverlay: null // No lock overlay for EXIT button
        });
        
        buttonContainer.appendChild(button);
        this.levelsContainer.appendChild(buttonContainer);
        
        return button;
    }
    
    createnextButton() {
        this.createButton(153, 455, 17, () => {
            this.hide();
            const welcomeScreen = document.getElementById("welcomeScreen");
            if (welcomeScreen) {
                welcomeScreen.style.display = "flex";
            }
        });
    }

    
    createbackButton() {
        this.createButton(234, 454.5, 18, () => this.goTogame());
    }

    createInstructionButton() {
        this.createInstructionsButton(610, 582, 19, () => this.showInstructions());
    }

    createResetLevelButton() {
        this.createResetLevelButtonElement(200, 580, 20, () => this.resetLevels());
    }

    createHomeLevelButton() {
        this.createHomeButtonElement(440, 582, 21, () => this.goToWelcomeScreen());
    }

    createClickLevelsButton() {
        const button = document.createElement("img");
        button.src = "./sprites/level.png"; 
        button.alt = "Click Levels Here";
        button.style.position = "absolute";
        button.style.width = "298px"; 
        button.style.height = "54px";
        button.style.cursor = "pointer";
        button.style.left = "38px";
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

    // Level loading with special handling for levels 13-16
    async loadLevel(levelNum) {
        try {
            // If in debug mode, bypass the level unlock checks
            if (!this.isDebugModeEnabled()) {
                // Special handling for levels 13-16
                if (levelNum >= 13 && levelNum <= 16) {
                    const isLevel12Completed = await window.LEVEL_PROGRESS.isLevelCompleted(12);
                    if (!isLevel12Completed) {
                        this.showLockedLevelMessage(levelNum);
                        return;
                    }
                } 
                // Regular handling for levels 1-12
                else if (levelNum <= 12) {
                    const isUnlocked = await window.LEVEL_PROGRESS.isLevelUnlocked(levelNum);
                    if (!isUnlocked) {
                        this.showLockedLevelMessage(levelNum);
                        return;
                    }
                }
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
        await this.loadLevel(4); 
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

    async goToLevel13() {
        await this.loadLevel(13);
    }

    async goToLevel14() {
        await this.loadLevel(14);
    }

    async goToLevel15() {
        await this.loadLevel(15);
    }

    async goToLevel16() {
        await this.loadLevel(16);
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