class LevelTimesManager {
    constructor() {
        this.dbName = 'LevelTimesDB';
        this.storeName = 'levelTimes';
        this.db = null;
        this.DEFAULT_TIME = 9000000000;
        this.NUMBER_OF_LEVELS = 10;
        this.dbReady = this.initializeDB();
    }

    // Initialize the IndexedDB database
    async initializeDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'levelNumber' });

                    // Initialize default times for all levels
                    for (let i = 0; i < this.NUMBER_OF_LEVELS; i++) {
                        store.put({ levelNumber: i, time: this.DEFAULT_TIME });
                    }
                    console.log('Object store created and initialized with default times');
                }
            };
        });
    }

    // Ensure database is ready before any operation
    async ensureDBReady() {
        if (!this.db) {
            console.log("Database not ready, waiting...");
            await this.dbReady;
            console.log("Database now ready");
        }
    }


    // Get best time for a specific level
    async getBestTime(levelNumber) {
        await this.ensureDBReady();

        // Convert to number to ensure proper comparison
        levelNumber = Number(levelNumber);

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(levelNumber);

            request.onsuccess = () => {
                const result = request.result;
                const bestTime = result ? result.time : this.DEFAULT_TIME;
                console.log(`Retrieved best time for level ${levelNumber}: ${bestTime}`);
                resolve(bestTime);
            };

            request.onerror = (event) => {
                console.error('Error getting time:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Update best time for a level
    async updateBestTime(levelNumber, currentTime) {
        await this.ensureDBReady();

        // Convert params to numbers to ensure proper comparison
        levelNumber = Number(levelNumber);
        currentTime = Number(currentTime);

        const bestTime = await this.getBestTime(levelNumber);

        console.log(`Checking level ${levelNumber} - Current: ${currentTime}, Best: ${bestTime}`);

        if (currentTime < bestTime) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put({ levelNumber, time: currentTime });

                request.onsuccess = () => {
                    console.log(`New best time for level ${levelNumber}: ${this.formatTime(currentTime)}`);
                    resolve(true);
                };

                request.onerror = (event) => {
                    console.error('Error updating time:', event.target.error);
                    reject(event.target.error);
                };
            });
        }
        console.log("Not a new best time");
        return false;
    }

    // Reset best time for a specific level
    async resetBestTime(levelNumber) {
        await this.ensureDBReady();

        // Convert to number to ensure proper operation
        levelNumber = Number(levelNumber);

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put({ levelNumber, time: this.DEFAULT_TIME });

            request.onsuccess = () => {
                console.log(`Reset time for level ${levelNumber}`);
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error resetting time:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Reset all times to default
    async resetAllTimes() {
        await this.ensureDBReady();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // Clear existing data
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                // Add default times for all levels
                let completed = 0;

                for (let i = 0; i < this.NUMBER_OF_LEVELS; i++) {
                    const request = store.put({ levelNumber: i, time: this.DEFAULT_TIME });

                    request.onsuccess = () => {
                        completed++;
                        if (completed === this.NUMBER_OF_LEVELS) {
                            console.log('All level times have been reset to default');
                            this.debugPrintAllTimes();
                            resolve();
                        }
                    };

                    request.onerror = (event) => {
                        console.error('Error resetting times:', event.target.error);
                        reject(event.target.error);
                    };
                }
            };

            clearRequest.onerror = (event) => {
                console.error('Error clearing times:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Format time (kept the same as original)
    formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const milliseconds = Math.floor((timeInSeconds % 1) * 100);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    // Debug print all times
    async debugPrintAllTimes() {
        await this.ensureDBReady();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                console.log("All stored best times:");
                request.result.forEach(entry => {
                    console.log(`Level ${entry.levelNumber}: ${this.formatTime(entry.time)}`);
                });
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error getting all times:', event.target.error);
                reject(event.target.error);
            };
        });
    }
}