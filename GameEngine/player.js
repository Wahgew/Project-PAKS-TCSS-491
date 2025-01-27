class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});


        console.log("Game engine in player:", this.game);
        console.log("Timer in game engine:", this.game.timer);
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

        // Movement constants, currently same values for Mario's movement in SMB from Marriott.
        const MIN_WALK = 20;
        const MAX_WALK = 500;
        const MAX_RUN = 1000;
        const ACC_WALK = 650;
        const ACC_RUN = 1250;
        const DEC_REL = 900;
        const DEC_SKID = 1800;
        const MIN_SKID = 180; // not used?

        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const STOP_FALL_A = 450;
        const WALK_FALL_A = 421.875;
        const RUN_FALL_A = 562.5;
        const MAX_FALL = 1350;
        const MAX_JUMP = 750;

        // HORIZONTAL MOVEMENT/PHYSICS
        if (this.state !== 4) { // if player is not jumping
            // idle, walking, running, skidding ground physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {
                this.velocity.x = 0;
                this.state = 0;
                if (this.game.keys['a'] && !this.game.keys['s']) {
                    this.velocity.x -= MIN_WALK;
                    // console.log("Game engine in player:", this.game);
                    // console.log("Timer in game engine:", this.game.timer);
                    // this.game.timer.stop();
                    // console.log("Timer in game engine:", this.game.timer);
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
                if (Math.abs(this.velocity.x) < MIN_WALK) { // collisions to detect if grounded implemented.
                    this.velocity.y = -MAX_JUMP;
                    this.fallAcc = STOP_FALL;
                }
                else if (Math.abs(this.velocity.x) < MAX_WALK) {
                    this.velocity.y = -MAX_JUMP;
                    this.fallAcc = WALK_FALL;
                }
                else {
                    this.velocity.y = -MAX_JUMP;
                    this.fallAcc = RUN_FALL;
                }
                this.state = 4;
                this.isGrounded = false;
            }

        } else { // player is in air
            /* if (this.velocity.y < 0 && (this.game.keys['w'] || this.game.keys['space'])) { // velocity.y physics
                if (this.fallAcc === STOP_FALL) this.velocity.y -= (STOP_FALL - STOP_FALL_A) * TICK;
                if (this.fallAcc === WALK_FALL) this.velocity.y -= (WALK_FALL - WALK_FALL_A) * TICK;
                if (this.fallAcc === RUN_FALL) this.velocity.y -= (RUN_FALL - RUN_FALL_A) * TICK;
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

        // if (this.velocity.y >= MAX_JUMP) this.velocity.y = MAX_JUMP;
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
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.xScale, this.yScale);
    }

}