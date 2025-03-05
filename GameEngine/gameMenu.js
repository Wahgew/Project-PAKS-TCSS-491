// simpleGameMenu.js - A simplified menu button implementation

class GameMenu {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.visible = false;
        this.menuButton = null;
        this.menuPanel = null;
        this.isGameRunning = false;
        
        // Create the button and panel
        this.createMenuButton();
        this.createMenuPanel();
        
        // Initialize listeners
        this.initEventListeners();
    }
    
    createMenuButton() {
        // Create a simple button element
        this.menuButton = document.createElement('button');
        this.menuButton.id = 'gameMenuButton';
        this.menuButton.style.position = 'fixed';
        this.menuButton.style.top = '20px';
        this.menuButton.style.right = '80px';
        this.menuButton.style.width = '40px';
        this.menuButton.style.height = '40px';
        this.menuButton.style.border = 'none';
        this.menuButton.style.borderRadius = '5px';
        this.menuButton.style.padding = '0';
        this.menuButton.style.cursor = 'pointer';
        this.menuButton.style.zIndex = '1000';
        this.menuButton.style.backgroundImage = 'url("./sprites/menu.png")';
        this.menuButton.style.backgroundSize = 'contain';
        this.menuButton.style.backgroundPosition = 'center';
        this.menuButton.style.backgroundRepeat = 'no-repeat';
        this.menuButton.style.display = 'none'; // Hidden by default
        
        // Add click handler
        this.menuButton.onclick = () => this.toggleMenu();
        
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
    }
    
    showMenu() {
        this.menuPanel.style.display = 'flex';
        this.visible = true;
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
    }
    
    // Hide the menu button when game exits
    hide() {
        this.menuButton.style.display = 'none';
        this.hideMenu();
        this.isGameRunning = false;
    }
    
    // Menu actions
    resumeGame() {
        if (this.gameEngine.isPaused) {
            this.gameEngine.isPaused = false;
        }
        this.hideMenu();
    }
    
    pauseGame() {
        if (!this.gameEngine.isPaused) {
            this.gameEngine.isPaused = true;
        }
        this.hideMenu();
    }
    
    showLevels() {
        this.hide(); // Hide menu first
        const levelsScreen = new LevelsScreen();
        levelsScreen.show();
    }
    
    exitGame() {
        this.hide(); // Hide menu first
        
        // Stop game music and play menu music
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
        
        // Return to welcome screen
        new WelcomeScreen(startGame, showLevels);
        
        // Stop game engine
        this.gameEngine.stop();
    }
}

// Create a global reference
let SIMPLE_GAME_MENU;