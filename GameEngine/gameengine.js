// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        this.ctx = null;

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

        // Options and the Details
        this.options = options || {
            debugging: false,
        };

        // wait for DOM to load before accessing elements
        window.addEventListener("DOMContentLoaded", () => {
            this.debugBox = document.getElementById("debug");

            if (this.debugBox) {
                this.options.debugging = this.debugBox.checked; // Initialize debugging option

                // event listener to update debugging option when checkbox is toggled
                this.debugBox.addEventListener("change", (e) => {
                    this.options.debugging = e.target.checked;

                    console.log("Debug mode:", this.options.debugging);
                });
            }
        });
    }

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
        this.levelUI = new LevelUI(this);
        this.levelTimesManager = new LevelTimesManager();
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
            console.log("Key pressed:", event.key.toLowerCase());
            this.keys[event.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", event => {
            console.log("Key released:", event.key.toLowerCase());
            this.keys[event.key.toLowerCase()] = false;
        });

        // Mouse events remain on canvas
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            this.mouse = getXandY(e);
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

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        document.getElementById('resetTimes').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all level times?')) {
                gameEngine.levelTimesManager.resetAllTimes();
            }
        });

        // test timer reset and stop
        // test level completion display
        window.addEventListener("keydown", event => {
            this.keys[event.key.toLowerCase()] = true;

            // // Test level completion with 'L' key
            // if (event.key.toLowerCase() === 'l') {
            //     console.log("Stopping timer...");
            //     if (this.timer) {
            //         //this.timer.stop();
            //
            //         // re-draw timer display
            //         this.levelUI.showLevelComplete();
            //         this.draw();
            //     }
            // }
            // // Test level reset with 'R' key
            // if (event.key.toLowerCase() === 'r') {
            //     console.log("Resetting timer...");
            //     if (this.timer) {
            //         this.timer.reset();
            //         this.levelUI.hideLevelComplete();
            //     }
            // }

            if (event.key.toLowerCase() === 'enter') {
                this.levelUI.hideLevelComplete();
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

        // Log canvas state before clearing
        /* console.log("Canvas state before clear:", {
            width: this.ctx.canvas.width,
            height: this.ctx.canvas.height,
            transform: this.ctx.getTransform()
        }); */

        // Clear with a visible color first to verify clearing works
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Reset any transformations
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Draw from front to back (map first, then entities)
        // Find and draw map first
        const mapEntity = this.entities.find(entity => entity instanceof drawMap);
        if (mapEntity) {
            this.ctx.save();
            mapEntity.draw(this.ctx);
            this.ctx.restore();
        }

        // Then draw all other entities
        this.entities.forEach(entity => {
            if (!(entity instanceof drawMap)) {
                if (this.options.debugging) {
                    const time = Date.now()
                    if (!this.lastDebugLogTime || time - this.lastDebugLogTime >= 3000) {
                        console.log("Drawing entity:", entity);
                        this.lastDebugLogTime = time;
                    }
                }
                this.ctx.save();
                entity.draw(this.ctx);
                this.ctx.restore();
            }
        });

        // draw timer
        if (this.timer) {
            const displayTime = this.timer.getDisplayTime();
            const minutes = Math.floor(displayTime / 60);
            const seconds = Math.floor(displayTime % 60);
            const milliseconds = Math.floor((displayTime % 1) * 100);


            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;

            // text style
            this.ctx.font = '20px monospace';

            // Create background for better readability
            const padding = 5;
            const textMetrics = this.ctx.measureText(formattedTime);
            const textHeight = 24;

            this.ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
            this.ctx.fillRect(0, 0, textMetrics.width + padding * 2, textHeight + padding * 2);

            // Draw text
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(formattedTime, 5, 25);

            // Only start the timer if it's not explicitly stopped
            if (this.timer.isRunning) {
                this.timer.start();
            }
        }

        this.levelUI.draw(this.ctx);

        // draws the x y pos following the cursor
        if (this.options.debugging && this.mouse) {
            this.ctx.font = "12px Arial";
            this.ctx.fillStyle = "red";

            let offsetX = 10; // Adjust to prevent overlap with cursor
            let offsetY = 20;

            this.ctx.fillText(`(${this.mouse.x}, ${this.mouse.y})`, this.mouse.x + offsetX, this.mouse.y + offsetY);
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
