class Platform {
    constructor({gameEngine, x, y, speed, moving, direction, reverseTime, size}) {
        this.game = gameEngine;
        this.velocity = {x: 0, y: 0};
        this.time = 0;  // Initialize time for reverseTime tracking
        this.reverse = false;  // Initialize reverse state
        this.moving = false;
        this.tracking = null;
        Object.assign(this, {x, y, speed, moving, direction, reverseTime, size});

        switch (this.size){
            case 'SHORT':
                this.height = 20;
                this.width = 225;
                this.spritesheet = ASSET_MANAGER.getAsset("./sprites/plat_short.png");
                break;
            case 'WIDE':
                this.height = 20;
                this.width = 450;
                this.spritesheet = ASSET_MANAGER.getAsset("./sprites/plat_wide.png");
                break;
        }
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);
        this.updateBB();
        this.lastBB = this.BB;
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        // Store previous position before updating
        const prevX = this.x;
        const prevY = this.y;

        if (this.moving) updateMovement(this.game, this);

        // Apply the velocity to the position
        this.x += this.game.clockTick * this.velocity.x;
        this.y += this.game.clockTick * this.velocity.y;

        // Calculate how much the platform moved
        const deltaX = this.x - prevX;
        const deltaY = this.y - prevY;

        // Update bounding box
        this.updateBB();

        // Handle player on platform
        const player = this.game.Player;
        if (player && !player.dead) {
            // Create a slightly larger bounding box for more reliable collision detection
            const landingBB = new BoundingBox(
                this.BB.left - 5,    // Expand left
                this.BB.top - 5,     // Expand top a bit to catch landing players
                this.BB.width + 10,  // Expand width on both sides
                10                   // Short height just to detect landings
            );

            // Check if player is landing on the platform
            const playerFalling = player.velocity.y > 0;
            const playerAbovePlatform = player.lastBB && player.lastBB.bottom <= this.lastBB.top;
            const playerOverlapsPlatform = player.BB.right > this.BB.left && player.BB.left < this.BB.right;

            if (playerFalling && playerAbovePlatform && playerOverlapsPlatform) {
                // Player is falling from above the platform
                if (player.BB.collide(landingBB) && !this.game.keys['s']) {
                    // Land on platform unless S is pressed
                    player.isGrounded = true;
                    player.velocity.y = 0;
                    // Position player on top of platform
                    player.y = this.BB.top - player.height;
                    player.updateBB();
                }
            }

            // Check if player is standing on this platform
            if (player.isGrounded && player.BB.bottom <= this.BB.top + 5 &&
                player.BB.right > this.BB.left && player.BB.left < this.BB.right) {

                // Only allow dropping through if S is pressed
                if (this.game.keys['s']) {
                    player.isGrounded = false;
                } else {
                    // Move player with platform
                    player.x += deltaX;
                    // Only adjust Y if platform is moving up
                    if (deltaY < 0) {
                        player.y += deltaY;
                    }
                    // Make sure player stays on top
                    player.y = this.BB.top - player.height;
                    player.updateBB();
                }
            }
        }
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            // Draw landing detection box
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, 10);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    }
}

/**
 * Update movement for if enemy entity is moving but !tracking.
 * @param {gameEngine} game 
 * @param {Platform} object
 */
function updateMovement(game, object) {
    // Check if object is moving, and tracking is either undefined or false
    if (object.moving && (object.tracking === null || !object.tracking)) {
        switch (object.direction) {
            case 'UP':
                if (!object.reverse) object.velocity.y = -object.speed; // Moving up (negative y)
                else object.velocity.y = object.speed; // Moving down (positive y)
                break;
            case 'DOWN':
                if (!object.reverse) object.velocity.y = object.speed; // Moving down (positive y)
                else object.velocity.y = -object.speed; // Moving up (negative y)
                break;
            case 'LEFT':
                if (!object.reverse) object.velocity.x = -object.speed; // Moving left (negative x)
                else object.velocity.x = object.speed; // Moving right (positive x)
                break;
            case 'RIGHT':
                if (!object.reverse) object.velocity.x = object.speed; // Moving right (positive x)
                else object.velocity.x = -object.speed; // Moving left (negative x)
                break;
        }

        // Common code for all directions
        if (object.time >= object.reverseTime) {
            object.time = 0;
            object.reverse = !object.reverse;
        }
        // Use the clockTick property of the engine
        object.time += game.clockTick;
    }
}   
