class LevelProgressManager {
    constructor() {
        this.dbName = 'LevelProgressDB';
        this.storeName = 'levelProgress';
        this.db = null;
        this.NUMBER_OF_LEVELS = 12;
        this.dbReady = this.initializeDB();
        
        // Initialize global level tracker if it doesn't exist
        if (typeof window.CURRENT_GAME_LEVEL === 'undefined') {
            window.CURRENT_GAME_LEVEL = 1;
            console.log("Initialized CURRENT_GAME_LEVEL to 1");
        }
        
        // Initialize hooks when instance is created
        this.setupLevelCompletionHook();
    }

    isDebugModeEnabled() {
        return document.getElementById("debug") && document.getElementById("debug").checked;
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
                console.log('Level Progress Database opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    
                    // Create single progress record with arrays for unlocked and completed levels
                    store.put({
                        id: 'progressData',
                        unlockedLevels: [1], // Level 1 is always unlocked by default
                        completedLevels: []
                    });
                }
            };
        });
    }

    // Ensure database is ready before any operation
    async ensureDBReady() {
        if (!this.db) {
            await this.dbReady;
        }
    }

    // Get the current progress
    async getProgress() {
        await this.ensureDBReady();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get('progressData');

            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    resolve(result);
                } else {
                    // This shouldn't happen, but just in case
                    const defaultProgress = {
                        id: 'progressData',
                        unlockedLevels: [1],
                        completedLevels: []
                    };
                    resolve(defaultProgress);
                }
            };

            request.onerror = (event) => {
                console.error('Error getting progress:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Save the progress
    async saveProgress(progressData) {
        await this.ensureDBReady();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(progressData);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error saving progress:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Check if a level is unlocked
    async isLevelUnlocked(levelNumber) {
        if (this.isDebugModeEnabled()) {
            return true;
        }
        
        const progress = await this.getProgress();
        return progress.unlockedLevels.includes(Number(levelNumber));
    }
    
    // Override isLevelCompleted to consider debug mode
    async isLevelCompleted(levelNumber) {
        if (this.isDebugModeEnabled() && levelNumber === 12) {
            // In debug mode, consider level 12 always completed to unlock special levels
            return true;
        }
        
        const progress = await this.getProgress();
        return progress.completedLevels.includes(Number(levelNumber));
    }

    // Unlock a new level
    async unlockLevel(levelNumber) {
        const progress = await this.getProgress();
        
        if (!progress.unlockedLevels.includes(Number(levelNumber))) {
            progress.unlockedLevels.push(Number(levelNumber));
            await this.saveProgress(progress);
        }
    }

    // Mark a level as completed and unlock the next level
    async completeLevel(levelNumber) {
        const progress = await this.getProgress();
        
        // Mark as completed if not already
        if (!progress.completedLevels.includes(Number(levelNumber))) {
            progress.completedLevels.push(Number(levelNumber));
            
            // Unlock the next level (if it's a valid level)
            const nextLevel = Number(levelNumber) + 1;
            if (nextLevel <= this.NUMBER_OF_LEVELS && !progress.unlockedLevels.includes(nextLevel)) {
                progress.unlockedLevels.push(nextLevel);
            }
            
            await this.saveProgress(progress);
        }
    }

    // Reset all progress (for debugging)
    async resetProgress() {
        await this.ensureDBReady();

        const defaultProgress = {
            id: 'progressData',
            unlockedLevels: [1],
            completedLevels: []
        };

        await this.saveProgress(defaultProgress);
        
        // Reset global current level
        window.CURRENT_GAME_LEVEL = 1;
        
        // Update the levels screen if it's visible
        this.updateLevelsScreenIfVisible();
    }
    
    // Unlock all levels for debugging/testing
    async unlockAllLevels() {
        try {
            for (let i = 1; i <= this.NUMBER_OF_LEVELS; i++) {
                await this.unlockLevel(i);
            }
            
            // Update the levels screen if it's visible
            this.updateLevelsScreenIfVisible();
        } catch (error) {
            console.error("Error unlocking levels:", error);
        }
    }
    
    // Helper to update the levels screen if it's visible
    async updateLevelsScreenIfVisible() {
        const levelsScreen = document.getElementById("levelsScreen");
        if (levelsScreen && levelsScreen.style.display !== "none") {
            for (let key in window) {
                if (window[key] instanceof LevelsScreen) {
                    await window[key].updateLevelButtonStates();
                    break;
                }
            }
        }
    }
    
    // Setup hooks to detect level changes in the game
    setupLevelCompletionHook() {
        // Initialize hooks when DOM loads or with delay
        document.addEventListener('DOMContentLoaded', () => {
            this.hookLevelCompletion();
            this.hookLevelLoading();
        });
        
        setTimeout(() => {
            this.hookLevelCompletion();
            this.hookLevelLoading();
        }, 1000);
    }
    
    // Hook into level completion in LevelConfig
    hookLevelCompletion() {
        if (typeof LevelConfig !== 'undefined') {
            const originalLoadNextLevel = LevelConfig.prototype.loadNextLevel;
            LevelConfig.prototype.loadNextLevel = function() {
                const completedLevel = this.currentLevel;
                
                if (originalLoadNextLevel) {
                    originalLoadNextLevel.call(this);
                } else {
                    if (this.currentLevel < 12) {
                        this.currentLevel += 1;
                        this.loadLevel(this.currentLevel);
                    }
                }
                
                // Update the global current level to the NEW level after completion
                window.CURRENT_GAME_LEVEL = this.currentLevel;
                console.log("Level completed. New CURRENT_GAME_LEVEL:", window.CURRENT_GAME_LEVEL);
                
                if (window.LEVEL_PROGRESS) {
                    window.LEVEL_PROGRESS.completeLevel(completedLevel)
                        .catch(err => console.error('Error completing level:', err));
                }
            };
            console.log("Level completion hook installed");
        }
    }
    
    // Hook into direct level loading
    hookLevelLoading() {
        if (typeof LevelConfig !== 'undefined') {
            const originalLoadLevel = LevelConfig.prototype.loadLevel;
            if (originalLoadLevel) {
                LevelConfig.prototype.loadLevel = function(level) {
                    // Call the original method
                    originalLoadLevel.call(this, level);
                    
                    // Update global current level whenever any level is loaded
                    window.CURRENT_GAME_LEVEL = level;
                    console.log("Level loaded directly. CURRENT_GAME_LEVEL updated to:", window.CURRENT_GAME_LEVEL);
                };
                console.log("Level loading hook installed");
            }
        }
    }
}

// Add global debug functions
window.unlockAllLevels = async function() {
    if (window.LEVEL_PROGRESS) {
        try {
            // First complete level 12 to unlock the special levels
            await window.LEVEL_PROGRESS.completeLevel(12);
            
            // Then unlock all regular levels 1-12
            for (let i = 1; i <= 12; i++) {
                await window.LEVEL_PROGRESS.unlockLevel(i);
                // Also mark them as completed for visual indication
                await window.LEVEL_PROGRESS.completeLevel(i);
            }
            
            // And also unlock special levels 13-16
            for (let i = 13; i <= 16; i++) {
                // No need to formally "unlock" these as they're controlled by level 12 completion
                console.log(`Special level ${i} is now accessible`);
            }
            
            // Update the levels screen if it's visible
            const levelsScreen = document.getElementById("levelsScreen");
            if (levelsScreen && levelsScreen.style.display !== "none") {
                for (let key in window) {
                    if (window[key] instanceof LevelsScreen) {
                        await window[key].updateLevelButtonStates();
                        break;
                    }
                }
            }
            
            console.log("All levels have been unlocked, including special levels");
        } catch (error) {
            console.error("Error unlocking levels:", error);
        }
    }
};

window.resetLevelProgress = async function() {
    if (window.LEVEL_PROGRESS) {
        try {
            await window.LEVEL_PROGRESS.resetProgress();
            
            // Reset global level tracking
            window.CURRENT_GAME_LEVEL = 1;
            
            const levelsScreen = document.getElementById("levelsScreen");
            if (levelsScreen && levelsScreen.style.display !== "none") {
                for (let key in window) {
                    if (window[key] instanceof LevelsScreen) {
                        await window[key].updateLevelButtonStates();
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error resetting progress:", error);
        }
    }
};