class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 74;
        this.width = 20;

        // initial starting pos of player
        this.intialX = this.x;
        this.intialY = this.y;
        this.teleportHandler = null;

        // First check if player instance exists first
        if (this.game) {
            this.game.Player = this;
        } else {
            console.error("Game instance not properly initialized for player");
        }

        // Load spritesheets
        this.idleSpritesheet = ASSET_MANAGER.getAsset("./sprites/idle.png");
        this.runSpritesheet = ASSET_MANAGER.getAsset("./sprites/run.png");
        this.jumpSpritesheet = ASSET_MANAGER.getAsset("./sprites/jump.png");
        this.slideSpritesheet = ASSET_MANAGER.getAsset("./sprites/slide.png");
        this.walkSpritesheet = ASSET_MANAGER.getAsset("./sprites/walk.png");

        //Load flip animation
        this.RwalkSpritesheet = ASSET_MANAGER.getAsset("./sprites/Rwalk.png");
        this.RrunSpritesheet = ASSET_MANAGER.getAsset("./sprites/Rrun.png");
        this.RslideSpritesheet = ASSET_MANAGER.getAsset("./sprites/Rslide.png");
        this.RjumpSpritesheet = ASSET_MANAGER.getAsset("./sprites/Rjump.png");


        this.testSprite = ASSET_MANAGER.getAsset("./sprites/temptest.png");
        this.testAnimator = new Animator(this.testSprite, 0, 0, 54, 60, 1, 1);

        this.facing = 1; // 0 = left, 1 = right
        this.state = 0; // 0 = idle, 1 = walking, 2 = running, 3 = skidding, 4 = jumping/falling, 5 = crouching/sliding, 6 = wall sliding
        this.dead = false;
        this.deathAnimation = null;
        this.win = true;
        this.isGrounded = true;
        this.gravity = 2000;
        this.levers = 0;

        this.velocity = {x: 0, y: 0};

        this.updateBB();

        this.animations = [];
        this.loadAnimations();

        this.map = this.game.entities.find(entity => entity instanceof drawMap);
        if (this.map) {
            console.log("Map found, tile size:", this.map.testSize);
        } else {
            console.error("Map not found");
        }

        this.tpPlayerDebug();
        if (this.game.debugBox) {
            this.game.debugBox.addEventListener("change", () => this.tpPlayerDebug());
        }
    }

    loadAnimations() {
        // Initialize animation array
        for (let i = 0; i < 7; i++) {
            this.animations.push([]);
            for (let j = 0; j < 3; j++) {
                this.animations[i].push([]);
                for (let k = 0; k < 2; k++) {
                    this.animations[i][j].push(null);
                }
            }
        }

        // Idle animation
        this.animations[0][0][1] = new Animator(
            this.idleSpritesheet, 
            0, 5, 170, 175, 4, 0.15
        );
        this.animations[0][0][0] = new Animator(
            this.idleSpritesheet,
            0, 5, 170, 175, 4, 0.15
        );

        // Walk animation
        this.animations[1][0][1] = new Animator(
            this.walkSpritesheet,
            0, 13, 144, 190, 5, 0.1
        );
        this.animations[1][0][0] = new Animator(
            this.RwalkSpritesheet,
            0, 13, 144, 190, 5, 0.1
        );

        // Running animation (faster)
        this.animations[2][0][1] = new Animator(
            this.runSpritesheet,
            0, 0, 175, 145, 5, 0.08  // Faster animation for running
        );
        this.animations[2][0][0] = new Animator(
            this.RrunSpritesheet,
            0, 0, 175, 145, 5, 0.08
        );

        // Jump animation
        for (let i = 3; i <= 4; i++) {
            this.animations[i][0][1] = new Animator(
                this.jumpSpritesheet,
                0, 0, 181, 175, 2, 0.2
            );
            this.animations[i][0][0] = new Animator(
                this.RjumpSpritesheet,
                0, 0, 181, 175, 2, 0.2
            );
        }

        // Slide animation
        this.animations[5][0][1] = new Animator(
            this.slideSpritesheet,
            0, 0, 200, 120, 3, 0.1
        );
        this.animations[5][0][0] = new Animator(
            this.RslideSpritesheet,
            0, 0, 200, 120, 3, 0.1
        );
    }

    updateBB() {
        if (this.state != 5) { // player not crouching/sliding
            this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        }
        else { // player is crouching
            this.BB = new BoundingBox(this.x, this.y + this.height / 1.5, this.width * 3, this.height / 3);
        }
    };

    updateLastBB() {
        this.lastBB = this.BB;
    };

    update() {
        const TICK = this.game.clockTick;

        // Movement constants
        const MIN_WALK = 20;
        const MAX_WALK = 400;
        const MAX_RUN = 650;
        const ACC_WALK = 300;
        const ACC_RUN = 450;
        const ACC_AIR = 525;

        const DEC_SLIDE = 300;
        const DEC_REL = 600;
        const DEC_SKID = 1200;
        
        const MAX_FALL = 2000;
        const MAX_JUMP = 850;

        // check for death state and restart game
        if (this.dead) {
            console.log(this.game.entities);
            if (this.game.keys['enter']) {
                this.restartGame();
                console.log(this.game.entities);
            }
            // may want to load the death animation here then return.
            return; // don't process other updates when dead restart the game instead
        }

        // if (this.win) {
        //     console.log(this.game.entities);
        //     if (this.game.keys['enter']) {
        //         this.restartGame();
        //         console.log(this.game.entities);
        //     }
        //     return;
        // }

        // find the map if not already found
        // if (!this.map) {
        //     this.map = this.game.entities.find(entity => entity instanceof testMap);
        //     if (!this.map) {
        //         console.error("Map not found in update");
        //         return; // Skip update if map not found
        //     }
        // }

        // Update BoundingBoxes
        this.updateLastBB();
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && entity instanceof Projectile && that.BB.collide(entity.BB)) {
                entity.removeFromWorld = true;
                that.kill();
            } else if (entity.BB && (entity instanceof Spike || entity instanceof Laser) && that.BB.collide(entity.BB)) {
                that.kill();
            } else if (entity.BB && entity instanceof Platform && that.BB.collide(entity.BB) && that.velocity.y > 0 && (that.lastBB.bottom) <= entity.BB.top + 5) {
                that.isGrounded = true;
                if (!that.game.keys['w'] && !that.game.keys[' '] && !that.game.keys['s']) { // allow player to jump off
                    that.velocity.y = 0;
                    that.BB.bottom = entity.BB.top; // lock bounding box position
                    that.y = entity.BB.top - that.BB.height;
                }
            } else if (entity.BB && entity instanceof Lever && that.BB.collide(entity.BB) && !entity.collected) { 
                that.levers++;
                entity.collected = true;
            } else if (entity.BB && entity instanceof exitDoor) {
                entity.collectedLevers = that.levers; 
                if (that.BB.collide(entity.BB) && entity.levers <= that.levers) {
                    that.winGame();
                }
                //console.log("Player has collided with exit");
            }
        });

        // Horizontal movement
        this.updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, ACC_AIR, DEC_REL, DEC_SKID, DEC_SLIDE);

        // Jump input handling
        if ((this.game.keys[' '] || this.game.keys['w']) && this.isGrounded) {
            this.velocity.y = -MAX_JUMP;
            this.state = 4;
            this.isGrounded = false;
            this.jumpRelease = false;
        }
        if (this.velocity.y < 0 && this.jumpRelease == false && (!this.game.keys[' '] && !this.game.keys['w'])) {
            this.velocity.y = this.velocity.y / 2; // velocity cut, reduce upward movement when w is released.
            this.jumpRelease = true;
        }
        // if (this.velocity.y < -300 && (this.game.keys[' '] || this.game.keys['w'])) {
        //     this.velocity.y -= 850 * TICK;
        // }

        // Update state based on movement and keys
        this.updateState();

        // Apply gravity
        this.velocity.y += this.gravity * TICK;

        // Apply max velocities
        this.applyMaxVelocities(MAX_WALK, MAX_RUN, MAX_FALL);

        // Handle collisions and position updates
        this.handleCollisions(TICK);
    }
    
    // Updates the player's state based on current conditions
    updateState() {
        if (this.velocity.x < 0) this.facing = 0;
        if (this.velocity.x > 0) this.facing = 1;

        if (!this.isGrounded) {
            this.state = 4; // Jumping/Falling
            return;
        }

		if (this.isGrounded) {
            if (this.game.keys['s']) {
                this.state = 5;
                return;
            } else if (Math.abs(this.velocity.x) < 20) { // MIN_WALK
                this.state = 0; // Idle
                return;
            } else if (this.game.keys['shift'] && (this.game.keys['d'] || this.game.keys['a'])) {
                this.state = 2;
                return;
            } else if (this.game.keys['d'] || this.game.keys['a']) {
                this.state = 1;
                return;
            } else this.state = 0;
        }
    }

    // Updates horizontal movement based on input
    updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, ACC_AIR, DEC_REL, DEC_SKID, DEC_SLIDE) {
         // HORIZONTAL MOVEMENT/PHYSICS
         if (this.state !== 4) { // if player is not jumping
            // idle, walking, running, skidding ground physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {
                this.velocity.x = 0;
                this.state = 0;
                if (this.game.keys['a'] && !this.game.keys['s']) {
                    this.velocity.x -= MIN_WALK;
                } else if (this.game.keys['d'] && !this.game.keys['s']) {
                    this.velocity.x += MIN_WALK;
                } else if (this.game.keys['s']) {
                    this.state = 5;
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
                        this.state = 3;
                    } else if (this.game.keys['s']) {
                        this.velocity.x += DEC_SLIDE * TICK;
                        this.state = 5;
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
                        this.state = 3;
                    }  else if (this.game.keys['s']) {
                        this.velocity.x -= DEC_SLIDE * TICK;
                        this.state = 5;
                    } else { // holding nothing
                        this.velocity.x -= DEC_REL * TICK;
                        this.state = 1;
                    }
                }
            }
       } else if (this.state === 4) { // mid-air
            if (this.game.keys['a'] && !this.game.keys['d']) {
                this.velocity.x -= ACC_AIR * TICK;
            } else if (this.game.keys['d'] && !this.game.keys['a']) {
                this.velocity.x += ACC_AIR * TICK;
            }
       }
    }

    // Applies maximum velocity limits to both horizontal and vertical movement
    applyMaxVelocities(MAX_WALK, MAX_RUN, MAX_FALL) {
        if (this.game.keys['shift']) {
            this.velocity.x = Math.min(Math.max(this.velocity.x, -MAX_RUN), MAX_RUN);
        } else {
            this.velocity.x = Math.min(Math.max(this.velocity.x, -MAX_WALK), MAX_WALK);
        }
        this.velocity.y = Math.min(this.velocity.y, MAX_FALL);
    }

    //Collision - Tike time elapsed since last update
    handleCollisions(TICK) {
        // Calculate next position
        let nextX = this.x + this.velocity.x * TICK;
        let nextY = this.y + this.velocity.y * TICK;

        // Get map dimensions
        const mapWidth = this.map.map[0].length * this.map.testSize;
        const mapHeight = this.map.map.length * this.map.testSize;

        // Constrain to map boundaries
        nextX = Math.max(0, Math.min(nextX, mapWidth - this.width));
        nextY = Math.max(0, Math.min(nextY, mapHeight - this.height));

        // Check collisions
        const horizontalBB = new BoundingBox(nextX, this.y, this.width, this.height);
        const verticalBB = new BoundingBox(this.x, nextY, this.width, this.height);

        this.handleHorizontalCollision(horizontalBB, nextX);
        this.handleVerticalCollision(verticalBB, nextY, mapHeight);

        // Update bounding box
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    // Handles horizontal collision detection and response : boundingbox for horizontal movement
    handleHorizontalCollision(horizontalBB, nextX) {
        const MAX_WALLSLIDE = 175;
        const MAX_JUMP = 850;
        const collision = this.map.checkCollisions({
            BB: horizontalBB,
            x: nextX,
            y: this.y,
            width: this.width,
            height: this.height
        });

        if (collision.collides) {
            var jump = false;
            if ((!this.isGrounded && this.velocity.x != 0)) { // WALL SLIDE CHECK
                this.state = 6;
                if (this.velocity.y > MAX_WALLSLIDE) {
                    this.velocity.y = MAX_WALLSLIDE;
                }
                if (this.game.keys['a'] && (this.game.keys['w'] || this.game.keys[' '])) { // holding left
                    this.velocity.y = -MAX_JUMP;
                    this.velocity.x = 200;
                    this.state = 4;
                    jump = true;
                }
                if (this.game.keys['d'] && (this.game.keys['w'] || this.game.keys[' '])) { // holding right
                    this.velocity.y = -MAX_JUMP;
                    this.velocity.x = -200;
                    this.state = 4;
                    jump = true;
                }
            }
            if (this.velocity.x > 0 && !jump) {
                this.x = collision.tileX - this.width;
            } else if (this.velocity.x < 0 && !jump) {
                this.x = collision.tileX + this.map.testSize;
            } if (!jump) {
                this.velocity.x = 0;
            }
        } else {
            this.x = nextX;
        }
    }

    // Handles vertical collision detection and response
    handleVerticalCollision(verticalBB, nextY, mapHeight) {
        const collision = this.map.checkCollisions({
            BB: verticalBB,
            x: this.x,
            y: nextY,
            width: this.width,
            height: this.height
        });

        if (collision.collides) {
            if (this.velocity.y > 0) {
                this.y = collision.tileY - this.height;
                this.isGrounded = true;
                this.velocity.y = 0;
            } else if (this.velocity.y < 0) {
                this.y = collision.tileY + this.map.testSize;
                this.velocity.y = 0;
            }
        } else {
            this.y = nextY;
            this.isGrounded = this.y + this.height >= mapHeight;
        }
    }

    // resets the game
    restartGame() {
        this.deathAnimation = null;
        // loads the new level
        this.game.levelConfig.loadLevel(this.game.levelConfig.currentLevel);

        // Reset timer if it exists
        if (this.game.timer) {
            this.game.timer.reset();
        }

        // Clear any game keys that might be held
        for (let key in this.game.keys) {
            this.game.keys[key] = false;
        }
        this.levers = 0; // reset levers collected;
    }

    // call this method if you want to kill the player from an entity
    kill() {
        if (!this.game.options.debugging) {
            this.dead = true;
            // Create death animation at player's center position
            this.deathAnimation = new DeathAnimation(
                this.x + this.width / 2,
                this.y + this.height / 2
            );
        } else {
            console.log("Player would have died, but debug mode is active");
        }
    }

    //call this method when the play has reached the exit door
    async winGame() {
        console.log("winGame called");
        if (!this.game.options.debugging) {
            this.win = true;
            if (this.game.levelUI) {
                console.log("Showing level complete");
                await this.game.levelUI.showLevelComplete();

                // Stop the timer
                if (this.game.timer) {
                    console.log("Timer exists, about to call stop");
                    console.log("Timer isRunning before stop:", this.game.timer.isRunning);
                    this.game.timer.stop();
                    const currentTime = this.game.timer.getDisplayTime();
                    const currentLevel = this.game.levelConfig.currentLevel;

                    // Check if it's a new best time
                    const isNewBest = this.game.levelTimesManager.updateBestTime(currentLevel, currentTime);

                    // You can use this to show a "New Best Time!" message
                    if (isNewBest) {
                        this.game.levelUI.showNewBestTime(
                            this.game.levelTimesManager.formatTime(currentTime)
                        );
                    }
                }
            }
        } else {
            console.log("Player win, but debug mode is active");
        }
    }

    // debug to teleport the player entity on click based on mouse postion
    tpPlayerDebug() {
        // Remove existing teleport handler if it exists
        if (this.teleportHandler) {
            this.game.ctx.canvas.removeEventListener("click", this.teleportHandler);
            this.teleportHandler = null;
        }

        // Only add new handler if debugging is enabled
        if (this.game.options.debugging) {
            this.teleportHandler = (e) => {
                const rect = this.game.ctx.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Teleport the player
                this.x = mouseX - this.width / 2;
                this.y = mouseY - this.height / 2;

                // Update the bounding box after teleporting
                this.updateBB();

                console.log(`Teleported to: (${this.x}, ${this.y})`);
            };

            this.game.ctx.canvas.addEventListener("click", this.teleportHandler);
        }
    }


    // Renders the player character
    draw(ctx) {

        // check if the player is dead first
        if (this.dead) {
            // Draw death animation if it exists
            if (this.deathAnimation) {
                this.deathAnimation.update(this.game.clockTick);
                this.deathAnimation.draw(ctx);

                // Once animation is finished, show death screen
                if (this.deathAnimation.finished) {
                    // Draw death screen
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    ctx.font = '48px monospace';
                    ctx.fillStyle = 'red';
                    ctx.textAlign = 'center';
                    ctx.fillText('YOU DIED', ctx.canvas.width / 2, ctx.canvas.height / 2);

                    ctx.font = '24px monospace';
                    ctx.fillStyle = 'white';
                    ctx.fillText('Press ENTER to restart', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
                }
            }
            return;
        }


        if (!ctx) return;

        // Adjust vertical position when sliding
        let adjustedY = this.y;
        if (this.state === 5) {
            adjustedY = this.y + this.height/4; // Move down for sliding
        }

        // Draw the appropriate animation based on state and facing direction
        if (this.animations[this.state] && 
            this.animations[this.state][0] && 
            this.animations[this.state][0][this.facing]) {
            
            this.animations[this.state][0][this.facing].drawFrame(
                this.game.clockTick,
                ctx,
                this.x - 37,
                adjustedY,
                0.5
            );
        }

        // Draw debug box
        if (this.game.options.debugging) {
            if (this.state === 5) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y + this.height / 1.5, this.width * 3, this.height / 3);
            } else {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
    }
}