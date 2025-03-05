class LevelsScreen {
    constructor() {
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

        // Manually create 10 level buttons
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
        // Append levels screen to body
        document.body.appendChild(this.levelsContainer);
    }

    show() {
        this.levelsContainer.style.display = "block";
    }

    hide() {
        this.levelsContainer.style.display = "none";
    }

    createButton(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/buttons.png"; // Replace with specific button images if needed
        button.alt = `Level ${level}`;
        button.style.position = "absolute";
        button.style.width = "16px"; // Adjust button size
        button.style.height = "16px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;

        // Add hover effects
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.1) rotate(5deg)";
            button.style.filter = "drop-shadow(0 0 7px black)";
        });

        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });

        // Attach a unique event listener
        button.addEventListener("click", clickHandler);

        this.levelsContainer.appendChild(button);
    }

    createInstructionsButton(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/instructions.png"; // Use same default image as other buttons
        button.alt = `Instructions`;
        button.style.position = "absolute";
        button.style.width = "225px"; // Match the size of other buttons
        button.style.height = "50px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
    
        // Store the original image
        const originalSrc = button.src;
        
        // Add hover effects
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.1) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 7px black)";
        });
    
        button.addEventListener("mouseout", () => {
            // Restore original image and styling
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });
    
        // Attach a unique event listener
        button.addEventListener("click", clickHandler);
    
        this.levelsContainer.appendChild(button);
    }
    
    // Individual methods for each button
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
            this.hide(); // Hide the levels screen
            const welcomeScreen = document.getElementById("welcomeScreen");
            if (welcomeScreen) {
                welcomeScreen.style.display = "flex"; // Show the welcome screen
            }
        });
    }

    createbackButton() {
        this.createButton(234, 454.5, 14, () => this.goTogame());
    }

    createInstructionButton() {
        this.createInstructionsButton(75, 135, 15, () => this.showInstructions());
    }

    showInstructions() {
        console.log("Showing instructions...");
        
        // Check if instructions panel already exists
        let instructionsPanel = document.getElementById("instructionsPanel");
        
        if (instructionsPanel) {
            // If it exists, just toggle its visibility
            if (instructionsPanel.style.display === "none") {
                instructionsPanel.style.display = "block";
            } else {
                instructionsPanel.style.display = "none";
            }
            return;
        }
        
        // Create a new instructions panel
        instructionsPanel = document.createElement("div");
        instructionsPanel.id = "instructionsPanel";
        instructionsPanel.style.position = "fixed";
        instructionsPanel.style.width = "500px";
        instructionsPanel.style.height = "400px";
        instructionsPanel.style.left = "50%";
        instructionsPanel.style.top = "50%";
        instructionsPanel.style.transform = "translate(-50%, -50%)";
        instructionsPanel.style.zIndex = "10";
        instructionsPanel.style.background = "transparent"; // Set background to transparent
        
        // Create the image element with the elevator instructions
        const instructionsImage = document.createElement("img");
        instructionsImage.src = "./sprites/instructionsUI.png"; // Path to your instruction image
        instructionsImage.style.width = "100%";
        instructionsImage.style.height = "100%";
        instructionsImage.style.objectFit = "contain";
        
        instructionsPanel.appendChild(instructionsImage);
        
        // Add close button
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
        closeButton.style.fontSize = "16px"; // Slightly smaller font size to fit better
        closeButton.style.lineHeight = "1";
        closeButton.style.paddingBottom = "2px"; // Adjust to center × vertically
        closeButton.style.cursor = "pointer";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.addEventListener("click", () => {
            instructionsPanel.style.display = "none";
        });
        
        instructionsPanel.appendChild(closeButton);
        
        // Add the panel to the body
        document.body.appendChild(instructionsPanel);
    }

    // Helper method to start the game
    startGame(levelNumber) {
        console.log(`Starting game at level ${levelNumber}...`);
        this.hide(); // Hide the levels screen
        
        // Look for existing GameEngine instances
        let gameEngine = window.gameEngine;
        
        if (!gameEngine) {
            // If game engine doesn't exist yet, create it
            gameEngine = new GameEngine();
            window.gameEngine = gameEngine; // Store it for future reference
            
            // Initialize asset manager if needed
            if (!window.ASSET_MANAGER) {
                startGame(); // Call the original startGame function first
                
                // Then load our specific level
                setTimeout(() => {
                    if (gameEngine.levelConfig) {
                        gameEngine.levelConfig.loadLevel(levelNumber);
                        gameEngine.levelConfig.currentLevel = levelNumber;
                    }
                }, 500); // Give time for game initialization
            } else {
                // Asset manager exists, so we can just load the level
                if (gameEngine.levelConfig) {
                    gameEngine.levelConfig.loadLevel(levelNumber);
                    gameEngine.levelConfig.currentLevel = levelNumber;
                }
            }
        } else {
            // Game engine exists, just load the level
            if (gameEngine.levelConfig) {
                gameEngine.levelConfig.loadLevel(levelNumber);
                gameEngine.levelConfig.currentLevel = levelNumber;
            }
        }
        
        // Switch from menu music to game music if needed
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopMenuMusic();
            window.AUDIO_MANAGER.playGameMusic();
        }
    }
    
    // Methods for handling level clicks
    goToLevel1() {
        console.log("Loading Level 1 map");
        this.startGame(1);
    }
    
    goToLevel2() {
        console.log("Loading Level 2 map");
        this.startGame(2);
    }
    
    goToLevel3() {
        console.log("Loading Level 3 map");
        this.startGame(3);
    }

    // Map remaining levels
    goToLevel4() {
        // Currently only have 3 maps, so reload level 1 for demo purposes
        this.startGame(1);
    }

    goToLevel5() {
        // Currently only have 3 maps, so reload level 2 for demo purposes
        this.startGame(2);
    }

    goToLevel6() {
        // Currently only have 3 maps, so reload level 3 for demo purposes
        this.startGame(3);
    }

    goToLevel7() {
        // Currently only have 3 maps, so reload level 1 for demo purposes
        this.startGame(1);
    }

    goToLevel8() {
        // Currently only have 3 maps, so reload level 2 for demo purposes
        this.startGame(2);
    }

    goToLevel9() {
        // Currently only have 3 maps, so reload level 3 for demo purposes
        this.startGame(3);
    }

    goToLevel10() {
        // Currently only have 3 maps, so reload level 1 for demo purposes
        this.startGame(1);
    }

    goToLevel11() {
        // Currently only have 3 maps, so reload level 2 for demo purposes
        this.startGame(2);
    }

    goToLevel12() {
        // Currently only have 3 maps, so reload level 3 for demo purposes
        this.startGame(3);
    }

    goTogame() {
        console.log("Going back to game...");
        this.hide(); // Hide the levels screen
        
        // If a game is already running, just return to it
        if (window.gameEngine) {
            // No need to do anything; hiding the level screen will reveal the game
        } else {
            // If no game is running, start one at level 1
            this.startGame(1);
        }
    }
}