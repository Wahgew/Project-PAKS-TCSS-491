class LevelUI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isDisplayingComplete = false;
        this.isDisplayingDeath = false;  // New explicit flag for death screen
        this.showBestTimeMsg = false;
        this.newBestTimeMsg = '';
        this.cachedBestTime = '--:--:--';  // Default value
        this.levelComplete = false;

        // Add button states for hover effects
        this.buttonStates = {
            menu: { hover: false },
            levels: { hover: false },
            continue: { hover: false }
        };

        // Track keyboard shortcuts
        this.keyboardShortcuts = {
            'm': 'menu',
            'l': 'levels',
            'enter': 'continue'
        };

        // Listen for keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Handle keyboard shortcuts
    handleKeyDown(event) {
        // Make sure gameEngine and Player exist before checking properties
        if (!this.gameEngine || !this.gameEngine.Player) return;

        // Only respond to keyboard if a UI screen is showing
        if (!this.isDisplayingComplete && !this.gameEngine.Player.dead) return;

        const key = event.key.toLowerCase();

        if (this.keyboardShortcuts[key]) {
            const action = this.keyboardShortcuts[key];
            this.handleButtonAction(action);
        }
    }

    // Handle button actions
    handleButtonAction(action) {
        switch(action) {
            case 'menu':
                // First hide the current UI
                this.hideLevelComplete();

                if (window.ELEVATOR_TRANSITION) {
                    // Use the elevator transition
                    window.ELEVATOR_TRANSITION.transition(() => {
                        // Clean up game state
                        this.cleanupGameState();

                        // Get welcome screen and show it
                        const welcomeScreen = document.getElementById("welcomeScreen");
                        if (welcomeScreen) {
                            welcomeScreen.style.display = "flex";
                        } else {
                            new WelcomeScreen(startGame, showLevels);
                        }
                    });
                } else {
                    // Fallback without transition
                    this.cleanupGameState();
                    const welcomeScreen = document.getElementById("welcomeScreen");
                    if (welcomeScreen) {
                        welcomeScreen.style.display = "flex";
                    } else {
                        new WelcomeScreen(startGame, showLevels);
                    }
                }
                break;

            case 'levels':
                // First hide the current UI
                this.hideLevelComplete();

                if (window.ELEVATOR_TRANSITION) {
                    // Use the elevator transition
                    window.ELEVATOR_TRANSITION.transition(() => {
                        // Clean up game state
                        this.cleanupGameState();

                        // Show levels screen
                        const levelsScreen = new LevelsScreen();
                        levelsScreen.show();
                    });
                } else {
                    // Fallback without transition
                    this.cleanupGameState();
                    const levelsScreen = new LevelsScreen();
                    levelsScreen.show();
                }
                break;

            case 'continue':
                console.log("Continue action, death:", this.isDisplayingDeath, "complete:", this.isDisplayingComplete);

                // If player is dead, restart current level (no transition)
                if (this.isDisplayingDeath) {
                    console.log("Restarting level from death screen");
                    this.restartLevel();
                }
                // If level is complete, go to next level (with transition)
                else if (this.isDisplayingComplete) {
                    console.log("Loading next level from complete screen");
                    this.hideLevelComplete();

                    if (this.gameEngine && this.gameEngine.levelConfig) {
                        // Check if elevator transition is available
                        if (window.ELEVATOR_TRANSITION) {
                            console.log("Using elevator transition for next level");

                            // Get the next level before transition
                            const nextLevel = this.gameEngine.levelConfig.currentLevel + 1;
                            window.CURRENT_GAME_LEVEL = nextLevel; // Update global tracking

                            // Use transition with callback
                            window.ELEVATOR_TRANSITION.transition(() => {
                                console.log("Loading next level after transition");
                                // Load the next level directly after transition
                                this.gameEngine.levelConfig.loadLevel(nextLevel);
                            });
                        } else {
                            // Fallback without transition
                            console.log("No transition available, loading next level directly");
                            this.gameEngine.levelConfig.loadNextLevel();
                        }
                    }
                }
                break;
        }
    }


    // Helper method to clean up game state before transitioning
    // Updated cleanupGameState method for LevelUI.js
    cleanupGameState() {
        // Stop the game engine properly
        if (this.gameEngine) {
            // Pause the game
            this.gameEngine.isPaused = true;

            // Stop the running flag - CRITICAL for preventing the black screen
            this.gameEngine.running = false;

            // Stop the timer if it exists
            if (this.gameEngine.timer) {
                this.gameEngine.timer.stop();
                this.gameEngine.timer.isRunning = false;
            }

            // Clear all entities and reset the game state
            this.gameEngine.entities = [];

            // Clear the canvas
            if (this.gameEngine.ctx) {
                const canvas = this.gameEngine.ctx.canvas;
                this.gameEngine.ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Hide the game canvas
            const gameCanvas = document.getElementById('gameWorld');
            if (gameCanvas) {
                gameCanvas.style.display = 'none';
            }

            // Reset important properties
            this.gameEngine.Player = null;
            this.gameEngine.entityCount = 0;
        }

        // Stop game music and play menu music
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }

        // Hide game menu if it exists
        if (window.GAME_MENU) {
            window.GAME_MENU.hide();
        }

        // Reset global variables to ensure a clean state
        window.gameEngine = null;

        console.log("Game state cleaned up, engine stopped");
    }

    // New method to update the best time cache
    async updateBestTimeCache() {
        try {
            // Make sure the levelTimesManager is available and DB is ready
            if (this.gameEngine && this.gameEngine.levelTimesManager) {
                // Wait for DB to be ready
                await this.gameEngine.levelTimesManager.dbReady;

                // Now get and cache the best time
                this.cachedBestTime = await this.getBestTime();
                console.log("Updated best time cache:", this.cachedBestTime);
            }
        } catch (error) {
            console.error("Error updating best time cache:", error);
        }
    }

    async showLevelComplete() {
        // Don't show if player is dead or UI is locked
        if (this.gameEngine.Player?.dead || this.levelComplete) return;

        // If already showing level complete, don't do anything
        if (this.isDisplayingComplete) return;

        this.isDisplayingComplete = true;

        // Update the best time cache before comparing times
        await this.updateBestTimeCache();

        if (this.gameEngine && this.gameEngine.timer && this.gameEngine.levelTimesManager) {
            const currentTime = this.gameEngine.timer.getDisplayTime();
            const currentLevel = this.gameEngine.levelConfig.currentLevel;

            console.log("Current level:", currentLevel);
            console.log("Current time:", currentTime);
            console.log("Cached best time before check:", this.cachedBestTime);

            // Try to update best time
            const isNewBest = await this.gameEngine.levelTimesManager.updateBestTime(currentLevel, currentTime);

            if (isNewBest) {
                console.log("New best time achieved!");
                this.showNewBestTime(this.gameEngine.levelTimesManager.formatTime(currentTime));
                // Update cache after we set a new best time
                await this.updateBestTimeCache();
            }
        }

        // After a short delay, allow UI to be shown again in future levels
        setTimeout(() => {
            this.levelComplete = false;
        }, 500);
    }

    showNewBestTime(formattedTime) {
        this.newBestTimeMsg = `New Best Time! ${formattedTime}`;
        this.showBestTimeMsg = true;
        console.log("Showing new best time:", this.newBestTimeMsg);
    }

    hideLevelComplete() {
        this.isDisplayingComplete = false;
        this.isDisplayingDeath = false;
        this.showBestTimeMsg = false;
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 100);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    }

    getCurrentTime() {
        if (this.gameEngine && this.gameEngine.timer) {
            return this.formatTime(this.gameEngine.timer.getDisplayTime());
        }
        return '--:--:--';
    }

    async getBestTime() {
        if (this.gameEngine && this.gameEngine.levelTimesManager && this.gameEngine.levelConfig) {
            // Make sure DB is ready
            await this.gameEngine.levelTimesManager.dbReady;

            const bestTime = await this.gameEngine.levelTimesManager.getBestTime(this.gameEngine.levelConfig.currentLevel);
            return bestTime === 9000000000 ? '--:--:--' : this.formatTime(bestTime);
        }
        return '--:--:--';
    }

    // restarts the level when player dies
    restartLevel() {
        console.log("LevelUI restartLevel called");

        // Reset UI state
        this.isDisplayingDeath = false;
        this.isDisplayingComplete = false;

        // Reset the player if it exists
        if (this.gameEngine && this.gameEngine.Player) {
            this.gameEngine.Player.restartGame();
        }

        // Reset timer if it exists
        if (this.gameEngine && this.gameEngine.timer) {
            this.gameEngine.timer.reset();
        }

        // Clear any held keys
        if (this.gameEngine) {
            for (let key in this.gameEngine.keys) {
                this.gameEngine.keys[key] = false;
            }
        }

        // Load the current level with no transition
        if (this.gameEngine && this.gameEngine.levelConfig) {
            console.log("Loading level:", this.gameEngine.levelConfig.currentLevel);
            this.gameEngine.levelConfig.loadLevel(this.gameEngine.levelConfig.currentLevel);
        }
    }

    async draw(ctx) {
        // Only draw if we're showing either death or complete screen
        if (!this.isDisplayingComplete && !this.isDisplayingDeath) return;

        // Get canvas center
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Calculate dimensions
        const boxWidth = 500;
        const boxHeight = 300;
        const boxX = centerX - boxWidth/2;
        const boxY = centerY - boxHeight/2;

        // Draw semi-transparent overlay for background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Check which screen to draw - using explicit flag for death
        if (this.isDisplayingDeath) {
            this.drawDeathScreen(ctx, boxX, boxY, boxWidth, boxHeight, centerX, centerY);
        } else if (this.isDisplayingComplete) {
            this.drawLevelComplete(ctx, boxX, boxY, boxWidth, boxHeight, centerX, centerY);
        }
    }

    // Draw the death screen with emergency theme
    drawDeathScreen(ctx, boxX, boxY, boxWidth, boxHeight, centerX, centerY) {
        // Draw red emergency panel
        const panelWidth = 400;
        const panelHeight = 300;
        const panelX = centerX - panelWidth/2;
        const panelY = centerY - panelHeight/2;

        // Red emergency panel background
        ctx.fillStyle = '#d00';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

        // Panel border
        ctx.strokeStyle = '#800';
        ctx.lineWidth = 5;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // Warning stripes at top
        const stripeHeight = 30;
        ctx.fillStyle = '#000';
        ctx.fillRect(panelX, panelY, panelWidth, stripeHeight);

        // Warning text
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('EMERGENCY STOP', centerX, panelY + 20);

        // Error display
        ctx.fillStyle = '#000';
        ctx.fillRect(panelX + 50, panelY + 60, panelWidth - 100, 50);

        ctx.font = 'bold 30px monospace';
        ctx.fillStyle = '#f00';
        ctx.textAlign = 'center';
        ctx.fillText('ELEVATOR FAULT', centerX, panelY + 95);

        // Warning icon (triangle with exclamation mark)
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.moveTo(centerX, panelY + 150);
        ctx.lineTo(centerX - 25, panelY + 190);
        ctx.lineTo(centerX + 25, panelY + 190);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('!', centerX, panelY + 180);

        // Draw buttons
        this.drawElevatorButtons(ctx, panelX, panelY, panelWidth, panelHeight, true);

        // Flashing emergency light effect
        if (Math.floor(Date.now() / 300) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }

    // Draw the regular level complete screen
    drawLevelComplete(ctx, boxX, boxY, boxWidth, boxHeight, centerX, centerY) {
        // Draw elevator arrival screen
        ctx.fillStyle = '#333'; // Dark gray for panel
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Draw border
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Add elevator door lines
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, boxY);
        ctx.lineTo(centerX, boxY + boxHeight);
        ctx.stroke();

        // Draw indicator light (green for arrived)
        const lightSize = 20;
        ctx.fillStyle = '#3f3'; // Green light
        ctx.shadowColor = '#3f3';

        ctx.beginPath();
        ctx.arc(boxX + 30, boxY + 30, lightSize, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(boxX + 30, boxY + 30, lightSize - 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Add floor display
        ctx.fillStyle = '#000';
        ctx.fillRect(boxX + boxWidth - 80, boxY + 10, 70, 40);

        // Show next level number
        const nextLevel = this.gameEngine.levelConfig.getCurrentLevel() + 1;

        // Display next level as floor number with arrow indicating direction
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ff9900'; // Orange color for next floor
        ctx.textAlign = 'center';
        ctx.fillText(`FL ${nextLevel}`, boxX + boxWidth - 55, boxY + 40);

        // Add a small label
        ctx.font = '10px monospace';
        ctx.fillStyle = '#ff9900';
        ctx.fillText('NEXT', boxX + boxWidth - 45, boxY + 20);

        // Add an up arrow to indicate direction
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.moveTo(boxX-20 + boxWidth - 10, boxY + 40);
        ctx.lineTo(boxX-20 + boxWidth - 2, boxY + 30);
        ctx.lineTo(boxX-20 + boxWidth + 2, boxY + 40);
        ctx.closePath();
        ctx.fill();

        // Add title text
        ctx.font = 'bold 40px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'center';
        ctx.fillText('FLOOR COMPLETE', centerX, boxY + 80);

        // Display times in digital display style
        const displayWidth = 300;
        const displayHeight = 40;
        const displayX = centerX - displayWidth/2;

        // Best Time display
        ctx.fillStyle = '#000'; // Black background
        ctx.fillRect(displayX, boxY + 120, displayWidth, displayHeight);

        ctx.font = '18px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'left';
        ctx.fillText('BEST TIME:', displayX + 10, boxY + 120 + 25);

        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#33ff33'; // Digital green
        ctx.textAlign = 'right';
        ctx.fillText(this.cachedBestTime, displayX + displayWidth - 10, boxY + 120 + 25);

        // Current Time display
        ctx.fillStyle = '#000'; // Black background
        ctx.fillRect(displayX, boxY + 170, displayWidth, displayHeight);

        ctx.font = '18px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'left';
        ctx.fillText('CURRENT TIME:', displayX + 10, boxY + 170 + 25);

        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#33ff33'; // Digital green
        ctx.textAlign = 'right';
        ctx.fillText(this.getCurrentTime(), displayX + displayWidth - 10, boxY + 170 + 25);

        // Draw new best time message if applicable
        if (this.showBestTimeMsg) {
            // Add a flashing effect
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.fillStyle = "#3f3"; // Green
                ctx.font = "bold 30px monospace";
                ctx.textAlign = 'center';
                ctx.fillText("NEW RECORD!", centerX, boxY - 20);
            }
        }

        // Draw elevator control buttons
        this.drawElevatorButtons(ctx, boxX, boxY, boxWidth, boxHeight, false);
    }

    // Draw the elevator control buttons
    drawElevatorButtons(ctx, boxX, boxY, boxWidth, boxHeight, isDeathScreen) {
        // Button dimensions - smaller size
        const buttonSize = 38; // Further reduced size

        // Position buttons much higher to match the mockups
        let buttonY;
        if (isDeathScreen) {
            buttonY = boxY + boxHeight - 70; // Higher up on death screen
        } else {
            buttonY = boxY + boxHeight - 60; // Higher up on complete screen
        }

        const buttonSpacing = 65; // Slightly reduced spacing

        // Calculate positions for 3 buttons
        const leftButtonX = boxX + (boxWidth / 2) - buttonSpacing - buttonSize / 2;
        const centerButtonX = boxX + (boxWidth / 2) - buttonSize / 2;
        const rightButtonX = boxX + (boxWidth / 2) + buttonSpacing - buttonSize / 2;

        // Get mouse position for hover effects
        const mouse = this.gameEngine.mouse;

        // Check for mouse hover on buttons
        if (mouse) {
            this.buttonStates.menu.hover = this.isPointInButton(mouse, leftButtonX, buttonY, buttonSize);
            this.buttonStates.levels.hover = this.isPointInButton(mouse, centerButtonX, buttonY, buttonSize);
            this.buttonStates.continue.hover = this.isPointInButton(mouse, rightButtonX, buttonY, buttonSize);

            // CHANGED: Remove the previous click handler if it exists
            if (this.clickHandler) {
                this.gameEngine.ctx.canvas.removeEventListener('click', this.clickHandler);
            }

            // CHANGED: Create a new click handler with the current button positions
            this.clickHandler = (e) => {
                // Only process clicks if either death or level complete is showing
                if (!this.isDisplayingComplete && !this.isDisplayingDeath) return;

                const rect = this.gameEngine.ctx.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const clickPoint = { x: clickX, y: clickY };

                if (this.isPointInButton(clickPoint, leftButtonX, buttonY, buttonSize)) {
                    this.handleButtonAction('menu');
                } else if (this.isPointInButton(clickPoint, centerButtonX, buttonY, buttonSize)) {
                    this.handleButtonAction('levels');
                } else if (this.isPointInButton(clickPoint, rightButtonX, buttonY, buttonSize)) {
                    this.handleButtonAction('continue');
                }
            };

            // CHANGED: Add the new click handler
            this.gameEngine.ctx.canvas.addEventListener('click', this.clickHandler);
        }

        // Set button colors based on screen type
        const buttonStyle = isDeathScreen ? {
            base: '#333',
            hover: '#333',
            border: '#800',
            hoverBorder: '#f00',
            text: '#fff',
            hoverText: '#fff',
            shadow: '#f00'
        } : {
            base: '#333',
            hover: '#333',
            border: '#555',
            hoverBorder: '#ffcc00',
            text: '#fff',
            hoverText: '#fff',
            shadow: '#ffcc00'
        };

        // Draw buttons
        this.drawElevatorButton(ctx, leftButtonX, buttonY, buttonSize,
            this.buttonStates.menu.hover, 'M', 'Home', this.drawHomeIcon, buttonStyle);

        this.drawElevatorButton(ctx, centerButtonX, buttonY, buttonSize,
            this.buttonStates.levels.hover, 'L', 'Levels', this.drawLevelsIcon, buttonStyle);

        // Different label for continue button based on screen
        if (this.gameEngine.Player?.dead) {
            this.drawElevatorButton(ctx, rightButtonX, buttonY, buttonSize,
                this.buttonStates.continue.hover, '⏎', 'Retry', this.drawRestartIcon, buttonStyle);
        } else {
            this.drawElevatorButton(ctx, rightButtonX, buttonY, buttonSize,
                this.buttonStates.continue.hover, '⏎', 'Next', this.drawNextIcon, buttonStyle);
        }

        // Display keyboard shortcut help text - positioned higher to match mockups
        ctx.font = '12px monospace';
        ctx.fillStyle = isDeathScreen ? '#fff' : '#888';
        ctx.textAlign = 'center';
        ctx.fillText('Keyboard: [M] Menu | [L] Levels | [Enter] Continue',
            boxX + boxWidth/2, buttonY - 10);
    }

    // Helper to draw a single elevator button
    drawElevatorButton(ctx, x, y, size, hover, keyHint, label, iconDrawFunction, style) {
        // Button base
        ctx.save();

        // Drop shadow for 3D effect
        if (hover) {
            ctx.shadowColor = style.shadow;
            ctx.shadowBlur = 8;
        }

        // Button shape
        ctx.fillStyle = hover ? style.hover : style.base;
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.fill();

        // Button border
        ctx.strokeStyle = hover ? style.hoverBorder : style.border;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.stroke();

        // Draw the button icon
        ctx.save();
        iconDrawFunction.call(this, ctx, x + size/2, y + size/2, size * 0.35, hover, style);
        ctx.restore();

        // Draw label below button
        ctx.fillStyle = style.text;
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + size/2, y + size + 15);

        ctx.restore();
    }

    // Icon drawing functions
    drawHomeIcon(ctx, x, y, size, hover) {
        ctx.fillStyle = hover ? '#ffcc00' : '#fff';

        // House shape
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y);
        ctx.lineTo(x - size * 0.6, y);
        ctx.lineTo(x - size * 0.6, y + size);
        ctx.lineTo(x - size * 0.2, y + size);
        ctx.lineTo(x - size * 0.2, y + size * 0.5);
        ctx.lineTo(x + size * 0.2, y + size * 0.5);
        ctx.lineTo(x + size * 0.2, y + size);
        ctx.lineTo(x + size * 0.6, y + size);
        ctx.lineTo(x + size * 0.6, y);
        ctx.lineTo(x + size, y);
        ctx.closePath();
        ctx.fill();
    }

    drawLevelsIcon(ctx, x, y, size, hover) {
        ctx.fillStyle = hover ? '#ffcc00' : '#fff';

        // Draw a grid of four squares
        const sq = size * 0.7;
        const gap = size * 0.3;

        // Upper left square
        ctx.fillRect(x - sq - gap/2, y - sq - gap/2, sq, sq);

        // Upper right square
        ctx.fillRect(x + gap/2, y - sq - gap/2, sq, sq);

        // Lower left square
        ctx.fillRect(x - sq - gap/2, y + gap/2, sq, sq);

        // Lower right square
        ctx.fillRect(x + gap/2, y + gap/2, sq, sq);
    }

    drawRestartIcon(ctx, x, y, size, hover) {
        const color = hover ? '#ffcc00' : '#fff';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;

        // Bottom left arc
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, Math.PI * 7/12, Math.PI * 11/12);
        ctx.stroke();

        // Top left arc
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, Math.PI * 13/12, Math.PI * 17/12);
        ctx.stroke();

        // Top right arc
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, Math.PI * 19/12, Math.PI * 23/12);
        ctx.stroke();

        // Bottom right arc
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, Math.PI * 1/12, Math.PI * 5/12);
        ctx.stroke();

        // Draw the four arrows at the connection points
        this.drawArrow(ctx, x, y, size * 0.8, Math.PI * 11/12, color);
        this.drawArrow(ctx, x, y, size * 0.8, Math.PI * 17/12, color);
        this.drawArrow(ctx, x, y, size * 0.8, Math.PI * 23/12, color);
        this.drawArrow(ctx, x, y, size * 0.8, Math.PI * 5/12, color);
    }

    // Helper method to draw each arrow
    drawArrow(ctx, centerX, centerY, radius, angle, color) {
        const arrowSize = radius * 0.15; // Increased arrow size for visibility

        // Calculate the position where the arrow should be drawn
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Save current context state
        ctx.save();

        // Move to the arrow position and rotate to the correct angle
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Draw the arrow
        ctx.beginPath();
        ctx.moveTo(-arrowSize, -arrowSize);
        ctx.lineTo(0, 0);
        ctx.lineTo(arrowSize, -arrowSize);
        ctx.stroke();

        // Restore context state
        ctx.restore();
    }

    drawNextIcon(ctx, x, y, size, hover) {
        ctx.fillStyle = hover ? '#ffcc00' : '#fff';

        // Draw a right-pointing arrow
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y - size);
        ctx.closePath();
        ctx.fill();
    }

    // Helper to check if a point is within a button
    isPointInButton(point, x, y, size) {
        if (!point) return false;

        const dx = point.x - (x + size/2);
        const dy = point.y - (y + size/2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= size/2;
    }

    // resets the ui when loading a new level
    resetUIState() {
        // Reset UI flags
        this.isDisplayingComplete = false;
        this.isDisplayingDeath = false;
        this.showBestTimeMsg = false;
        this.newBestTimeMsg = '';

        // Reset button states
        this.buttonStates = {
            menu: { hover: false },
            levels: { hover: false },
            continue: { hover: false }
        };

        // Remove click handler if it exists
        if (this.clickHandler && this.gameEngine && this.gameEngine.ctx && this.gameEngine.ctx.canvas) {
            this.gameEngine.ctx.canvas.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }

        console.log("LevelUI state reset");
    }
}