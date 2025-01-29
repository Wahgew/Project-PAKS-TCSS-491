// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
        this.isRunning = true;
        this.savedTime = 0;
    };

    tick() {
        if (!this.isRunning) {
            return 0;  // Return 0 delta when stopped
        }

        const current = Date.now();

        // Only update lastTimestamp and calculate delta if the timer is running
        if (this.lastTimestamp === 0) {
            this.lastTimestamp = current;
            return 0;
        }

        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    };

    // Stop the current game timer
    stop() {
        if (this.isRunning) {
            console.log("Timer stopped at:", this.gameTime.toFixed(2));
            this.isRunning = false;
            this.savedTime = this.gameTime;
            this.lastTimestamp = 0;  // Reset timestamp
        }
    }

    // start the time
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTimestamp = Date.now();  // Reset timestamp to avoid huge delta
        }
    }

    // reset timer for new level
    reset() {
        this.gameTime = 0;
        this.lastTimestamp = 0;
        this.isRunning = true;
        this.savedTime = 0;
    }

    // Get the time to display (either current running time or saved stopped time)
    getDisplayTime() {
        if (this.isRunning) {
            return this.gameTime;
        } else {
            return this.savedTime;
        }
    }
}
