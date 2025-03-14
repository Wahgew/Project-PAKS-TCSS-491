class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 74;
        this.width = 20;

        // initial starting pos of player
        this.intialX = this.x;
        this.intialY = this.y;
        this.teleportHandler = null;

        // wall jump
        this.wallJumpInputsAllowed = true;           // Whether a new wall jump input is allowed
        this.jumpButtonPreviouslyPressed = false;    // If jump button was pressed in previous frame
        this.jumpButtonJustPressed = false;          // If jump button was just pressed this frame
        this.wallJumpTime = 0;                       // Time window after wall jump for enhanced air control
        this.wallJumpControlWindow = 0.3;            // Duration of enhanced air control in seconds
        this.wallJumpDirection = null;               // Direction player jumped during wall jump

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
        };

        this.facing = 1; // 0 = left, 1 = right
        this.state = this.STATES.IDLE;
        this.dead = false;
        this.deathAnimation = null;
        this.win = false;
        this.isGrounded = true;
        this.groundedOn = null; // 'tile' or entity (such as platform or big block)
        this.standingPlatform = null; // Reference to the specific platform player is standing on
        this.gravity = 2000;
        this.levers = 0;
        this.previousJumpButtonState = false;
        this.jumpInputConsumed = false;
        this.previousSKeyState = false; // Track previous S key state
        this.platformTime = 0;          // Track time spent on current platform

        this.velocity = {x: 0, y: 0};

        // Input buffering 
        this.jumpBufferTime = 0.15; // Buffer window in seconds
        this.jumpBufferTimer = 0;   // Current buffer timer
        this.updateBB();

        // Initialize animations
        this.animations = {};
        this.loadAnimations();

        this.map = this.game.entities.find(entity => entity instanceof drawMap);
        if (this.map) {
            console.log("Map found, tile size:", this.map.drawSize);
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
            this.sprites.run, 67, 27, 201, 208, 5, 0.08
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

        // Track jump button state changes (put this near the top of update)
        const jumpButtonPressed = this.game.keys[' '] || this.game.keys['w'];
        this.jumpButtonJustPressed = jumpButtonPressed && !this.jumpButtonPreviouslyPressed;
        this.jumpButtonPreviouslyPressed = jumpButtonPressed;

        // Update input buffer timers
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer -= TICK;
        }
        const jumpKeyPressed = this.game.keys[' '] || this.game.keys['w'];
        if (jumpKeyPressed && !this.previousJumpButtonState && this.jumpBufferTimer <= 0) {
            this.jumpBufferTimer = this.jumpBufferTime;
            this.jumpInputConsumed = false;
        }
        this.previousJumpButtonState = jumpKeyPressed;
        // Track S key state changes
        // Update at the end of your update method
        this.previousSKeyState = this.game.keys['s'];

        // Update BoundingBoxes
        this.updateLastBB();
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && entity instanceof Projectile && that.BB.collide(entity.BB)) {
                entity.removeFromWorld = true;
                that.kill();
            } else if (entity.BB && (entity instanceof Spike || entity instanceof GlowingLaser) && that.BB.collide(entity.BB)) {
                that.kill();
            } else if (entity.BB && entity instanceof Platform && that.BB.collide(entity.BB)) {
                // The actual platform landing logic is now handled in the Platform class
                // This section now just handles interactions that don't involve landing on the platform

                // If platform is moving up and pushing player into ceiling
                if (entity.velocity && entity.velocity.y < 0 && that.isGrounded && that.standingPlatform === entity) {
                    // Check for ceiling collision
                    const ceilingCheck = that.map.checkCollisions({
                        BB: new BoundingBox(that.x, that.y - 5, that.width, that.height),
                        x: that.x,
                        y: that.y - 5,
                        width: that.width,
                        height: that.height
                    });

                    if (ceilingCheck.collides) {
                        // Handle ceiling collision - player gets squished
                        that.kill();
                    }
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
            } else if (entity.BB && entity instanceof BigBlock && that.BB.collide(entity.BB)) {
                // Determine which side of the BigBlock we're colliding with
                const overlapLeft = (that.BB.right) - entity.BB.left;
                const overlapRight = entity.BB.right - (that.BB.left);
                const overlapTop = (that.BB.bottom) - entity.BB.top;
                const overlapBottom = entity.BB.bottom - (that.BB.top);

                // Find the smallest overlap to determine collision direction
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapTop && that.velocity.y > 0) {
                    // Top collision - landed on top of block
                    that.velocity.y = 0;
                    that.isGrounded = true;
                    that.y = entity.y - that.height;

                    // Reset wall sliding state when landing
                    that.isWallSliding = false;
                    that.wallSticking = false;
                }
                else if (minOverlap === overlapBottom && that.velocity.y < 0) {
                    // Bottom collision - hit head on block
                    that.velocity.y = 0;
                    that.y = entity.BB.bottom;
                }
                else {
                    // Side collision - handle wall slide/stick
                    if (minOverlap === overlapLeft && that.velocity.x > 0) {
                        // Right side of player hit left side of block
                        that.handleWallSlide(true, null, entity.x, entity.y, entity.width);
                    }
                    else if (minOverlap === overlapRight && that.velocity.x < 0) {
                        // Left side of player hit right side of block
                        that.handleWallSlide(true, null, entity.x, entity.y, entity.width);
                    }
                }
            }
        });

        // Horizontal movement
        this.updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, ACC_AIR, DEC_REL, DEC_SKID, DEC_SLIDE);

        // Jump input handling
        if ((this.game.keys[' '] || this.game.keys['w'] || this.jumpBufferTimer > 0) &&
            this.isGrounded && this.state !== this.STATES.CROUCHING && !this.jumpInputConsumed) {

            //console.log("Player initiating jump!");

            // MOST IMPORTANT: First clear platform reference BEFORE applying jump velocity
            if (this.standingPlatform) {
                const oldPlatform = this.standingPlatform;
                this.standingPlatform = null;
                oldPlatform.playerRiding = false;
            }

            // Update state AFTER clearing platform
            this.isGrounded = false;
            this.groundedOn = null;

            // NOW apply jump velocity after all platform links are severed
            this.velocity.y = -MAX_JUMP;
            this.state = this.STATES.JUMPING;
            this.jumpRelease = false;
            this.canWallJump = false;

            // Reset jump buffer and mark input as consumed
            this.jumpBufferTimer = 0;
            this.jumpInputConsumed = true;
        }

        // wall jump
        if (this.wallSticking && !this.isGrounded) {
            // Wall jump only happens on button press, not hold
            if (this.jumpButtonJustPressed && this.wallJumpInputsAllowed) {
                // Determine direction based on which wall we're on
                if (this.wallStickDirection === 'left') {
                    // Jumping off left wall (going right)
                    this.velocity.y = -850; // MAX_JUMP
                    this.velocity.x = 450;  // WALL_JUMP_BOOST
                    this.lastWallJumpDirection = 'right';
                    this.wallJumpDirection = 'right';

                    // Update state
                    this.state = this.STATES.JUMPING;
                    this.isWallSliding = false;
                    this.wallSticking = false;
                    this.jumpRelease = false;
                    this.wallJumpInputsAllowed = false; // Prevent another wall jump until landing or timeout

                    // Set air control window
                    this.wallJumpTime = this.wallJumpControlWindow;

                    // Reset jump buffer
                    this.jumpBufferTimer = 0;
                    this.jumpInputConsumed = true;

                    console.log("Wall jump performed from left wall to right");

                    // Re-enable wall jumping after a short delay
                    setTimeout(() => {
                        this.wallJumpInputsAllowed = true;
                    }, 200);
                }
                else if (this.wallStickDirection === 'right') {
                    // Jumping off right wall (going left)
                    this.velocity.y = -850; // MAX_JUMP
                    this.velocity.x = -450; // WALL_JUMP_BOOST
                    this.lastWallJumpDirection = 'left';
                    this.wallJumpDirection = 'left';

                    // Update state
                    this.state = this.STATES.JUMPING;
                    this.isWallSliding = false;
                    this.wallSticking = false;
                    this.jumpRelease = false;
                    this.wallJumpInputsAllowed = false; // Prevent another wall jump until landing or timeout

                    // Set air control window
                    this.wallJumpTime = this.wallJumpControlWindow;

                    // Reset jump buffer
                    this.jumpBufferTimer = 0;
                    this.jumpInputConsumed = true;

                    console.log("Wall jump performed from right wall to left");

                    // Re-enable wall jumping after a short delay
                    setTimeout(() => {
                        this.wallJumpInputsAllowed = true;
                    }, 200);
                }
            }
        }

        // Reset wall jump inputs when landing
        if (this.isGrounded) {
            this.wallJumpInputsAllowed = true;
        }

        // variable jump height
        if (this.velocity.y < 0 && this.jumpRelease === false && (!this.game.keys[' '] && !this.game.keys['w'])) {
            // Super Meat Boy style - cut velocity by 50% when releasing jump button
            this.velocity.y = this.velocity.y * 0.5;
            this.jumpRelease = true;
        }

        // air control
        if (this.wallJumpTime > 0) {
            this.wallJumpTime -= TICK;

            // Enhanced air control after wall jump
            if (this.wallJumpDirection === 'right' && this.game.keys['a'] && !this.game.keys['d']) {
                // Player is trying to go back left after jumping right from wall
                this.velocity.x -= 1200 * TICK; // Stronger control to go back to wall
            } else if (this.wallJumpDirection === 'left' && this.game.keys['d'] && !this.game.keys['a']) {
                // Player is trying to go back right after jumping left from wall
                this.velocity.x += 1200 * TICK; // Stronger control to go back to wall
            }
        }

        if (!jumpKeyPressed) {
            this.jumpInputConsumed = false;
        }

        if (this.standingPlatform) {
            this.isGrounded = true;
            if (Math.abs(this.velocity.x) < 20) {
                this.state = this.STATES.IDLE;
            } else if (this.game.keys['shift'] && (this.game.keys['d'] || this.game.keys['a'])) {
                this.state = this.STATES.RUNNING;
            } else {
                this.state = this.STATES.WALKING;
            }
        }

        // Update state based on movement and keys
        this.updateState();

        // Check if we're still touching a wall when wall sticking
        this.checkWallStickingState();

        // Apply gravity
        if (!this.standingPlatform) {
            // Apply gravity
            this.velocity.y += this.gravity * TICK;
        } else {
            // Force zero velocity when on platform
            this.velocity.y = 0;
        }

        // Apply max velocities
        this.applyMaxVelocities(MAX_WALK, MAX_RUN, MAX_FALL);

        // Handle collisions and position updates
        this.handleCollisions(TICK);
    }

    // Updates the player's state based on current conditions
    updateState() {
        // Update facing direction
        if (this.velocity.x < 0) {
            this.facing = 0;
        }
        if (this.velocity.x > 0) { 
            this.facing = 1;
        }
    

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
        // Allow slightly higher horizontal speed right after a wall jump
        const horizontalBoost = this.recentlyWallJumped ? 1.2 : 1.0; // 20% boost after wall jump

        // Apply horizontal speed limits based on running vs walking
        if (this.game.keys['shift']) {
            this.velocity.x = Math.min(Math.max(this.velocity.x, -MAX_RUN * horizontalBoost), MAX_RUN * horizontalBoost);
        } else {
            this.velocity.x = Math.min(Math.max(this.velocity.x, -MAX_WALK * horizontalBoost), MAX_WALK * horizontalBoost);
        }

        // Apply fall speed limit - ensure we always respect the max fall speed
        this.velocity.y = Math.min(this.velocity.y, MAX_FALL);
    }

    // Handles collisions and movement - TICK is time elapsed since last update
    handleCollisions(TICK) {
        // Reset groundedOn platform if we're not touching the platform anymore
        // This is a more reliable check than just checking velocity
        if (this.groundedOn === 'platform') {
            let stillOnPlatform = false;

            // Check if we're still above any platform
            this.game.entities.forEach(entity => {
                if (entity instanceof Platform) {
                    if (this.BB.right > entity.BB.left + 5 &&
                        this.BB.left < entity.BB.right - 5 &&
                        this.BB.bottom <= entity.BB.top + 5) {
                        stillOnPlatform = true;
                    }
                }
            });

            if (!stillOnPlatform) {
                this.isGrounded = false;
                this.groundedOn = null;
            }
        }

        // Calculate next position
        let nextX = this.x + this.velocity.x * TICK;
        let nextY = this.y + this.velocity.y * TICK;

        // If sticking to a wall, enforce position
        if (this.wallSticking && !this.isGrounded) {
            if (this.wallStickDirection === 'left') {
                // Stick to left wall
                nextX = this.lastWallX;
                this.velocity.x = 0;
            } else if (this.wallStickDirection === 'right') {
                // Stick to right wall
                nextX = this.lastWallX - this.width;
                this.velocity.x = 0;
            }
        }

        // Get map dimensions
        const mapWidth = this.map.map[0].length * this.map.drawSize;
        const mapHeight = this.map.map.length * this.map.drawSize;

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

        // Check wall sticking status
        this.checkWallSticking();
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

            // If we're moving away from a wall, stop sticking
            if (this.wallSticking) {
                if ((this.wallStickDirection === 'left' && this.velocity.x > 0) ||
                    (this.wallStickDirection === 'right' && this.velocity.x < 0)) {
                    this.wallSticking = false;
                }
            }
        }
    }
    handleWallSlide(bigBlock, collision = null, x = 0, y = 0, width = 0) {
        const MAX_WALLSLIDE = 175;
        const MAX_JUMP = 850;
        const WALL_JUMP_BOOST = 450;

        let jump = false;

        // Determine wall direction
        let wallDirection = '';
        if (bigBlock) {
            wallDirection = this.velocity.x > 0 ? 'right' : 'left';
            this.isWallSlidingBigBlock = true;
        } else if (collision) {
            wallDirection = this.velocity.x > 0 ? 'right' : 'left';
            this.isWallSlidingBigBlock = false;
        }

        if (!this.isGrounded) {
            // Enable wall sliding state
            this.state = this.STATES.WALL_SLIDING;
            this.isWallSliding = true;
            this.wallSticking = true;
            this.wallStickDirection = wallDirection;

            // Store wall position for sticking
            if (bigBlock) {
                this.lastWallX = wallDirection === 'right' ? x : x + width;
            } else if (collision) {
                this.lastWallX = wallDirection === 'right' ? collision.tileX : collision.tileX + this.map.drawSize;
            }

            // Limit fall speed while wall sliding
            if (this.velocity.y > MAX_WALLSLIDE) {
                this.velocity.y = MAX_WALLSLIDE;
            }

            // Wall jump happens in the update method, not here
            // We only setup the wall sliding state here
        }

        // Handle collision with wall (no jumping here)
        if (!bigBlock) {
            if (this.velocity.x > 0) {
                this.x = collision.tileX - this.width;
            } else if (this.velocity.x < 0) {
                this.x = collision.tileX + this.map.drawSize;
            }
        } else {
            if (this.velocity.x > 0) {
                this.x = x - this.width;
            } else if (this.velocity.x < 0) {
                this.x = (x + width);
            }
        }

        // Stop horizontal momentum when against wall
        this.velocity.x = 0;
    }

    // Handles vertical collision detection and response
    handleVerticalCollision(verticalBB, nextY, mapHeight) {
        // Skip all tile collision if currently standing on a platform
        if (this.standingPlatform) {
            // Don't apply any vertical movement - platform controls it
            return;
        }

        // Only get here if not on a platform

        // Original code for tile collision handling...
        const collision = this.map.checkCollisions({
            BB: verticalBB,
            x: this.x,
            y: nextY,
            width: this.width,
            height: this.height
        });

        if (collision.collides) {
            if (this.velocity.y > 0) {
                // Landing on a tile
                this.y = collision.tileY - this.height;
                this.isGrounded = true;
                this.groundedOn = 'tile';
                this.velocity.y = 0;
                this.wallSticking = false;
                this.isWallSliding = false;
            } else if (this.velocity.y < 0) {
                // Hitting head on a tile
                this.y = collision.tileY + this.map.drawSize;
                this.velocity.y = 0;
            }
        } else {
            // No tile collision
            this.y = nextY;

            // Only update grounded status if on a tile (not platform)
            if (this.groundedOn === 'tile') {
                this.isGrounded = false;
                this.groundedOn = null;
            }

            // Handle map bottom boundary
            if (this.y + this.height >= mapHeight) {
                this.y = mapHeight - this.height;
                this.isGrounded = true;
                this.groundedOn = 'tile';
                this.velocity.y = 0;
            }
        }
    }

    checkWallSticking() {
        // Only process if we're wall sticking and not on the ground
        if (this.wallSticking && !this.isGrounded) {
            // Check if player is pushing away from wall (detach)
            if ((this.wallStickDirection === 'left' && this.game.keys['d']) ||
                (this.wallStickDirection === 'right' && this.game.keys['a'])) {
                this.wallSticking = false;
                this.isWallSliding = false;
            }
            // Otherwise maintain wall sliding state
            else {
                this.isWallSliding = true;
                this.state = this.STATES.WALL_SLIDING;

                // Limit fall speed while sticking
                if (this.velocity.y > 175) {
                    this.velocity.y = 175;
                }
            }
        }

        // If not wall sliding, reset
        if (!this.isWallSliding) {
            this.wallSticking = false;
        }
    }

    checkWallStickingState() {
        // If we're currently sticking to a wall, validate that we're actually touching the wall
        if (this.wallSticking && !this.isGrounded) {
            let stillTouchingWall = false;

            // First check regular map tiles
            // Create a test bounding box slightly wider than the player to check wall contact
            const testBB = new BoundingBox(
                this.wallStickDirection === 'left' ? this.x - 2 : this.x,
                this.y,
                this.width + 2,
                this.height
            );

            // Check if we're still touching a wall tile
            const collision = this.map.checkCollisions({
                BB: testBB,
                x: this.wallStickDirection === 'left' ? this.x - 2 : this.x,
                y: this.y,
                width: this.width + 2,
                height: this.height
            });

            if (collision.collides) {
                stillTouchingWall = true;
            }

            // Then check BigBlock entities
            if (!stillTouchingWall) {
                // Extend bounding box in direction of wall by a small amount
                const bigBlockTestBB = new BoundingBox(
                    this.wallStickDirection === 'left' ? this.x - 5 : this.x,
                    this.y,
                    this.width + 5,
                    this.height
                );

                // Check collision with all BigBlock entities
                this.game.entities.forEach(entity => {
                    if (entity instanceof BigBlock && bigBlockTestBB.collide(entity.BB)) {
                        stillTouchingWall = true;
                    }
                });
            }

            // If we're not touching any wall, stop sticking
            if (!stillTouchingWall) {
                this.wallSticking = false;
                this.isWallSliding = false;
            }
        }
    }


    // resets the game
    restartGame() {
        console.log("Player restart game called");
        this.deathAnimation = null;

        // Reset player state
        this.levers = 0;
        this.dead = false;

        // The level loading and other resets will happen in GameEngine
    }

    // call this method if you want to kill the player from an entity
    kill() {
        if (!this.game.options.debugging) {
            // Only set death state if not already dead
            if (!this.dead) {
                console.log("Player killed");
                this.dead = true;

                // Play death sound if audio manager exists
                if (window.AUDIO_MANAGER) {
                    const deathSound = new Audio('./sounds/death_sound.mp3');
                    deathSound.volume = window.AUDIO_MANAGER.isMuted ? 0 : window.AUDIO_MANAGER.volume;
                    deathSound.play().catch(error => {
                        console.error("Error playing death sound:", error);
                    });
                }

                // Create death animation at player's center position
                this.deathAnimation = new DeathAnimation(
                    this.x + this.width / 2,
                    this.y + this.height / 2
                );

                // Stop the timer
                if (this.game.timer) {
                    this.game.timer.stop();
                }

                // Show death screen after a shorter delay (500ms instead of 1000ms)
                setTimeout(() => {
                    if (this.game.levelUI) {
                        // Clear any existing UI state first
                        this.game.levelUI.isDisplayingComplete = false;
                        this.game.levelUI.isDisplayingDeath = true;
                        console.log("Death screen displayed");
                    }
                }, 500); // Reduced to 500ms
            }
        } else {
            console.log("Player would have died, but debug mode is active");
        }
    }

    //call this method when the play has reached the exit door
    async winGame() {
        // Prevent multiple win triggers
        if (this.win) {
            //console.log("Win already triggered, ignoring duplicate call");
            return;
        }

        if (!this.game.options.debugging && !this.dead) { // Add !this.dead check
            this.win = true;

            // Play level complete sound if audio manager exists
            if (window.AUDIO_MANAGER) {
                const winSound = new Audio('./sounds/temp-win-game.mp3');
                winSound.volume = window.AUDIO_MANAGER.isMuted ? 0 : window.AUDIO_MANAGER.volume;
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

                // Explicitly set UI states - clear death screen if it's showing
                this.game.levelUI.isDisplayingDeath = false;
                // Now show the level complete screen
                await this.game.levelUI.showLevelComplete();
            }
        } else {
            console.log("Player win, but debug mode is active or player is dead");
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