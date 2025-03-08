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
        return button;
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
        return button;
    }
    
    // Individual methods for each level button - properly referencing specific level numbers
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

    // Modified level loading approach that ensures game is initialized properly
    loadLevel(levelNum) {
        console.log(`Loading level ${levelNum}`);
        this.hide(); // Hide the levels screen
        
        // Store target level in a global variable to be used after initialization
        window.targetLevelToLoad = levelNum;
        
        // If game engine doesn't exist yet, we need to initialize it
        if (!window.gameEngine) {
            console.log("Game engine not found, starting game initialization...");
            
            // Define a custom observer function to wait for game engine availability
            if (!window.checkGameEngineInterval) {
                window.checkGameEngineInterval = setInterval(() => {
                    console.log("Checking for game engine initialization...");
                    if (window.gameEngine && window.gameEngine.levelConfig) {
                        console.log("Game engine found! Loading requested level:", window.targetLevelToLoad);
                        
                        // Update current level and load it
                        window.gameEngine.levelConfig.currentLevel = window.targetLevelToLoad;
                        window.gameEngine.levelConfig.loadLevel(window.targetLevelToLoad);
                        
                        // Make sure game canvas is visible
                        const gameCanvas = document.getElementById("gameWorld");
                        if (gameCanvas) {
                            gameCanvas.style.display = "block";
                        }
                        
                        // Switch music if needed
                        if (window.AUDIO_MANAGER) {
                            window.AUDIO_MANAGER.stopMenuMusic();
                            window.AUDIO_MANAGER.playGameMusic();
                        }
                        
                        // Clean up the interval
                        clearInterval(window.checkGameEngineInterval);
                        window.checkGameEngineInterval = null;
                    }
                }, 200); // Check every 200ms
            }
            
            // Start the game (this is the function from paste-3.txt)
            startGame();

        } else {
            // Game already exists, directly load level
            console.log(`Game engine exists, loading level ${levelNum}`);
            if (window.gameEngine.levelConfig) {
                // Set the current level before loading it
                window.gameEngine.levelConfig.currentLevel = levelNum;
                window.gameEngine.levelConfig.loadLevel(levelNum);
                
                // Ensure the game canvas is visible
                const gameCanvas = document.getElementById("gameWorld");
                if (gameCanvas) {
                    gameCanvas.style.display = "block";
                }
                
                // Switch music if needed
                if (window.AUDIO_MANAGER) {
                    window.AUDIO_MANAGER.stopMenuMusic();
                    window.AUDIO_MANAGER.playGameMusic();
                }
            } else {
                console.error("Game engine exists but levelConfig is missing");
            }
        }
    }
    
    // Methods for handling level clicks - each loads the correct level number
    goToLevel1() {
        console.log("Loading level 1");
        this.loadLevel(1);
    }

    goToLevel2() {
        console.log("Loading level 2");
        this.loadLevel(2);
    }

    goToLevel3() {
        console.log("Loading level 3");
        this.loadLevel(3);
    }

    goToLevel4() {
        console.log("Loading level 0 (test level)");
        this.loadLevel(0);
    }

    // For levels 5-12, 
    goToLevel5() {
        console.log("Level 5 - Coming Soon");
        alert("Level 5 coming soon!");
        
    }

    goToLevel6() {
        console.log("Level 6 - Coming Soon");
        alert("Level 6 coming soon!");
        
    }

    goToLevel7() {
        console.log("Level 7 - Coming Soon");
        alert("Level 7 coming soon!");
        
    }

    goToLevel8() {
        console.log("Level 8 - Coming Soon");
        alert("Level 8 coming soon!");
        
    }

    goToLevel9() {
        console.log("Level 9 - Coming Soon");
        alert("Level 9 coming soon!");
        
    }

    goToLevel10() {
        console.log("Level 10 - Coming Soon");
        alert("Level 10 coming soon!");
        
    }

    goToLevel11() {
        console.log("Level 11 - Coming Soon");
        alert("Level 11 coming soon!");
        
    }

    goToLevel12() {
        console.log("Level 12 - Coming Soon");
        alert("Level 12 coming soon!");
        
    }

    goTogame() {
        console.log("Going back to current game...");
        this.hide(); // Hide the levels screen
        
        // If a game is already running, just return to it
        if (window.gameEngine) {
            // No need to do anything; hiding the level screen will reveal the game
            // Make sure the canvas is visible
            const gameCanvas = document.getElementById("gameWorld");
            if (gameCanvas) {
                gameCanvas.style.display = "block";
            }
        } else {
            // If no game is running, start one at level 1
            this.loadLevel(1);
        }
    }
}