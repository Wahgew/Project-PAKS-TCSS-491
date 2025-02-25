class LevelUI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isDisplayingComplete = false;
        this.showBestTimeMsg = false;
        this.newBestTimeMsg = '';
        this.cachedBestTime = '--:--:--';  // Default value
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
            // Make sure DB is ready
            await this.gameEngine.levelTimesManager.dbReady;

            const bestTime = await this.gameEngine.levelTimesManager.getBestTime(this.gameEngine.levelConfig.currentLevel);
            return bestTime === 9000000000 ? '--:--:--' : this.formatTime(bestTime);
        }
        return '--:--:--';
    }

    async draw(ctx) {
        if (!this.isDisplayingComplete) return;

        // If we're displaying level complete but don't have cached best time yet,
        // make sure we update it
        if (this.cachedBestTime === '--:--:--') {
            await this.updateBestTimeCache();
        }

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