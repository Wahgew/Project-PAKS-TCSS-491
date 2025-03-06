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
            { text: 'Resume', action: () => this.resumeGame() },
            { text: 'Pause', action: () => this.pauseGame() },
            { text: 'Levels', action: () => this.showLevels() },
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
    resumeGame() {
        if (this.gameEngine && this.gameEngine.isPaused) {
            this.gameEngine.isPaused = false;
        }
        this.hideMenu();
    }
    
    pauseGame() {
        if (this.gameEngine && !this.gameEngine.isPaused) {
            this.gameEngine.isPaused = true;
        }
        this.hideMenu();
    }
    
    showLevels() {
        this.hide(); // Hide menu first
        
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
        
        // Now show the levels screen
        const levelsScreen = new LevelsScreen();
        levelsScreen.show();
    }
    
    exitGame() {
        this.hide(); // Hide menu first
        
        // Stop the game engine
        if (this.gameEngine) {
            this.gameEngine.stop();
            
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
        
        // Stop game music and play menu music
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
        
        // Return to welcome screen
        new WelcomeScreen(startGame, showLevels);
    }
}

// Create a global reference for easy access
let GAME_MENU;