// GameMenu implementation with level tracking
class GameMenu {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.visible = false;
        this.menuButton = null;
        this.menuPanel = null;
        this.isGameRunning = false;
        
        // Create the elements
        this.createMenuButton();
        this.createMenuPanel();
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    createMenuButton() {
        this.menuButton = document.createElement('button');
        this.menuButton.id = 'gameMenuButton';
        this.menuButton.style.position = 'fixed';
        this.menuButton.style.top = '22px';
        this.menuButton.style.right = '80px';
        this.menuButton.style.width = '32px';
        this.menuButton.style.height = '32px';
        this.menuButton.style.border = 'none';
        this.menuButton.style.borderRadius = '5px';
        this.menuButton.style.padding = '0';
        this.menuButton.style.cursor = 'pointer';
        this.menuButton.style.zIndex = '1000';
        this.menuButton.style.backgroundImage = 'url("./sprites/menu.png")';
        this.menuButton.style.backgroundSize = 'contain';
        this.menuButton.style.backgroundPosition = 'center';
        this.menuButton.style.backgroundRepeat = 'no-repeat';
        this.menuButton.style.display = 'block'; // Ensure it's visible
        
        // Add smooth animation
        this.menuButton.style.transition = 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out';
    
        // Hover effect (Add shadow)
        this.menuButton.onmouseover = () => {
            this.menuButton.style.boxShadow = '0px 0px 15px rgba(211, 211, 211, 0.5)'; 
        };
    
        // Remove shadow on mouse leave
        this.menuButton.onmouseout = () => {
            this.menuButton.style.boxShadow = 'none'; // Remove shadow
        };
    
        // Click animation and menu toggle
        this.menuButton.onclick = () => {
            this.menuButton.style.transform = 'scale(0.9)'; 
            setTimeout(() => {
                this.menuButton.style.transform = 'scale(1)';
            }, 100);
            this.toggleMenu();
        };
    
        // Add to document
        document.body.appendChild(this.menuButton);
    }
    
    createMenuPanel() {
        // Create menu panel
        this.menuPanel = document.createElement('div');
        this.menuPanel.id = 'gameMenuPanel';
        this.menuPanel.style.position = 'fixed';
        this.menuPanel.style.top = '70px';
        this.menuPanel.style.right = '80px';
        this.menuPanel.style.width = '120px';
        this.menuPanel.style.padding = '10px';
        this.menuPanel.style.backgroundColor = '#333';
        this.menuPanel.style.borderRadius = '10px';
        this.menuPanel.style.border = '2px solid #555';
        this.menuPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        this.menuPanel.style.display = 'none';
        this.menuPanel.style.flexDirection = 'column';
        this.menuPanel.style.alignItems = 'center';
        this.menuPanel.style.zIndex = '1000';
        
        // Add menu options
        const menuOptions = [
            { text: 'Pause', action: () => this.pauseGame() },
            { text: 'Resume', action: () => this.resumeGame() },
            { text: 'Levels', action: () => this.showLevels() },
            { text: 'Reset Times', action: () => this.showResetTimesConfirmation() },
            { text: 'Exit', action: () => this.exitGame() }
        ];
        
        menuOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.style.width = '100%';
            button.style.margin = '5px 0';
            button.style.padding = '8px';
            button.style.backgroundColor = '#444';
            button.style.color = '#ffcc00';
            button.style.border = '1px solid #555';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontFamily = "'Molot', sans-serif";
            
            button.onmouseover = function() {
                this.style.backgroundColor = '#555';
            };
            
            button.onmouseout = function() {
                this.style.backgroundColor = '#444';
            };
            
            button.onclick = option.action;
            
            this.menuPanel.appendChild(button);
        });
        
        // Add to document
        document.body.appendChild(this.menuPanel);
    }
    
    initEventListeners() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.visible && 
                e.target !== this.menuButton && 
                !this.menuPanel.contains(e.target)) {
                this.hideMenu();
            }
        });
        
        // Add keyboard shortcut (Escape key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isGameRunning) {
                if (this.visible) {
                    this.hideMenu();
                } else {
                    this.showMenu();
                }
            }
        });
    }
    
    showMenu() {
        this.menuPanel.style.display = 'flex';
        this.visible = true;
        
        // Pause the game when menu is shown
        if (this.gameEngine && !this.gameEngine.isPaused) {
            this.gameEngine.isPaused = true;
        }
    }
    
    hideMenu() {
        this.menuPanel.style.display = 'none';
        this.visible = false;
    }
    
    toggleMenu() {
        if (this.visible) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }
    
    // Show the menu button when game starts
    show() {
        this.menuButton.style.display = 'block';
        this.isGameRunning = true;
        
        // Make sure game canvas is visible
        const gameCanvas = document.getElementById('gameWorld');
        if (gameCanvas) {
            gameCanvas.style.display = 'block';
        }
    }
    
    // Hide the menu button when game exits
    hide() {
        this.menuButton.style.display = 'none';
        this.hideMenu();
        this.isGameRunning = false;
    }
    
    // Menu actions
    pauseGame() {
        if (this.gameEngine) {
            // Pause the game engine
            this.gameEngine.isPaused = true;
            
            // Pause the timer if it exists by calling its stop method
            if (this.gameEngine.timer && this.gameEngine.timer.isRunning) {
                this.gameEngine.timer.stop();
                console.log("Timer paused at:", this.gameEngine.timer.getDisplayTime().toFixed(2));
            }
        }
        this.hideMenu();
    }
    
    // Updated resumeGame method to properly restart the timer
    resumeGame() {
        if (this.gameEngine) {
            // Resume the game engine
            this.gameEngine.isPaused = false;
            
            // Resume the timer if it exists by calling its start method
            if (this.gameEngine.timer && !this.gameEngine.timer.isRunning) {
                this.gameEngine.timer.start();
                console.log("Timer resumed from:", this.gameEngine.timer.getDisplayTime().toFixed(2));
            }
        }
        this.hideMenu();
    }
    
    // Modified showLevels method to pass current level information
    showLevels() {
        this.hide(); // Hide menu first
        
        // Get the current level from the game engine
        let currentLevel = 1;
        
        if (this.gameEngine && this.gameEngine.levelConfig) {
            currentLevel = this.gameEngine.levelConfig.currentLevel;
            console.log("GameMenu: Current level before showing levels screen:", currentLevel);
            
            // Make sure global current level is up to date
            window.CURRENT_GAME_LEVEL = currentLevel;
        }
        
        // Stop the game engine
        if (this.gameEngine) {
            // Pause the game
            this.gameEngine.isPaused = true;
            
            // Hide the game canvas
            const gameCanvas = document.getElementById('gameWorld');
            if (gameCanvas) {
                gameCanvas.style.display = 'none';
            }
            
            // Clear the canvas
            if (this.gameEngine.ctx) {
                const canvas = this.gameEngine.ctx.canvas;
                this.gameEngine.ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        // Play menu music instead of game music
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
        
        // Now show the levels screen with the current level
        const levelsScreen = new LevelsScreen(currentLevel);
        levelsScreen.show();
    }

    showResetTimesConfirmation() {
        // First hide the menu
        this.hideMenu();

        // Create the confirmation dialog overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '2000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Create the confirmation dialog panel with elevator aesthetic
        const panel = document.createElement('div');
        panel.style.width = '400px';
        panel.style.backgroundColor = '#333';
        panel.style.borderRadius = '10px';
        panel.style.border = '4px solid #555';
        panel.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.6)';
        panel.style.padding = '20px';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.alignItems = 'center';

        // Add elevator-style header
        const header = document.createElement('div');
        header.style.width = '100%';
        header.style.backgroundColor = '#222';
        header.style.color = '#ffcc00';
        header.style.padding = '10px';
        header.style.marginBottom = '20px';
        header.style.borderRadius = '5px';
        header.style.textAlign = 'center';
        header.style.fontFamily = "'Molot', sans-serif";
        header.style.fontSize = '18px';
        header.style.fontWeight = 'bold';
        header.textContent = 'DATA RESET CONFIRMATION';
        panel.appendChild(header);

        // Add warning icon (circle with exclamation)
        const warningIcon = document.createElement('div');
        warningIcon.style.width = '50px';
        warningIcon.style.height = '50px';
        warningIcon.style.borderRadius = '50%';
        warningIcon.style.backgroundColor = '#ffcc00';
        warningIcon.style.color = '#333';
        warningIcon.style.display = 'flex';
        warningIcon.style.justifyContent = 'center';
        warningIcon.style.alignItems = 'center';
        warningIcon.style.fontSize = '30px';
        warningIcon.style.fontWeight = 'bold';
        warningIcon.style.marginBottom = '20px';
        warningIcon.textContent = '!';
        panel.appendChild(warningIcon);

        // Add message text
        const message = document.createElement('div');
        message.style.width = '100%';
        message.style.color = '#fff';
        message.style.textAlign = 'center';
        message.style.marginBottom = '20px';
        message.style.fontFamily = "'Molot', sans-serif";
        message.style.fontSize = '16px';
        message.innerHTML = 'Are you sure you want to reset all level times?<br><br>This action cannot be undone.';
        panel.appendChild(message);

        // Add button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.width = '80%';

        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'CANCEL';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.backgroundColor = '#444';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = '2px solid #555';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontFamily = "'Molot', sans-serif";
        cancelButton.style.fontSize = '14px';
        cancelButton.style.width = '45%';

        cancelButton.onmouseover = function() {
            this.style.backgroundColor = '#555';
        };

        cancelButton.onmouseout = function() {
            this.style.backgroundColor = '#444';
        };

        cancelButton.onclick = function() {
            document.body.removeChild(overlay);
        };

        buttonContainer.appendChild(cancelButton);

        // Add confirm button
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'RESET TIMES';
        confirmButton.style.padding = '10px 20px';
        confirmButton.style.backgroundColor = '#aa3333';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = '2px solid #cc4444';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.fontFamily = "'Molot', sans-serif";
        confirmButton.style.fontSize = '14px';
        confirmButton.style.width = '45%';

        confirmButton.onmouseover = function() {
            this.style.backgroundColor = '#cc3333';
        };

        confirmButton.onmouseout = function() {
            this.style.backgroundColor = '#aa3333';
        };

        confirmButton.onclick = () => {
            // Reset all times
            if (this.gameEngine && this.gameEngine.levelTimesManager) {
                this.gameEngine.levelTimesManager.resetAllTimes();

                // Show a confirmation message
                message.innerHTML = 'All level times have been reset.';
                message.style.color = '#33ff33'; // Green success message

                buttonContainer.innerHTML = ''; // Remove both buttons

                // Add OK button
                const okButton = document.createElement('button');
                okButton.textContent = 'OK';
                okButton.style.padding = '10px 20px';
                okButton.style.backgroundColor = '#444';
                okButton.style.color = '#fff';
                okButton.style.border = '2px solid #555';
                okButton.style.borderRadius = '5px';
                okButton.style.cursor = 'pointer';
                okButton.style.fontFamily = "'Molot', sans-serif";
                okButton.style.fontSize = '14px';
                okButton.style.width = '50%';

                okButton.onmouseover = function() {
                    this.style.backgroundColor = '#555';
                };

                okButton.onmouseout = function() {
                    this.style.backgroundColor = '#444';
                };

                okButton.onclick = function() {
                    document.body.removeChild(overlay);
                };

                buttonContainer.appendChild(okButton);
                buttonContainer.style.justifyContent = 'center';
            } else {
                document.body.removeChild(overlay);
            }
        };

        buttonContainer.appendChild(confirmButton);
        panel.appendChild(buttonContainer);

        // Add elevator lights effect (decorative)
        const lightsContainer = document.createElement('div');
        lightsContainer.style.display = 'flex';
        lightsContainer.style.justifyContent = 'space-between';
        lightsContainer.style.width = '70%';
        lightsContainer.style.marginTop = '20px';

        // Create 5 small LED lights
        for (let i = 0; i < 5; i++) {
            const light = document.createElement('div');
            light.style.width = '8px';
            light.style.height = '8px';
            light.style.borderRadius = '50%';
            light.style.backgroundColor = '#33ff33'; // Green LEDs
            light.style.boxShadow = '0 0 5px #33ff33';

            // Animate the lights with different timings
            light.style.animation = `blink ${1 + i * 0.2}s infinite`;
            lightsContainer.appendChild(light);
        }

        // Add the keyframe animation for blinking
        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes blink {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }
    `;
        document.head.appendChild(style);

        panel.appendChild(lightsContainer);

        // Add panel to overlay and overlay to document
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Add keyboard listener for Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    exitGame() {
        this.hide(); 
    
        // Ensure the game engine is stopped
        if (this.gameEngine) {
            this.gameEngine.running = false; // Stop the game loop
            this.gameEngine.entities = []; // Clear all entities
            this.gameEngine.ctx.clearRect(0, 0, this.gameEngine.ctx.canvas.width, this.gameEngine.ctx.canvas.height);
        }
        // Stop game music and play menu music
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
        // Hide game canvas
        const gameCanvas = document.getElementById('gameWorld');
        if (gameCanvas) {
            gameCanvas.style.display = 'none';
        }
        // Play elevator door sequence before showing the welcome screen
        new ElevatorDoorSequence(() => {
            new WelcomeScreen(startGame, showLevels);
        });
    }
}

// Create a global reference for easy access
let GAME_MENU;