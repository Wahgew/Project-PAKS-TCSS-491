// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        this.ctx = null;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };

        // timer initialization
        this.timer = null;
        this.running = false;

        // display level ending ui
        this.levelUI = new LevelUI(this.ctx);

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // store player instance
        this.Player = null;
        this.entityCount = 0;
    }

    // use async to wait for the DB to initialize
    async init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.initDebugMode();
        this.timer = new Timer();

        // Initialize levelTimesManager first
        this.levelTimesManager = new LevelTimesManager();

        // Wait for the database to be ready
        await this.levelTimesManager.dbReady;
        console.log("Database is ready");

        // Now initialize LevelUI after DB is ready
        this.levelUI = new LevelUI(this);

        // Update the best time cache once everything is initialized
        await this.levelUI.updateBestTimeCache();
    }

    initDebugMode() {
        // Get debug checkbox
        this.debugBox = document.getElementById("debug");

        if (this.debugBox) {
            // Set initial state
            this.options.debugging = this.debugBox.checked;

            // Create debug menu
            const debugMenu = document.createElement("div");
            debugMenu.id = "debugMenu";

            // Position menu next to debug checkbox
            const checkboxRect = this.debugBox.getBoundingClientRect();
            debugMenu.style.position = "fixed";
            debugMenu.style.left = (checkboxRect.right + 10) + "px"; // 10px gap after checkbox
            debugMenu.style.top = checkboxRect.top + "px";

            // Rest of the styling
            debugMenu.style.backgroundColor = "white";
            debugMenu.style.padding = "10px";
            debugMenu.style.border = "1px solid #ccc";
            debugMenu.style.borderRadius = "4px";
            debugMenu.style.display = this.options.debugging ? "block" : "none";
            debugMenu.style.zIndex = "1000";

            // Create level selector
            const levelSelect = document.createElement("select");
            levelSelect.style.padding = "5px";
            levelSelect.style.marginLeft = "10px";

            // Add level options
            const levels = [
                { value: 0, label: "Floor 0 (Test)" },
                { value: 1, label: "Floor 1" },
                { value: 2, label: "Floor 2" },
                { value: 3, label: "Floor 3" }
            ];

            levels.forEach(level => {
                const option = document.createElement("option");
                option.value = level.value;
                option.text = level.label;
                levelSelect.appendChild(option);
            });

            // Add label
            const label = document.createElement("label");
            label.textContent = "Level: ";
            label.style.marginRight = "5px";

            // Add elements to debug menu
            debugMenu.appendChild(label);
            debugMenu.appendChild(levelSelect);

            // Add to document
            document.body.appendChild(debugMenu);

            // Add event listeners
            this.debugBox.addEventListener("change", (e) => {
                this.options.debugging = e.target.checked;
                debugMenu.style.display = e.target.checked ? "block" : "none";
                console.log("Debug mode:", this.options.debugging);
            });

            levelSelect.addEventListener("change", (e) => {
                const level = parseInt(e.target.value);
                console.log("Loading level:", level);
                if (this.levelConfig) {
                    this.levelConfig.loadLevel(level);
                    this.levelConfig.currentLevel = level;
                }
            });

            // Initialize reset times button
            const resetButton = document.getElementById('resetTimes');
            if (resetButton) {
                resetButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to reset all level times?')) {
                        this.levelTimesManager.resetAllTimes();
                    }
                });
            }

            // Set initial value and display state
            levelSelect.value = this.levelConfig ? this.levelConfig.currentLevel : 1;
            debugMenu.style.display = this.options.debugging ? "block" : "none";
        }
    }

    getWorldCoordinates(mouseX, mouseY) {
        // Find the map entity
        const mapEntity = this.entities.find(entity => entity instanceof drawMap);
        if (!mapEntity) return { x: mouseX, y: mouseY };

        // Get the map dimensions
        const mapWidth = mapEntity.map[0].length * mapEntity.drawSize;
        const mapHeight = mapEntity.map.length * mapEntity.drawSize;

        // Get the canvas dimensions
        const canvasWidth = this.ctx.canvas.width;
        const canvasHeight = this.ctx.canvas.height;

        // Calculate the zoom factor
        const zoomX = canvasWidth / mapWidth;
        const zoomY = canvasHeight / mapHeight;
        const zoom = Math.min(zoomX, zoomY) * 0.95;

        // Calculate the offset
        const offsetX = (canvasWidth / zoom - mapWidth) / 2;
        const offsetY = (canvasHeight / zoom - mapHeight) / 2;

        // Convert from screen to world coordinates
        return {
            x: (mouseX / zoom) - offsetX,
            y: (mouseY / zoom) - offsetY
        };
    }

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    }

    startInput() {
        // Move keyboard events to window instead of canvas
        window.addEventListener("keydown", event => {
            this.keys[event.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", event => {
            this.keys[event.key.toLowerCase()] = false;
        });

        // Mouse events remain on canvas
        const getXandY = e => {
            const screenCoords = {
                x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
                y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
            };

            // Convert to world coordinates
            return this.getWorldCoordinates(screenCoords.x, screenCoords.y);
        };

        this.ctx.canvas.addEventListener("mousemove", e => {
            // Store both screen and world coordinates
            const screenCoords = {
                x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
                y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
            };

            this.mouseScreen = screenCoords;
            this.mouse = this.getWorldCoordinates(screenCoords.x, screenCoords.y);

            if (this.options.debugging) {
                console.log("MOUSE_MOVE", this.mouse);
            }
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        // test timer reset and stop
        // test level completion display
        window.addEventListener("keydown", event => {
            this.keys[event.key.toLowerCase()] = true;

            if (event.key.toLowerCase() === 'enter') {
                // Handle level complete screen
                if (this.levelUI.isDisplayingComplete && !this.Player.dead) {
                    console.log("Enter pressed on level complete screen");

                    // First hide the level complete UI
                    this.levelUI.hideLevelComplete();

                    // Add a small delay before loading the next level
                    // This prevents accidental double-presses from carrying over
                    setTimeout(() => {
                        this.levelConfig.loadNextLevel();
                    }, 100);
                }
                // Handle death screen (death screen state)
                else if (this.Player && this.Player.dead) {
                    this.levelUI.hideLevelComplete();
                    this.levelConfig.loadLevel(this.levelConfig.currentLevel); // Reload current level
                }
            }
        });
    }

    addEntity(entity) {
        if (this.options.debugging) {
            console.log("Adding entity #" + this.entityCount + ":", entity);
        }
        this.entityCount++;
        this.entities.push(entity);
    }

    draw() {
        if (!this.ctx) {
            console.error("No context found in GameEngine");
            return;
        }

        // Clear with a visible color
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Calculate zoom factor based on the map size and canvas size
        let mapEntity = this.entities.find(entity => entity instanceof drawMap);
        if (mapEntity) {
            // Get the map dimensions
            const mapWidth = mapEntity.map[0].length * mapEntity.drawSize;
            const mapHeight = mapEntity.map.length * mapEntity.drawSize;

            // Get the canvas dimensions
            const canvasWidth = this.ctx.canvas.width;
            const canvasHeight = this.ctx.canvas.height;

            // Calculate the zoom factor (smaller value wins to ensure entire map is visible)
            const zoomX = canvasWidth / mapWidth;
            const zoomY = canvasHeight / mapHeight;
            const zoom = Math.min(zoomX, zoomY) * 0.95; // 0.95 adds a small margin

            // Apply zoom transformation
            this.ctx.save();
            this.ctx.scale(zoom, zoom);

            // Center the map in the canvas
            const offsetX = (canvasWidth / zoom - mapWidth) / 2;
            const offsetY = (canvasHeight / zoom - mapHeight) / 2;
            this.ctx.translate(offsetX, offsetY);

            console.log(`Map dimensions: ${mapWidth}x${mapHeight}, Zoom: ${zoom.toFixed(2)}`);

            // Draw the map
            mapEntity.draw(this.ctx);

            // Draw all other entities with the same transformation
            this.entities.forEach(entity => {
                if (!(entity instanceof drawMap)) {
                    entity.draw(this.ctx);
                }
            });

            // Restore the context
            this.ctx.restore();

            // Draw UI elements without zoom
            this.drawUI(zoom, offsetX, offsetY);
        } else {
            // Fallback if no map is found
            this.entities.forEach(entity => {
                this.ctx.save();
                entity.draw(this.ctx);
                this.ctx.restore();
            });
        }
    }

// Add a new method to draw UI elements without the zoom transformation
    drawUI(zoom, offsetX, offsetY) {
        // Draw timer with elevator theme
        if (this.timer) {
            const displayTime = this.timer.getDisplayTime();
            const minutes = Math.floor(displayTime / 60);
            const seconds = Math.floor(displayTime % 60);
            const milliseconds = Math.floor((displayTime % 1) * 100);

            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;

            // Draw elevator-style digital display for timer
            const displayWidth = 200;
            const displayHeight = 50;
            const padding = 10;

            // Position in top center
            const displayX = (this.ctx.canvas.width / 2) - (displayWidth / 2);
            const displayY = 20;

            // Draw panel background
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(displayX, displayY, displayWidth, displayHeight);
            this.ctx.strokeStyle = '#555';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(displayX, displayY, displayWidth, displayHeight);

            // Draw inner display
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(
                displayX + padding,
                displayY + padding,
                displayWidth - padding * 2,
                displayHeight - padding * 2
            );

            // Add text "FLOOR TIME"
            this.ctx.font = '12px monospace';
            this.ctx.fillStyle = '#ffcc00';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('FLOOR TIME', displayX + padding + 5, displayY + padding + 15);

            // Draw time
            this.ctx.font = 'bold 18px monospace';
            this.ctx.fillStyle = '#33ff33'; // Digital green color
            this.ctx.textAlign = 'right';
            this.ctx.fillText(
                formattedTime,
                displayX + displayWidth - padding - 5,
                displayY + displayHeight - padding - 5
            );

            // Add small decorative LEDs
            this.ctx.fillStyle = '#3f3'; // Green LED
            this.ctx.beginPath();
            this.ctx.arc(displayX + displayWidth - 15, displayY + 10, 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Only start the timer if it's not explicitly stopped
            if (this.timer.isRunning) {
                this.timer.start();
            }
        }

        // Draw level UI (needs to be modified to work with zoom)
        if (this.levelUI) {
            this.levelUI.draw(this.ctx);
        }

        // Draw debug cursor position
        if (this.options.debugging && this.mouse) {
            this.ctx.font = "12px Arial";
            this.ctx.fillStyle = "red";

            // Convert mouse coords back to world coords
            const worldX = (this.mouse.x / zoom) - offsetX;
            const worldY = (this.mouse.y / zoom) - offsetY;

            const offsetX2 = 35; // Offset for text
            const offsetY2 = 30;

            this.ctx.fillText(`Screen: (${this.mouse.x}, ${this.mouse.y})`, this.mouse.x + offsetX2, this.mouse.y + offsetY2);
            this.ctx.fillText(`World: (${Math.round(worldX)}, ${Math.round(worldY)})`, this.mouse.x + offsetX2, this.mouse.y + offsetY2 + 15);
        }
    }

    update() {
        // Store initial entity count
        // add safety checks to handle entity removal
        let entitiesCount = this.entities.length;

        // first pass: Update all valid entities
        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            // add null check to prevent "Cannot read properties of undefined"
            // handles cases where entities might have been removed
            if (entity && !entity.removeFromWorld) {
                entity.update();
            }
        }

        // second pass: Remove marked entities
        // backward iteration prevents skipping elements when removing items
        for (var i = this.entities.length - 1; i >= 0; --i) {
            // null check for safety
            if (this.entities[i] && this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }
}
// KV Le was here :)
