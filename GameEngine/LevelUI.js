class LevelUI {

    /**
     * Constructs a LevelUI instance.
     * @param {object} gameEngine The game engine instance used for timing and game logic.
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isDisplayingComplete = false;
        this.bestTime = Infinity;
    }

    /**
     * Displays the level complete screen and updates the best time if applicable.
     */
    showLevelComplete() {
        this.isDisplayingComplete = true;
        // Only update best time if we have a valid timer
        if (this.gameEngine && this.gameEngine.timer) {
            const currentTime = this.gameEngine.timer.getDisplayTime();
            if (currentTime < this.bestTime) {
                this.bestTime = currentTime;
            }
        }
    }

    /**
     * Hides the level complete screen.
     */
    hideLevelComplete() {
        this.isDisplayingComplete = false;
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
     * Draws the level complete screen onto the provided canvas context.
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
     */
    draw(ctx) {
        if (!this.isDisplayingComplete) return;

        // Setup text properties
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';

        // Get canvas center
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Calculate text dimensions and padding
        const padding = 20;
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
            `Best Time: ${this.bestTime === Infinity ? '--:--:--' : this.formatTime(this.bestTime)}`,
            centerX,
            centerY + 10
        );

        // Current Time - now using getCurrentTime() which has null checks
        ctx.fillText(
            `Current Time: ${this.getCurrentTime()}`,
            centerX,
            centerY + lineHeight
        );
    }
}