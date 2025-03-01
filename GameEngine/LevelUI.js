class LevelUI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isDisplayingComplete = false;
        this.showBestTimeMsg = false;
        this.newBestTimeMsg = '';
        this.cachedBestTime = '--:--:--';  // Default value
        this.levelCompelte = false;
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
        // If already showing level complete or locked, don't do anything
        if (this.isDisplayingComplete || this.levelCompelte) return;

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
            this.levelCompelte = false;
        }, 500);
    }

    showNewBestTime(formattedTime) {
        this.newBestTimeMsg = `New Best Time! ${formattedTime}`;
        this.showBestTimeMsg = true;
        console.log("Showing new best time:", this.newBestTimeMsg);
    }

    hideLevelComplete() {
        this.isDisplayingComplete = false;
        this.showBestTimeMsg = false;

        // Add small delay before allowing another completion to be shown
        this.levelCompelte = true;
        setTimeout(() => {
            this.levelCompelte = false;
        }, 500);
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

        // Get canvas center
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Calculate dimensions for our elevator announcement display
        const boxWidth = 500;
        const boxHeight = 300;
        const boxX = centerX - boxWidth/2;
        const boxY = centerY - boxHeight/2;

        // Draw semi-transparent overlay for background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
        ctx.beginPath();
        ctx.arc(boxX + 30, boxY + 30, lightSize, 0, Math.PI * 2);
        ctx.fill();
        // Add glow effect
        ctx.shadowColor = '#3f3';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(boxX + 30, boxY + 30, lightSize - 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Add floor display
        ctx.fillStyle = '#000';
        ctx.fillRect(boxX + boxWidth - 80, boxY + 10, 70, 40);

        // Calculate next floor number
        const nextLevel = this.gameEngine.levelConfig.getCurrentLevel() + 1

        // Display next level as floor number with arrow indicating direction
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ff9900'; // Orange color for next floor
        ctx.textAlign = 'center';
        ctx.fillText(`FL ${nextLevel}`, boxX + boxWidth - 55, boxY + 40);

        // Add a small "next" label
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

//         // Add next floor display
//         ctx.fillStyle = '#000'; // Black background for digital display
//         ctx.fillRect(boxX + boxWidth - 80, boxY + 60, 70, 40);
//
// // Calculate next floor number
//         const nextLevel = this.gameEngine.levelConfig.getCurrentLevel() + 1;
//
// // Display next level as floor number with arrow indicating direction
//         ctx.font = 'bold 24px monospace';
//         ctx.fillStyle = '#ff9900'; // Orange color for next floor
//         ctx.textAlign = 'center';
//         ctx.fillText(`FL ${nextLevel}`, boxX + boxWidth - 45, boxY + 85);
//
// // Add a small "next" label
//         ctx.font = '10px monospace';
//         ctx.fillStyle = '#ff9900';
//         ctx.fillText('NEXT', boxX + boxWidth - 45, boxY + 72);
//
// // Add an up arrow to indicate direction
//         ctx.fillStyle = '#ff9900';
//         ctx.beginPath();
//         ctx.moveTo(boxX + boxWidth - 15, boxY + 80);
//         ctx.lineTo(boxX + boxWidth - 5, boxY + 70);
//         ctx.lineTo(boxX + boxWidth + 5, boxY + 80);
//         ctx.closePath();
//         ctx.fill();

        // Add "ARRIVED" text
        ctx.font = 'bold 40px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'center';
        ctx.fillText('FLOOR COMPLETE', centerX, boxY + 80);

        // Add "Next floor" text
        ctx.font = '24px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press ENTER to continue', centerX, boxY + boxHeight - 40);

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
    }
}