class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 76;
        this.width = 20;

        this.game.Player = this;

        // Load individual spritesheets for each action
        this.idleSpritesheet = ASSET_MANAGER.getAsset("./sprites/idle.png");
        this.runSpritesheet = ASSET_MANAGER.getAsset("./sprites/run.png");
        this.jumpSpritesheet = ASSET_MANAGER.getAsset("./sprites/jump.png");

        this.facing = 1; // 0 = left, 1 = right
        this.state = 0; // 0 = idle, 1 = walking, 2 = running, 3 = skidding, 4 = in air, 5 = crouching/sliding
        this.dead = false;
        this.isGrounded = true;
        this.fallAcc = 550; // should be same value as GRAVITY const in update();

        this.velocity = {x: 0, y: 0};

        //this.updateBB();

        this.animations = [];
        this.loadAnimations();


        this.map = this.game.entities.find(entity => entity instanceof testMap); 
        if (this.map) {
            console.log("Map found, tile size:", this.map.testSize);
        } else {
            console.error("Map not found");
        }
    }
    loadAnimations() {
        // Create a 3D array to store animations by [state][size][direction]
        for (let i = 0; i < 7; i++) {
            this.animations.push([]);
            for (let j = 0; j < 3; j++) {
                this.animations[i].push([]);
                for (let k = 0; k < 2; k++) {
                    this.animations[i][j].push([]);
                }
            }
        }

        // Parameters for Animator:
        // (spritesheet, xStart, yStart, width, height, frameCount, frameDuration)
        
        // Idle animation (assuming 905x175 sprite sheet with 5 frames)
        this.animations[0][0][1] = new Animator(
            this.idleSpritesheet, 
            0,    // xStart
            5,    // yStart
            170,  // width (905/5)
            175,  // height
            2,    // frameCount
            0.17  // frameDuration (adjust for speed)
        );
        
        // Mirror for left-facing idle
        this.animations[0][0][0] = new Animator(
            this.idleSpritesheet,
            0, 0, 181, 175, 5, 0.17
        );

        // Add similar adjustments for run and jump animations...
        // Run animation
        this.animations[1][0][1] = new Animator(
            this.runSpritesheet,
            0, 0, 181, 175, 5, 0.1
        );
        
        this.animations[1][0][0] = new Animator(
            this.runSpritesheet,
            0, 0, 181, 175, 5, 0.1
        );

        // Jump animation
        this.animations[2][0][1] = new Animator(
            this.jumpSpritesheet,
            0, 0, 181, 175, 2, 0.2
        );
        
        this.animations[2][0][0] = new Animator(
            this.jumpSpritesheet,
            0, 0, 181, 175, 2, 0.2
        );
    }

    // updateBB() {
    //     if (this.size === 0 || this.size === 3) {
    //         this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    //     }
    //     else {
    //         if (this.game.down) // big mario is crouching
    //             this.BB = new BoundingBox(this.x, this.y + PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    //         else 
    //             this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
    //     }
    // };


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
        const MAX_FALL = 2000;
        const GRAVITY = 1500;
        const GRAVITY_JUMP = 350;
        const MAX_JUMP = 750;

        // HORIZONTAL MOVEMENT/PHYSICS
        if (this.state !== 4) {
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
                if (this.facing === 0) {
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
                if (this.facing === 1) {
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

            if ((this.game.keys['space'] || this.game.keys['w']) && this.isGrounded) {
                this.velocity.y = -MAX_JUMP;
                this.state = 4;
                this.isGrounded = false;
            }
        } else {
            this.fallAcc = GRAVITY;
            if (this.game.keys['a'] && !this.game.keys['d']) {
                if (Math.abs(this.velocity.x) > MAX_WALK) {
                    this.velocity.x -= ACC_RUN * TICK;
                } else this.velocity.x -= ACC_WALK * TICK;
            } else if (this.game.keys['d'] && !this.game.keys['a']) {
                if (Math.abs(this.velocity.x) > MAX_WALK) {
                    this.velocity.x += ACC_RUN * TICK;
                } else this.velocity.x += ACC_WALK * TICK;
            }
        }

        // Apply fall acceleration
        this.velocity.y += this.fallAcc * TICK;

        // Max velocity calculations
        if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
        if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
        if (this.velocity.x >= MAX_WALK && !this.game.keys['shift']) this.velocity.x = MAX_WALK;
        if (this.velocity.x <= -MAX_WALK && !this.game.keys['shift']) this.velocity.x = -MAX_WALK;
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

        // Calculate next position
        let nextX = this.x + this.velocity.x * TICK;
        nextX = Math.max(0, Math.min(nextX, this.map.map[0].length * this.map.testSize - this.width));
        let nextY = this.y + this.velocity.y * TICK;

        // Get map dimensions
        const mapWidth = this.map.map[0].length * this.map.testSize;
        const mapHeight = this.map.map.length * this.map.testSize;

        // Constrain nextX to map boundaries
        if (nextX < 0) {
            nextX = 0;
            this.velocity.x = 0;
        } else if (nextX + this.width > mapWidth) {
            nextX = mapWidth - this.width;
            this.velocity.x = 0;
        }

        // Constrain nextY to map boundaries
        if (nextY < 0) {
            nextY = 0;
            this.velocity.y = 0;
        } else if (nextY + this.height > mapHeight) {
            nextY = mapHeight - this.height;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // Create temporary bounding boxes for collision checks
        const horizontalBB = new BoundingBox(nextX, this.y, this.width, this.height);
        const verticalBB = new BoundingBox(this.x, nextY, this.width, this.height);

        // Check horizontal collision
        const horizontalCollision = this.map.checkCollisions({
            BB: horizontalBB,
            x: nextX,
            y: this.y,
            width: this.width,
            height: this.height
        });

        // Apply horizontal movement
        if (horizontalCollision.collides) {
            if (this.velocity.x > 0) {  // Moving right
                this.x = horizontalCollision.tileX - this.width;
            } else if (this.velocity.x < 0) {  // Moving left
                this.x = horizontalCollision.tileX + this.map.testSize;
            }
            this.velocity.x = 0;
        } else {
            this.x = nextX;
        }

        // Check vertical collision
        const verticalCollision = this.map.checkCollisions({
            BB: verticalBB,
            x: this.x,
            y: nextY,
            width: this.width,
            height: this.height
        });

        // Apply vertical movement
        if (verticalCollision.collides) {
            if (this.velocity.y > 0) { // Falling
                this.y = verticalCollision.tileY - this.height;
                this.velocity.y = 0;
                this.isGrounded = true;
            } else if (this.velocity.y < 0) { // Jumping
                this.y = verticalCollision.tileY + this.map.testSize;
                this.velocity.y = 0;
            }
        } else {
            this.y = nextY;
            // Only set isGrounded to false if we're not at the bottom of the map
            if (this.isGrounded && this.y + this.height < mapHeight) {
                this.isGrounded = false;
            }
        }

        // Update bounding box after all position changes
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

        // Update State of player
        if (this.state != 4) {
            if (this.game.keys['s']) this.state = 5;
            else if (Math.abs(this.velocity.x) > MAX_WALK) this.state = 2;
            else if (Math.abs(this.velocity.x) >= MIN_WALK) this.state = 1;
            else this.state = 0;
        } else if (this.state == 4 && this.isGrounded) {
            if (Math.abs(this.velocity.x) > MAX_RUN) {
                this.state = 2;
            } else if (Math.abs(this.velocity.x) > MAX_WALK) {
                this.state = 1;
            } else {
                this.state = 0;
            }
        }

        // Update facing
        if (this.velocity.x < 0) this.facing = 0;
        if (this.velocity.x > 0) this.facing = 1;

        // Debug logging
        if (this.game.options.debugging) {
            const time = Date.now();
            if (!this.lastDebugLogTime || time - this.lastDebugLogTime >= 3000) {
                console.log("Player position:", this.x, this.y);
                console.log("Player velocity:", this.velocity.x, this.velocity.y);
                console.log("Is grounded:", this.isGrounded);
                this.lastDebugLogTime = time;
            }
        }
    }

    draw(ctx) {
        if (!ctx) return;

        // if (this.game.options.debugging) {
        //     // Draw debug box
        //     ctx.strokeStyle = 'red';
        //     ctx.strokeRect(this.x, this.y, this.width, this.height);
        // }

        // Draw the sprite for current state and facing direction
        this.animations[this.state][0][this.facing].drawFrame(
            this.game.clockTick,
            ctx,
            this.x - 37,  // Offset sprite left to center collision box on visible sprite
            this.y,
            0.5
        );

        if (this.game.options.debugging) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

    }

}