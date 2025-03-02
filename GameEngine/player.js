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

        // State constants for better readability
        this.STATES = {
            IDLE: 0,
            WALKING: 1,
            RUNNING: 2,
            SKIDDING: 3,
            JUMPING: 4,
            SLIDING: 5,
            WALL_SLIDING: 6,
            CROUCHING: 7,
            FALLING: 8
        };

        // Load spritesheets (just right-facing versions)
        this.sprites = {
            idle: ASSET_MANAGER.getAsset("./sprites/idle.png"),
            walk: ASSET_MANAGER.getAsset("./sprites/walk.png"),
            run: ASSET_MANAGER.getAsset("./sprites/run.png"),
            skid: ASSET_MANAGER.getAsset("./sprites/skid.png"),
            jump: ASSET_MANAGER.getAsset("./sprites/jump.png"),
            slide: ASSET_MANAGER.getAsset("./sprites/slide.png"),
            wall_slide: ASSET_MANAGER.getAsset("./sprites/wall-slide.png"),
            crouch: ASSET_MANAGER.getAsset("./sprites/crouch.png"),
            fall: ASSET_MANAGER.getAsset("./sprites/fall.png"),
            // Add crouch spritesheet when available
            // crouch: ASSET_MANAGER.getAsset("./sprites/crouch.png")
        };

        this.facing = 1; // 0 = left, 1 = right
        this.state = this.STATES.IDLE;
        this.dead = false;
        this.deathAnimation = null;
        this.win = false;
        this.isGrounded = true;
        this.gravity = 2000;
        this.levers = 0;

        this.velocity = {x: 0, y: 0};

        this.updateBB();

        // Initialize animations
        this.animations = {};
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
        // Create animations with a simpler structure
        // Parameters: spritesheet, xStart, yStart, width, height, frameCount, frameDuration

        // Idle animation
        this.animations[this.STATES.IDLE] = new Animator(
            this.sprites.idle, -45, 27, 133, 208, 5, 0.15
        );

        // Walk animation
        this.animations[this.STATES.WALKING] = new Animator(
            this.sprites.walk, -10, 27, 138, 208, 5, 0.15
        );

        // Running animation
        this.animations[this.STATES.RUNNING] = new Animator(
            this.sprites.run, 16, 27, 176, 208, 6, 0.08
        );

        // Skidding animation (can reuse run with different parameters or use a different spritesheet)
        this.animations[this.STATES.SKIDDING] = new Animator(
            this.sprites.skid, -70, 27, 176, 208, 1, 1
        );

        // Jumping animation
        this.animations[this.STATES.JUMPING] = new Animator(
            this.sprites.jump, 0, 30, 188, 208, 1, 1
        );

        // Falling animation (can be the same as jumping or use different frames)
        this.animations[this.STATES.FALLING] = new Animator(
            this.sprites.fall, -25, 20, 170, 175, 3, 0.3
        );

        // Sliding animation
        this.animations[this.STATES.SLIDING] = new Animator(
            this.sprites.slide, 17, 67, 204, 175, 3, 0.6
        );

        // Wall sliding animation
        this.animations[this.STATES.WALL_SLIDING] = new Animator(
            this.sprites.wall_slide, -70, 35, 176, 175, 1, 1
        );

        // Crouching animation - using slide as temporary placeholder
        // Replace this when you have a dedicated crouch spritesheet
        this.animations[this.STATES.CROUCHING] = new Animator(
            this.sprites.crouch, 0, 67, 186, 175, 1, 1
        );
    }

    updateBB() {
        if (this.state === this.STATES.SLIDING) {
            // Sliding: lower, wider bounding box (more horizontal)
            this.BB = new BoundingBox(
                this.x,
                this.y + this.height / 1.5,
                this.width * 3,  // Wider for sliding
                this.height / 3  // Lower height
            );
        } else if (this.state === this.STATES.CROUCHING) {
            // Crouching: reduced height, same width
            this.BB = new BoundingBox(
                this.x,
                this.y + this.height / 2,  // Start lower
                this.width,                // Normal width
                this.height / 2            // Half height
            );
        } else {
            // Standard bounding box for other states
            this.BB = new BoundingBox(
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    updateLastBB() {
        this.lastBB = this.BB;
    }

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
            return; // don't process other updates when dead
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
            } else if (entity.BB && entity instanceof BigBlock && that.BB.collide(entity.BB)) { // might need to call this 
                if (that.lastBB.bottom <= entity.BB.top + 5 && that.velocity.y > 0) {
                    // This is a top collision - set grounded but don't call handleWallSlide
                    that.velocity.y = 0;
                    that.isGrounded = true;
                    that.y = entity.y - that.height;
                } else if (that.lastBB.top >= entity.BB.bottom - 5 && that.velocity.y < 0) {
                    // Bottom collision - player hits their head
                    that.velocity.y = 0; // Stop upward movement
                    that.y = entity.BB.bottom; // Prevent clipping into the block
                } else if (that.velocity.x !== 0) {
                    // This is a side collision - handle wall slide
                    that.handleWallSlide(true, null, entity.x, entity.y, entity.width);
                }
            }
        });

        // Horizontal movement
        this.updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, ACC_AIR, DEC_REL, DEC_SKID, DEC_SLIDE);

        // Jump input handling
        if ((this.game.keys[' '] || this.game.keys['w']) && this.isGrounded &&
            this.state !== this.STATES.CROUCHING) {
            this.velocity.y = -MAX_JUMP;
            this.state = this.STATES.JUMPING;
            this.isGrounded = false;
            this.jumpRelease = false;
            this.canWallJump = false;
        }

        if (this.velocity.y < 0 && this.jumpRelease === false && (!this.game.keys[' '] && !this.game.keys['w'])) {
            this.velocity.y = this.velocity.y / 2; // velocity cut when jump key released
            this.jumpRelease = true;
            this.canWallJump = false;
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
        // Update facing direction
        if (this.velocity.x < 0) this.facing = 0;
        if (this.velocity.x > 0) this.facing = 1;

        // Update state based on current movement
        if (!this.isGrounded) {
            // In the air - jumping or falling
            if (this.velocity.y < 0) {
                this.state = this.STATES.JUMPING;
            } else if (!this.isWallSliding){
                this.state = this.STATES.FALLING;
            } else {
                this.state = this.STATES.WALL_SLIDING;
            }
            return;
        }

        // On the ground
        if (this.isGrounded) { 
            if (this.isWallSliding) {
                this.isWallSliding = false;
            }
            // Check for crouching first (new state)
            if (this.game.keys['s'] && Math.abs(this.velocity.x) < 20) {
                this.state = this.STATES.CROUCHING;
                return;
            }
            // Check for sliding (when moving and pressing crouch)
            else if (this.game.keys['s'] && Math.abs(this.velocity.x) >= 20) {
                this.state = this.STATES.SLIDING;
                return;
            }
            // Check for idle
            else if (Math.abs(this.velocity.x) < 20) {
                this.state = this.STATES.IDLE;
                return;
            }
            // Check for running
            else if (this.game.keys['shift'] && (this.game.keys['d'] || this.game.keys['a'])) {
                this.state = this.STATES.RUNNING;
                return;
            }
            // Check for skidding
            else if ((this.game.keys['a'] && this.velocity.x > 20) ||
                (this.game.keys['d'] && this.velocity.x < -20)) {
                this.state = this.STATES.SKIDDING;
                return;
            }
            // Default to walking
            else if (this.game.keys['d'] || this.game.keys['a']) {
                this.state = this.STATES.WALKING;
                return;
            }
            // Fallback to idle
            else {
                this.state = this.STATES.IDLE;
            }
        }
    }

    // Updates horizontal movement based on input
    updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, ACC_AIR, DEC_REL, DEC_SKID, DEC_SLIDE) {
        // Don't move horizontally if crouching
        if (this.state === this.STATES.CROUCHING) {
            this.velocity.x = 0;
            return;
        }

        // HORIZONTAL MOVEMENT/PHYSICS
        if (this.state !== this.STATES.JUMPING && this.state !== this.STATES.FALLING) {
            // idle, walking, running, skidding ground physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {
                this.velocity.x = 0;

                if (this.game.keys['a'] && !this.game.keys['s']) {
                    this.velocity.x -= MIN_WALK;
                } else if (this.game.keys['d'] && !this.game.keys['s']) {
                    this.velocity.x += MIN_WALK;
                }
            } else if (Math.abs(this.velocity.x) >= MIN_WALK) { // accelerating or decelerating
                if (this.facing === 0) { // left
                    if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) { // moving
                        if (this.game.keys['shift']) { // if sprinting
                            this.velocity.x -= ACC_RUN * TICK;
                        } else {
                            this.velocity.x -= ACC_WALK * TICK;
                        }
                    } else if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) { // skidding
                        this.velocity.x += DEC_SKID * TICK;
                    } else if (this.game.keys['s']) {
                        this.velocity.x += DEC_SLIDE * TICK;
                    } else { // holding nothing
                        this.velocity.x += DEC_REL * TICK;
                    }
                }
                if (this.facing === 1) { // right
                    if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) { // moving
                        if (this.game.keys['shift']) { // if sprinting
                            this.velocity.x += ACC_RUN * TICK;
                        } else {
                            this.velocity.x += ACC_WALK * TICK;
                        }
                    } else if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) { // skidding
                        this.velocity.x -= DEC_SKID * TICK;
                    }  else if (this.game.keys['s']) {
                        this.velocity.x -= DEC_SLIDE * TICK;
                    } else { // holding nothing
                        this.velocity.x -= DEC_REL * TICK;
                    }
                }
            }
        } else { // mid-air
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

    // Handles collisions and movement - TICK is time elapsed since last update
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

        // Create temporary bounding boxes for collision detection
        const horizontalBB = new BoundingBox(nextX, this.y, this.width, this.height);
        const verticalBB = new BoundingBox(this.x, nextY, this.width, this.height);

        this.handleHorizontalCollision(horizontalBB, nextX);
        this.handleVerticalCollision(verticalBB, nextY, mapHeight);

        // Update bounding box
        this.updateBB();
    }

    // Handles horizontal collision detection and response : boundingbox for horizontal movement
    handleHorizontalCollision(horizontalBB, nextX) {
        const collision = this.map.checkCollisions({
            BB: horizontalBB,
            x: nextX,
            y: this.y,
            width: this.width,
            height: this.height
        });

        if (collision.collides) {
            this.handleWallSlide(false, collision);
        } else {
            this.x = nextX;
        }
    }
    handleWallSlide(bigBlock, collision = null , x = 0, y = 0, width = 0) {
        const MAX_WALLSLIDE = 175;
        const MAX_JUMP = 850;
        var jump = false;
        if ((!this.isGrounded)) { // WALL SLIDE CHECK
            this.state = this.STATES.WALL_SLIDING;
            this.isWallSliding = true;
            if (this.velocity.y > MAX_WALLSLIDE) {
                this.velocity.y = MAX_WALLSLIDE;
            }
            if (this.game.keys['a'] && (this.game.keys['w'] || this.game.keys[' ']) && this.canWallJump) { // holding left
                this.velocity.y = -MAX_JUMP;
                this.velocity.x = 200;
                this.state = this.STATES.JUMPING;
                jump = true;
                this.canWallJump = false;
                this.isWallSliding = false;
            }
            if (this.game.keys['d'] && (this.game.keys['w'] || this.game.keys[' '])&& this.canWallJump) { // holding right
                this.velocity.y = -MAX_JUMP;
                this.velocity.x = -200;
                this.state = this.STATES.JUMPING;
                jump = true;
                this.canWallJump = false;
                this.isWallSliding = false;
            }
        }
        if (!bigBlock) { // check if collision is tile or bigblock based.
            if (this.velocity.x > 0 && !jump) { 
                this.x = collision.tileX - this.width;
            } else if (this.velocity.x < 0 && !jump) {
                this.x = collision.tileX + this.map.testSize; // how does this work???
            } 
        } else {
            if (this.velocity.x > 0 && !jump ) { // right
                this.x = x- this.width;
            } else if (this.velocity.x < 0 && !jump ) { // left
                this.x = (x + width);
            } 
        }
        if (!this.game.keys['w'] && !this.game.keys[' ']) {
            this.canWallJump = true;
        }
        if (!jump) {
            this.velocity.x = 0;
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
        this.dead = false;
    }

    // call this method if you want to kill the player from an entity
    kill() {
        if (!this.game.options.debugging) {
            this.dead = true;

            // Play death sound if audio manager exists
            if (window.AUDIO_MANAGER) {
                // Create a temporary audio element for the death sound
                const deathSound = new Audio('./sounds/death_sound.mp3');

                // Set volume based on current audio manager settings
                deathSound.volume = window.AUDIO_MANAGER.isMuted ? 0 : window.AUDIO_MANAGER.volume;

                // Play the sound
                deathSound.play().catch(error => {
                    console.error("Error playing death sound:", error);
                });
            }

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
        // Prevent multiple win triggers
        if (this.win) {
            console.log("Win already triggered, ignoring duplicate call");
            return;
        }

        if (!this.game.options.debugging) {
            this.win = true;

            // Play level complete sound if audio manager exists
            if (window.AUDIO_MANAGER) {
                // Create a temporary audio element for the win sound
                const winSound = new Audio('./sounds/temp-win-game.mp3');

                // Set volume based on current audio manager settings
                winSound.volume = window.AUDIO_MANAGER.isMuted ? 0 : window.AUDIO_MANAGER.volume;

                // Play the sound
                winSound.play().catch(error => {
                    console.error("Error playing level complete sound:", error);
                });
            }

            // show level win UI
            if (this.game.levelUI) {
                console.log("Showing level complete");

                // Stop the timer first
                if (this.game.timer) {
                    console.log("Timer exists, about to call stop");
                    console.log("Timer isRunning before stop:", this.game.timer.isRunning);
                    this.game.timer.stop();
                }

                // Make sure best time cache is updated before showing the complete screen
                await this.game.levelUI.updateBestTimeCache();

                // Now show the level complete screen
                await this.game.levelUI.showLevelComplete();
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

                // Check if animation is finished to show death screen
                if (this.deathAnimation.finished) {
                    // Draw elevator-themed death screen
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    const centerX = ctx.canvas.width / 2;
                    const centerY = ctx.canvas.height / 2;

                    // Draw red emergency panel
                    const panelWidth = 400;
                    const panelHeight = 300;
                    const panelX = centerX - panelWidth/2;
                    const panelY = centerY - panelHeight/2;

                    // Red emergency panel background
                    ctx.fillStyle = '#d00';
                    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

                    // Panel border
                    ctx.strokeStyle = '#800';
                    ctx.lineWidth = 5;
                    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

                    // Warning stripes at top
                    const stripeHeight = 30;
                    ctx.fillStyle = '#000';
                    ctx.fillRect(panelX, panelY, panelWidth, stripeHeight);

                    // Warning text
                    ctx.font = 'bold 18px monospace';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.fillText('EMERGENCY STOP', centerX, panelY + 20);

                    // Error display
                    ctx.fillStyle = '#000';
                    ctx.fillRect(panelX + 50, panelY + 60, panelWidth - 100, 60);

                    ctx.font = 'bold 36px monospace';
                    ctx.fillStyle = '#f00';
                    ctx.textAlign = 'center';
                    ctx.fillText('ELEVATOR FAULT', centerX, panelY + 100);

                    // Instructions
                    ctx.font = '20px monospace';
                    ctx.fillStyle = '#fff';
                    ctx.fillText('Press ENTER to restart floor', centerX, panelY + 150);

                    // Warning icon
                    ctx.fillStyle = '#ff0';
                    ctx.beginPath();
                    ctx.moveTo(centerX, panelY + 190);
                    ctx.lineTo(centerX - 25, panelY + 230);
                    ctx.lineTo(centerX + 25, panelY + 230);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = '#000';
                    ctx.font = 'bold 24px Arial';
                    ctx.fillText('!', centerX, panelY + 220);

                    // Flashing emergency light effect
                    if (Math.floor(Date.now() / 300) % 2 === 0) {
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }
                }
            }
            return;
        }

        if (!ctx) return;

        // grab current animation based on state
        const animation = this.animations[this.state];

        if (animation) {
            ctx.save();

            let adjustedY = this.y;
            if (this.state === this.STATES.SLIDING || this.state === this.STATES.CROUCHING) {
                adjustedY = this.y + this.height/4;
            }

            if (this.facing === 0) { // left facing
                // Additional offset for sliding animation when facing left
                let xOffset = -this.x - this.width - 37;

                // Apply special offset for sliding to left
                if (this.state === this.STATES.SLIDING) {
                    xOffset -= 40; // Adjust this value to align the sprite correctly
                }

                // Flip the context horizontally
                ctx.scale(-1, 1);
                animation.drawFrame(
                    this.game.clockTick,
                    ctx,
                    xOffset,
                    adjustedY,
                    0.5
                );
            } else { // right facing
                animation.drawFrame(
                    this.game.clockTick,
                    ctx,
                    this.x - 37,
                    adjustedY,
                    0.5
                );
            }

            ctx.restore();
        }

        // Draw debug box if debugging is enabled
        if (this.game.options.debugging) {
            // Set debug box based on state
            ctx.strokeStyle = 'red';
            if (this.state === this.STATES.SLIDING) {
                ctx.strokeRect(this.x, this.y + this.height / 1.5, this.width * 3, this.height / 3);
            } else if (this.state === this.STATES.CROUCHING) {
                ctx.strokeRect(this.x, this.y + this.height / 2, this.width, this.height / 2);
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }

            // Display current state for debugging
            ctx.fillStyle = 'black';
            ctx.fillText(`State: ${this.state}, Facing: ${this.facing}`, this.x, this.y - 10);
        }
    }
}