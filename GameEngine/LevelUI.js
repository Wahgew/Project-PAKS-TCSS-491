class LevelUI {

    /**
     * Constructs a LevelUI instance.
     * @param {object} gameEngine The game engine instance used for timing and game logic.
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isDisplayingComplete = false;
        this.showBestTimeMsg = false;
        this.newBestTimeMsg = '';
        this.bestTime = Infinity;
<<<<<<< Updated upstream
        // this.elevatorL = ASSET_MANAGER.getAsset("./sprites/elevator_left.png");
        // this.elevatorR = ASSET_MANAGER.getAsset("./sprites/elevator_right.png");
        this.elevatorLX = -960;
        this.elevatorRX = 1920;
=======
        this.elevatorL = ASSET_MANAGER.getAsset("./sprites/elevator_left.png")
>>>>>>> Stashed changes
    }

    /**
     * Displays the level complete screen and updates the best time if applicable.
     */
    showLevelComplete() {
        this.isDisplayingComplete = true;

        if (this.gameEngine && this.gameEngine.timer && this.gameEngine.levelTimesManager) {
            const currentTime = this.gameEngine.timer.getDisplayTime();
            const currentLevel = this.gameEngine.levelConfig.currentLevel;

            console.log("Current level:", currentLevel);
            console.log("Current time:", currentTime);

            // Try to update best time
            const isNewBest = this.gameEngine.levelTimesManager.updateBestTime(currentLevel, currentTime);

            if (isNewBest) {
                console.log("New best time achieved!");
                this.showNewBestTime(this.gameEngine.levelTimesManager.formatTime(currentTime));
            }
        }
    }

    /**
     * Displays a "New Best Time!" message.
     * @param {string} formattedTime The formatted best time to display.
     */
    showNewBestTime(formattedTime) {
        this.newBestTimeMsg = `New Best Time! ${formattedTime}`;
        this.showBestTimeMsg = true;
        console.log("Showing new best time:", this.newBestTimeMsg);
    }

    /**
     * Hides the level complete screen and best time.
     */
    hideLevelComplete() {
        this.isDisplayingComplete = false;
        this.showBestTimeMsg = false; // Hide the new best time message
    }

    /**
     * Formats a given time into a string with minutes, seconds, and milliseconds.
     * @param {number} time The time to format, in seconds.
     * @returns {string} The formatted time as "MM:SS:MS".
     */
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 100);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    }

    /**
     * Retrieves the current time from the game engine timer, formatted as a string.
     * @returns {string} The formatted current time or "--:--:--" if unavailable.
     */
    getCurrentTime() {
        if (this.gameEngine && this.gameEngine.timer) {
            return this.formatTime(this.gameEngine.timer.getDisplayTime());
        }
        return '--:--:--';
    }

    /**
     * Gets the best time for the current level.
     * @returns {string} The formatted best time or "--:--:--" if no best time exists.
     */
    getBestTime() {
        if (this.gameEngine && this.gameEngine.levelTimesManager && this.gameEngine.levelConfig) {
            const bestTime = this.gameEngine.levelTimesManager.getBestTime(this.gameEngine.levelConfig.currentLevel);
            if (bestTime === 9000000000) {
                return '--:--:--';
            }
            return this.formatTime(bestTime);
        }
        return '--:--:--';
    }

    /**
     * Draws the level complete screen onto the provided canvas context.
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
     */
    draw(ctx) {
        if (!this.isDisplayingComplete) return;

<<<<<<< Updated upstream
        // this.elevatorL.drawFrame(this.game.clockTick, ctx, this.elevatorLX, this.y, 1, 90);
        // this.elevatorR.drawFrame(this.game.clockTick, ctx, this.elevatorRX, this.y, 1, 90);
=======
>>>>>>> Stashed changes


        // Setup text properties
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';

        // Get canvas center
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Calculate text dimensions and padding
        const lineHeight = 40;

        // Create semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        const boxWidth = 400;
        const boxHeight = 200;
        ctx.fillRect(
            centerX - boxWidth/2,
            centerY - boxHeight/2,
            boxWidth,
            boxHeight
        );

        // Draw text
        ctx.fillStyle = '#FFFFFF';

        // Level Complete text
        ctx.font = 'bold 30px monospace';
        ctx.fillText('LEVEL COMPLETE!', centerX, centerY - lineHeight);

        // Best Time
        ctx.font = '20px monospace';
        ctx.fillText(
            `Best Time: ${this.getBestTime()}`,
            centerX,
            centerY + 10
        );

        // Current Time
        ctx.fillText(
            `Current Time: ${this.getCurrentTime()}`,
            centerX,
            centerY + lineHeight
        );

        ctx.fillText(
            'Press Enter to Continue',
            centerX,
            centerY + 30 + lineHeight
        );

        // Draw new best time message if applicable
        if (this.showBestTimeMsg) {
            ctx.fillStyle = "green";
            ctx.font = "30px Arial";
            ctx.fillText(this.newBestTimeMsg, centerX, centerY - boxHeight/2 - 20);
        }
    }
}