class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 76;
        this.width = 20;

        // initial starting pos of player
        this.intialX = this.x;
        this.intialY = this.y;

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

        this.testSprite = ASSET_MANAGER.getAsset("./sprites/temptest.png");
        this.testAnimator = new Animator(this.testSprite, 0, 0, 54, 60, 1, 1);

        this.facing = 1; // 0 = left, 1 = right
        this.state = 0; // 0 = idle, 1 = walking, 2 = running, 3 = skidding, 4 = jumping/falling
        this.dead = false;
        this.isGrounded = true;
        this.fallAcc = 550;

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
        // this.map = null;
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
            0, 5, 170, 175, 2, 0.17
        );
        this.animations[0][0][0] = new Animator(
            this.idleSpritesheet,
            0, 0, 181, 175, 5, 0.17
        );

        // Run animation
        this.animations[1][0][1] = new Animator(
            this.runSpritesheet,
            0, 0, 181, 175, 5, 0.1
        );
        this.animations[1][0][0] = new Animator(
            this.runSpritesheet,
            0, 0, 181, 175, 5, 0.1
        );

        // Running animation (faster)
        this.animations[2][0][1] = new Animator(
            this.runSpritesheet,
            0, 0, 181, 175, 5, 0.08  // Faster animation for running
        );
        this.animations[2][0][0] = new Animator(
            this.runSpritesheet,
            0, 0, 181, 175, 5, 0.08
        );

        // Jump animation
        for (let i = 3; i <= 4; i++) {
            this.animations[i][0][1] = new Animator(
                this.jumpSpritesheet,
                0, 0, 181, 175, 2, 0.2
            );
            this.animations[i][0][0] = new Animator(
                this.jumpSpritesheet,
                0, 0, 181, 175, 2, 0.2
            );
        }
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

        // Movement constants
        const MIN_WALK = 20;
        const MAX_WALK = 500;
        const MAX_RUN = 1000;
        const ACC_WALK = 650;
        const ACC_RUN = 1250;

        const DEC_REL = 600;
        const DEC_SKID = 1800;
        
        const MAX_FALL = 2000;
        const GRAVITY = 1500;
        const MAX_JUMP = 850;

        // check for death state and restart game
        if (this.dead) {
            // Clear all projectiles immediately when player dies
            //this.game.clearAllProjectiles();
            console.log(this.game.entities);
            if (this.game.keys['enter']) {
                this.restartGame();
                console.log(this.game.entities);
            }
            // may want to load the death animation here then return.
            return; // don't process other updates when dead restart the game instead
        }

        // find the map if not already found
        // if (!this.map) {
        //     this.map = this.game.entities.find(entity => entity instanceof testMap);
        //     if (!this.map) {
        //         console.error("Map not found in update");
        //         return; // Skip update if map not found
        //     }
        // }

        // Update state based on movement and keys
        this.updateState();

        // Jump input handling
        if ((this.game.keys[' '] || this.game.keys['w']) && this.isGrounded) {
            this.velocity.y = -MAX_JUMP;
            this.state = 4;
            this.isGrounded = false;
        }

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

        // Horizontal movement
        this.updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, DEC_REL, DEC_SKID);

        // Apply gravity
        this.velocity.y += GRAVITY * TICK;

        // Apply max velocities
        this.applyMaxVelocities(MAX_WALK, MAX_RUN, MAX_FALL);

        // Handle collisions and position updates
        this.handleCollisions(TICK);
    }
    
    // Updates the player's state based on current conditions
    updateState() {
        if (!this.isGrounded) {
            this.state = 4; // Jumping/Falling
            return;
        }
		
		if (this.game.keys['s']) {
			this.state = 5;
			return;
		}

        if (Math.abs(this.velocity.x) < 20) {
            this.state = 0; // Idle
            return;
        }

        // Running state (holding shift)
        if (this.game.keys['shift'] && (this.game.keys['d'] || this.game.keys['a'])) {
            this.state = 2;
            return;
        }

        // Walking state
        if (this.game.keys['d'] || this.game.keys['a']) {
            this.state = 1;
            return;
        }

        // Default to idle if no other conditions met
        this.state = 0;
    }

    // Updates horizontal movement based on input
    updateHorizontalMovement(TICK, MIN_WALK, MAX_WALK, MAX_RUN, ACC_WALK, ACC_RUN, DEC_REL, DEC_SKID) {
        // Handle left movement
        if (this.game.keys['a'] && !this.game.keys['d']) {
            this.facing = 0;
            if (this.game.keys['shift']) {
                this.velocity.x -= ACC_RUN * TICK;
            } else {
                this.velocity.x -= ACC_WALK * TICK;
            }
        } else if (this.game.keys['d'] && !this.game.keys['a']) { // right movement
            this.facing = 1;
            if (this.game.keys['shift']) {
                this.velocity.x += ACC_RUN * TICK;
            } else {
                this.velocity.x += ACC_WALK * TICK;
            }
        } else { // handle deceleration
            if (this.velocity.x > 0) {
                this.velocity.x = Math.max(0, this.velocity.x - DEC_REL * TICK);
            } else if (this.velocity.x < 0) {
                this.velocity.x = Math.min(0, this.velocity.x + DEC_REL * TICK);
            }
        }

        // Update facing
        if (this.velocity.x < 0) this.facing = 0;
        if (this.velocity.x > 0) this.facing = 1;
    
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
        const collision = this.map.checkCollisions({
            BB: horizontalBB,
            x: nextX,
            y: this.y,
            width: this.width,
            height: this.height
        });

        if (collision.collides) {
            if (this.velocity.x > 0) {
                this.x = collision.tileX - this.width;
            } else if (this.velocity.x < 0) {
                this.x = collision.tileX + this.map.testSize;
            }
            this.velocity.x = 0;
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
        // Clear all entities before loading new level
        //this.game.clearAllProjectiles();
        this.game.levelConfig.loadLevel(this.game.levelConfig.currentLevel);

        // Reset timer if it exists
        if (this.game.timer) {
            this.game.timer.reset();
        }

        // Clear any game keys that might be held
        for (let key in this.game.keys) {
            this.game.keys[key] = false;
        }
    }


    // Renders the player character
    draw(ctx) {

        // check if the player is dead first
        if (this.dead) {
            // Draw death screen
            //this.game.timer.stop(); // future peter decide if I want to stop the time when dead
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.font = '48px monospace';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText('YOU DIED', ctx.canvas.width / 2, ctx.canvas.height / 2);

            ctx.font = '24px monospace';
            ctx.fillStyle = 'white';
            ctx.fillText('Press ENTER to restart', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
            return;
        }

        if (!ctx) return;

        // Draw the appropriate animation based on state and facing direction
        if (this.animations[this.state] && 
            this.animations[this.state][0] && 
            this.animations[this.state][0][this.facing]) {
            
            this.animations[this.state][0][this.facing].drawFrame(
                this.game.clockTick,
                ctx,
                this.x - 37,
                this.y,
                0.5
            );
        }

        // Draw debug box
        if (this.game.options.debugging) {
            if (this.state === 5) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y + this.height / 2, this.width, this.height / 2);
            } else {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
    }
}