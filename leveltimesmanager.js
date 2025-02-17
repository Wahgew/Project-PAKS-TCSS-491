class LevelTimesManager {
    constructor() {
        this.bestTimes = this.loadBestTimes();
    }

    // Load best times from localStorage
    loadBestTimes() {
        const savedTimes = localStorage.getItem('levelBestTimes');
        if (!savedTimes) {
            // Initialize with default times if nothing is saved
            const defaultTimes = {};
            // You can add as many levels as you want
            for (let i = 0; i < 10; i++) {  // Initialize first 10 levels
                defaultTimes[i] = 9000000000;
            }
            localStorage.setItem('levelBestTimes', JSON.stringify(defaultTimes));
            return defaultTimes;
        }

        // Parse the saved times and ensure all values are numbers
        const times = JSON.parse(savedTimes);
        Object.keys(times).forEach(key => {
            times[key] = Number(times[key]);
        });
        return times;
    }

    // Save best times to localStorage
    saveBestTimes() {
        // Ensure all values are numbers before saving
        Object.keys(this.bestTimes).forEach(key => {
            this.bestTimes[key] = Number(this.bestTimes[key]);
        });
        localStorage.setItem('levelBestTimes', JSON.stringify(this.bestTimes));
    }

    // Get best time for a specific level
    getBestTime(levelNumber) {
        // Convert to number and provide default if not found
        return Number(this.bestTimes[levelNumber]) || 9000000000;
    }

    updateBestTime(levelNumber, currentTime) {
        // Ensure we're working with numbers
        currentTime = Number(currentTime);
        const bestTime = this.getBestTime(levelNumber);

        console.log(`Checking level ${levelNumber} - Current: ${currentTime}, Best: ${bestTime}`);

        if (currentTime < bestTime) {
            this.bestTimes[levelNumber] = currentTime;
            this.saveBestTimes();
            console.log(`New best time for level ${levelNumber}: ${this.formatTime(currentTime)}`);
            return true;
        }
        return false;
    }

    // Resets best time for selected map, call manually in main
    resetBestTime (levelNumber, newBestTime){
        this.bestTimes[levelNumber] = newBestTime;
    }

    /**
     * Resets all level times to the default value
     */
    resetAllTimes() {
        // Reset all existing levels to default time
        Object.keys(this.bestTimes).forEach(level => {
            this.bestTimes[level] = 9000000000;
        });

        // Save the reset times
        this.saveBestTimes();
        console.log('All level times have been reset to default');

        // Optional: Debug print to confirm reset
        this.debugPrintAllTimes();
    }

    // Format time for display (converts seconds to MM:SS.ms format)
    formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const milliseconds = Math.floor((timeInSeconds % 1) * 100);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    // Add method to help with debugging
    debugPrintAllTimes() {
        console.log("All stored best times:");
        Object.keys(this.bestTimes).forEach(level => {
            console.log(`Level ${level}: ${this.formatTime(this.bestTimes[level])}`);
        });
    }
}