class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 240;
        this.width = 219;

        this.game.Player = this;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/temptest.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, 219, 240, 1, 0.1);

        this.facing = 1; // 0 = left, 1 = right
        this.state = 0; // 0 = idle, 1 = walking, 2 = running, 3 = skidding, 4 = in air, 5 = crouching/sliding
        this.dead = false;

        this.velocity = {x: 0, y: 0};
        this.fallAcc = 562.5;

        this.map = this.game.entities.find(entity => entity instanceof testMap);
        if (this.map) {
            console.log("Map found, tile size:", this.map.testSize);
        } else {
            console.error("Map not found");
        }
    }


    update() {
        const TICK = this.game.clockTick;

        // Movement constants
        const MIN_WALK = 20;
        const MAX_WALK = 500;
        const MAX_RUN = 1000;
        const ACC_WALK = 650;
        const ACC_RUN = 1250;
        const DEC_REL = 900;
        const DEC_SKID = 1800;
        const MAX_FALL = 270;

        // Handle horizontal movement
        if (this.state !== 4) { // if player is not jumping
            // No movement keys pressed - apply deceleration
            if (!this.game.keys['a'] && !this.game.keys['d']) {
                // Apply deceleration based on direction
                if (this.velocity.x > 0) {
                    this.velocity.x = Math.max(0, this.velocity.x - DEC_REL * TICK);
                } else if (this.velocity.x < 0) {
                    this.velocity.x = Math.min(0, this.velocity.x + DEC_REL * TICK);
                }
                this.state = 0;
            } else {
                // Movement keys are pressed
                if (this.game.keys['a'] && !this.game.keys['d']) {
                    this.facing = 0;
                    if (this.velocity.x > 0) {
                        // If moving right, apply skid deceleration
                        this.velocity.x = Math.max(-MAX_WALK, this.velocity.x - DEC_SKID * TICK);
                        this.state = 3;
                    } else {
                        // Moving left
                        const acceleration = this.game.keys['shift'] ? ACC_RUN : ACC_WALK;
                        this.velocity.x = Math.max(-MAX_WALK, this.velocity.x - acceleration * TICK);
                        this.state = this.game.keys['shift'] ? 2 : 1;
                    }
                }
                if (this.game.keys['d'] && !this.game.keys['a']) {
                    this.facing = 1;
                    if (this.velocity.x < 0) {
                        // If moving left, apply skid deceleration
                        this.velocity.x = Math.min(MAX_WALK, this.velocity.x + DEC_SKID * TICK);
                        this.state = 3;
                    } else {
                        // Moving right
                        const acceleration = this.game.keys['shift'] ? ACC_RUN : ACC_WALK;
                        this.velocity.x = Math.min(MAX_WALK, this.velocity.x + acceleration * TICK);
                        this.state = this.game.keys['shift'] ? 2 : 1;
                    }
                }
            }
        }

        // Apply gravity
        this.velocity.y += this.fallAcc * TICK;

        // Apply max speed limits
        if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

        // Update position
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

        // Ground collision
        if (this.map) {
            const groundY = (this.map.map.length - 1) * this.map.testSize - this.height;
            if (this.y >= groundY) {
                this.y = groundY;
                this.velocity.y = 0;
            }
        }

        // Wall collisions
        if (this.map) {
            const mapWidth = this.map.map[0].length * this.map.testSize;
            if (this.x < 0) {
                this.x = 0;
                this.velocity.x = 0; // Stop horizontal movement at wall
            }
            if (this.x > mapWidth - this.width) {
                this.x = mapWidth - this.width;
                this.velocity.x = 0; // Stop horizontal movement at wall
            }
        }

        // Debug logging
        if (this.game.options.debugging) {
            console.log("Player state:", {
                position: {x: this.x, y: this.y},
                velocity: {x: this.velocity.x, y: this.velocity.y},
                state: this.state,
                facing: this.facing
            });
        }
    }

    draw(ctx) {
        if (!ctx) return;

        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

}