// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
        this.isRunning = true;
        this.savedTime = 0;
        console.log("Timer constructed, isRunning set to:", this.isRunning);
    };

    /**
     * @returns gameDelta, the time in seconds since the last tick. Very small value,
     * is 0.006-0.008 seconds on my machine. (Ken)
     */
    tick() {
        if (!this.isRunning) {
            console.log("Tick called while not running");
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
        // console.log("isRunning value:", this.isRunning);
        // console.log("Current stack trace:", new Error().stack);
        if (this.isRunning) {
            console.log("Timer stopped at:", this.gameTime.toFixed(2));
            this.isRunning = false;
            this.savedTime = this.gameTime;
            this.lastTimestamp = 0;  // Reset timestamp
        }
    }

    // start the time
    start() {
        // console.log("Start method called, isRunning was:", this.isRunning);
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTimestamp = Date.now();  // Reset timestamp to avoid huge delta
        }
    }

    // reset timer for new level
    reset() {
        // console.log("Reset method called, isRunning was:", this.isRunning);
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