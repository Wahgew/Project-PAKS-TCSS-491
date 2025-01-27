// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.timer = null;
        this.running = false;

        // Options and the Details
        this.options = options || {
            debugging: true,
        };
    }

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
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
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
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

        // test timer reset and stop
        window.addEventListener("keydown", event => {
            this.keys[event.key.toLowerCase()] = true;

            // Test level completion with 'L' key
            if (event.key.toLowerCase() === 'l') {
                console.log("Stopping timer...");
                if (this.timer) {
                    this.timer.stop();
                    // re-draw timer display
                    this.draw();
                }
            }
            // Test level reset with 'R' key
            if (event.key.toLowerCase() === 'r') {
                console.log("Resetting timer...");
                if (this.timer) {
                    this.timer.reset();
                }
            }
        });


    }

    addEntity(entity) {
        if (this.options.debugging) {
            console.log("Adding entity:", entity);
        }
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
        const mapEntity = this.entities.find(entity => entity instanceof testMap);
        if (mapEntity) {
            this.ctx.save();
            mapEntity.draw(this.ctx);
            this.ctx.restore();
        }

        // Then draw all other entities
        this.entities.forEach(entity => {
            if (!(entity instanceof testMap)) {
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

    }

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        // Remove dead entities
        this.entities = this.entities.filter(entity => !entity.removeFromWorld);
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }

}

// KV Le was here :)