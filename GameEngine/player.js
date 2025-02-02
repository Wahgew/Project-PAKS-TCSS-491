class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 76;
        this.width = 60;

        this.game.Player = this;

        // Load individual spritesheets for each action
        this.idleSpritesheet = ASSET_MANAGER.getAsset("./sprites/idle.png");
        this.runSpritesheet = ASSET_MANAGER.getAsset("./sprites/run.png");
        this.jumpSpritesheet = ASSET_MANAGER.getAsset("./sprites/jump.png");

        this.testSprite = ASSET_MANAGER.getAsset("./sprites/temptest.png");
        this.testAnimator = new Animator(this.testSprite, 0, 0, 54, 60, 1, 1);

        this.facing = 1; // 0 = left, 1 = right
        this.state = 0; // 0 = idle, 1 = walking, 2 = running, 3 = skidding, 4 = in air, 5 = crouching/sliding
        this.dead = false;
        this.isGrounded = true;
        this.fallAcc = 550; // should be same value as GRAVITY const in update();

        this.velocity = {x: 0, y: 0};

        this.updateBB();

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

    updateBB() {
        if (this.state != 5) { // player not crouching/sliding
            this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        }
        else { // player is crouching
            this.BB = new BoundingBox(this.x, this.y + this.height / 2, this.width, this.height / 2);
        }
    };

    updateLastBB() {
        this.lastBB = this.BB;
    };

    update() {
        const TICK = this.game.clockTick;

        // Movement constants, currently same values for Mario's movement in SMB from Marriott.
        const MIN_WALK = 20;
        const MAX_WALK = 500;
        const MAX_RUN = 1000;

        const ACC_WALK = 650;
        const ACC_RUN = 1250;

        const DEC_REL = 600;
        const DEC_SKID = 1800;

        const MAX_FALL = 2000;
        const GRAVITY = 1500;
        const GRAVITY_JUMP = 350; // Lowered "gravity" for holding jump
        const MAX_JUMP = 750;

        // HORIZONTAL MOVEMENT/PHYSICS
        if (this.state !== 4) { // if player is not jumping
            // idle, walking, running, skidding ground physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {
                this.velocity.x = 0;
                this.state = 0;
                if (this.game.keys['a'] && !this.game.keys['s']) {
                    this.velocity.x -= MIN_WALK;
                }
                if (this.game.keys['d'] && !this.game.keys['s']) {
                    this.velocity.x += MIN_WALK;
                }
            } else if (Math.abs(this.velocity.x) >= MIN_WALK) { // accelerating or decelerating
                if (this.facing === 0) { // left
                    if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) { // moving
                        if (this.game.keys['shift']) { // if sprinting
                            this.velocity.x -= ACC_RUN * TICK;
                            this.state = 2;
                        } else {
                            this.velocity.x -= ACC_WALK * TICK;
                            this.state = 1;
                        }
                    } else if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) { // skidding
                        this.velocity.x += DEC_SKID * TICK;
                        this.state = 3
                    } else { // holding nothing
                        this.velocity.x += DEC_REL * TICK;
                        this.state = 1;
                    }
                }
                if (this.facing === 1) { // right
                    if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) { // moving
                        if (this.game.keys['shift']) { // if sprinting
                            this.velocity.x += ACC_RUN * TICK;
                            this.state = 2;
                        } else {
                            this.velocity.x += ACC_WALK * TICK;
                            this.state = 1;
                        } 
                    } else if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) { // skidding
                        this.velocity.x -= DEC_SKID * TICK;
                        this.state = 3
                    } else { // holding nothing
                        this.velocity.x -= DEC_REL * TICK;
                        this.state = 1;
                    }
                }
            }

            if ((this.game.keys['space'] || this.game.keys['w']) && this.isGrounded) { // jump is infinite, need to have
                this.velocity.y = -MAX_JUMP;                            // collisions to detect if grounded implemented.
                this.state = 4;
                this.isGrounded = false;
            }

        } else { // player is in air
            this.fallAcc = GRAVITY; // check implementation of this, make sure fallAcc is switching correctly
            /* if (this.velocity.y < 0 && (this.game.keys['w'] || this.game.keys['space'])) { // velocity.y physics
                this.fallAcc = GRAVITY_JUMP;
            }  */
            if (this.game.keys['a'] && !this.game.keys['d']) { // velocity.x physics
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

        // if (this.velocity.y >= MAX_JUMP) this.velocity.y = MAX_JUMP; // is this even needed?
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

        // Update position
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

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
        
        // Update BoundingBoxes
        this.updateLastBB();
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && entity instanceof Projectile && that.BB.collide(entity.BB)) {
                entity.removeFromWorld = true;
                that.dead = true;
            }
        });

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
            const time = Date.now(); // this seems jank but i don't know how to do it better
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
            // Draw debug box
            if (this.state === 5) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y + this.height / 2, this.width, this.height / 2);
            } else {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        } 

        // Draw the sprite for current state and facing direction
        //this.animations[this.state][0][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.5);
        this.testAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

}