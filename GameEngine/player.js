class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 120;
        this.width = 109;
        this.xScale = 120; // Used to scale sprite, but hitbox is still same as height and width
        this.yScale = 109; // see above
        this.isGrounded = true;

        this.game.Player = this;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/temptest.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 1, 0.1);

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
        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const MAX_FALL = 1350;
        const MAX_JUMP = 750;

        // Block collision detection
        if (this.map) {
            // Get the tiles the player might be colliding with
            const tileSize = this.map.testSize;

            // Calculate the tiles the player is intersecting with
            const leftTile = Math.floor(this.x / tileSize);
            const rightTile = Math.floor((this.x + this.width) / tileSize);
            const topTile = Math.floor(this.y / tileSize);
            const bottomTile = Math.floor((this.y + this.height) / tileSize);

            this.isGrounded = false; // Reset grounded state

            // Check each potentially colliding tile
            for (let row = topTile; row <= bottomTile; row++) {
                for (let col = leftTile; col <= rightTile; col++) {
                    // Make sure we're within map bounds
                    if (row >= 0 && row < this.map.map.length &&
                        col >= 0 && col < this.map.map[0].length) {

                        if (this.map.map[row][col] === 1) { // If it's a solid block
                            // Calculate overlap areas
                            const blockLeft = col * tileSize;
                            const blockRight = blockLeft + tileSize;
                            const blockTop = row * tileSize;
                            const blockBottom = blockTop + tileSize;

                            // Collision resolution
                            if (this.x + this.width > blockLeft &&
                                this.x < blockRight &&
                                this.y + this.height > blockTop &&
                                this.y < blockBottom) {

                                // Calculate overlap amounts
                                const overlapLeft = (this.x + this.width) - blockLeft;
                                const overlapRight = blockRight - this.x;
                                const overlapTop = (this.y + this.height) - blockTop;
                                const overlapBottom = blockBottom - this.y;

                                // Find smallest overlap
                                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                                // Resolve based on smallest overlap
                                if (minOverlap === overlapTop && this.velocity.y >= 0) {
                                    // Landing on top of block
                                    this.y = blockTop - this.height;
                                    this.velocity.y = 0;
                                    this.isGrounded = true;
                                }
                                else if (minOverlap === overlapBottom && this.velocity.y < 0) {
                                    // Hitting bottom of block
                                    this.y = blockBottom;
                                    this.velocity.y = 0;
                                }
                                else if (minOverlap === overlapLeft && this.velocity.x > 0) {
                                    // Hitting left side of block
                                    this.x = blockLeft - this.width;
                                    this.velocity.x = 0;
                                }
                                else if (minOverlap === overlapRight && this.velocity.x < 0) {
                                    // Hitting right side of block
                                    this.x = blockRight;
                                    this.velocity.x = 0;
                                }
                            }
                        }
                    }
                }
            }
        }

        // HORIZONTAL MOVEMENT
        if (this.isGrounded) {
            // Ground movement physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {
                this.velocity.x = 0;
                this.state = 0;
                if (this.game.keys['a'] && !this.game.keys['s']) {
                    this.velocity.x -= MIN_WALK;
                }
                if (this.game.keys['d'] && !this.game.keys['s']) {
                    this.velocity.x += MIN_WALK;
                }
            } else if (Math.abs(this.velocity.x) >= MIN_WALK) {
                if (this.facing === 0) { // left
                    if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) {
                        if (this.game.keys['shift']) {
                            this.velocity.x -= ACC_RUN * TICK;
                            this.state = 2;
                        } else {
                            this.velocity.x -= ACC_WALK * TICK;
                            this.state = 1;
                        }
                    } else if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) {
                        this.velocity.x += DEC_SKID * TICK;
                        this.state = 3;
                    } else {
                        this.velocity.x += DEC_REL * TICK;
                        this.state = 1;
                    }
                }
                if (this.facing === 1) { // right
                    if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) {
                        if (this.game.keys['shift']) {
                            this.velocity.x += ACC_RUN * TICK;
                            this.state = 2;
                        } else {
                            this.velocity.x += ACC_WALK * TICK;
                            this.state = 1;
                        }
                    } else if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) {
                        this.velocity.x -= DEC_SKID * TICK;
                        this.state = 3;
                    } else {
                        this.velocity.x -= DEC_REL * TICK;
                        this.state = 1;
                    }
                }
            }

            // Jump initialization
            if ((this.game.keys['space'] || this.game.keys['w'])) {
                this.velocity.y = -MAX_JUMP;
                this.fallAcc = Math.abs(this.velocity.x) < MIN_WALK ? STOP_FALL :
                    Math.abs(this.velocity.x) < MAX_WALK ? WALK_FALL : RUN_FALL;
                this.state = 4;
                this.isGrounded = false;
            }
        } else {
            // Air movement physics
            if (this.game.keys['a'] && !this.game.keys['d']) {
                this.velocity.x -= (Math.abs(this.velocity.x) > MAX_WALK ? ACC_RUN : ACC_WALK) * TICK;
            } else if (this.game.keys['d'] && !this.game.keys['a']) {
                this.velocity.x += (Math.abs(this.velocity.x) > MAX_WALK ? ACC_RUN : ACC_WALK) * TICK;
            }
        }

        // Apply gravity only when not grounded
        if (!this.isGrounded) {
            this.velocity.y += this.fallAcc * TICK;
        }

        // Max velocity calculations
        this.velocity.x = Math.max(-MAX_RUN, Math.min(MAX_RUN, this.velocity.x));
        if (!this.game.keys['shift']) {
            this.velocity.x = Math.max(-MAX_WALK, Math.min(MAX_WALK, this.velocity.x));
        }
        this.velocity.y = Math.max(-MAX_FALL, Math.min(MAX_FALL, this.velocity.y));

        // Update position
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

        // Wall collisions
        if (this.map) {
            const mapWidth = this.map.map[0].length * this.map.testSize;
            if (this.x < 0) {
                this.x = 0;
                this.velocity.x = 0;
            }
            if (this.x > mapWidth - this.width) {
                this.x = mapWidth - this.width;
                this.velocity.x = 0;
            }
        }

        // Update facing direction
        if (this.velocity.x < 0) this.facing = 0;
        if (this.velocity.x > 0) this.facing = 1;

        // Debug logging
        if (this.game.options.debugging) {
            const time = Date.now();
            if (!this.lastDebugLogTime || time - this.lastDebugLogTime >= 3000) {
                console.log("Player state:", {
                    position: {x: this.x, y: this.y},
                    velocity: {x: this.velocity.x, y: this.velocity.y},
                    state: this.state,
                    facing: this.facing,
                    isGrounded: this.isGrounded
                });
                this.lastDebugLogTime = time;
            }
        }
    }

    draw(ctx) {
        if (!ctx) return;

        if (this.game.options.debugging) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.xScale, this.yScale);
    }
}