class LevelUI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isDisplayingComplete = false;
        this.showBestTimeMsg = false;
        this.newBestTimeMsg = '';
        this.cachedBestTime = '--:--:--';  // Add cache for best time
        this.updateBestTimeCache();  // Initialize the cache
    }

    // New method to update the best time cache
    async updateBestTimeCache() {
        this.cachedBestTime = await this.getBestTime();
    }

    async showLevelComplete() {
        this.isDisplayingComplete = true;

        if (this.gameEngine && this.gameEngine.timer && this.gameEngine.levelTimesManager) {
            const currentTime = this.gameEngine.timer.getDisplayTime();
            const currentLevel = this.gameEngine.levelConfig.currentLevel;

            console.log("Current level:", currentLevel);
            console.log("Current time:", currentTime);

            // Try to update best time
            const isNewBest = await this.gameEngine.levelTimesManager.updateBestTime(currentLevel, currentTime);

            if (isNewBest) {
                console.log("New best time achieved!");
                this.showNewBestTime(this.gameEngine.levelTimesManager.formatTime(currentTime));
                await this.updateBestTimeCache();  // Update cache when we set a new best time
            }
        }
    }

    showNewBestTime(formattedTime) {
        this.newBestTimeMsg = `New Best Time! ${formattedTime}`;
        this.showBestTimeMsg = true;
        console.log("Showing new best time:", this.newBestTimeMsg);
    }

    hideLevelComplete() {
        this.isDisplayingComplete = false;
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
            const bestTime = await this.gameEngine.levelTimesManager.getBestTime(this.gameEngine.levelConfig.currentLevel);
            return bestTime === 9000000000 ? '--:--:--' : this.formatTime(bestTime);
        }
        return '--:--:--';
    }

    draw(ctx) {
        if (!this.isDisplayingComplete) return;

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

        // Best Time - use cached value
        ctx.font = '20px monospace';
        ctx.fillText(
            `Best Time: ${this.cachedBestTime}`,
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