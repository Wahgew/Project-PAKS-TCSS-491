// COMPLETELY REPLACE YOUR PLATFORM CLASS WITH THIS VERSION

class Platform {
    constructor({gameEngine, x, y, speed, moving, direction, reverseTime, size}) {
        this.game = gameEngine;
        this.velocity = {x: 0, y: 0};
        this.time = 0;  // Initialize time for reverseTime tracking
        this.reverse = false;  // Initialize reverse state
        this.moving = false;
        this.tracking = null;
        Object.assign(this, {x, y, speed, moving, direction, reverseTime, size});

        // Keep track if player is riding this specific platform
        this.playerRiding = false;

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
            // Is player currently riding this specific platform?
            if (player.standingPlatform === this) {
                this.playerRiding = true;

                // If platform is moving upward with player on it
                if (deltaY < 0) {  // Platform moving up
                    // Check for ceiling collision above player
                    const ceilingCheckBB = new BoundingBox(
                        player.x,
                        player.y - Math.abs(deltaY) - 10, // Check further up based on platform speed
                        player.width,
                        10  // Just check a thin slice above player's head
                    );

                    const ceilingCollision = player.map.checkCollisions({
                        BB: ceilingCheckBB,
                        x: player.x,
                        y: player.y - Math.abs(deltaY) - 10,
                        width: player.width,
                        height: 10
                    });

                    // If ceiling collision detected, kill player
                    if (ceilingCollision.collides) {
                        console.log("Player crushed by platform!");
                        player.kill();
                        this.playerRiding = false;
                    }
                }

                // Allow dropping through with S
                if (this.game.keys['s']) {
                    // This prevents the issue when walking from tiles to platform with S held
                    const justPressedS = this.game.keys['s'] && !player.previousSKeyState;

                    // If S was just pressed OR player has been on this platform for a while and is pressing S
                    if (justPressedS || (player.platformTime > 0.1 && this.game.keys['s'])) {
                        player.isGrounded = false;
                        player.groundedOn = null;
                        player.standingPlatform = null;
                        player.platformTime = 0; // Reset platform time
                        player.velocity.y = 5; // Small downward velocity
                        this.playerRiding = false;
                    } else if (this.game.keys['s']) {
                        // S is held but we haven't been on platform long enough
                        // Just track the time without dropping
                        player.platformTime += this.game.clockTick;
                    }
                } else {
                    // Not pressing S, ensure platformTime is incremented
                    player.platformTime += this.game.clockTick;

                    // Rest of your original code for moving player with platform...
                    player.x += deltaX;
                    if (deltaY < 0) player.y += deltaY;

                    // IMPORTANT: Set exact position and zero out velocity to prevent stuttering
                    player.y = this.BB.top - player.height;
                    player.velocity.y = 0; // Force zero vertical velocity

                    // Update player's bounding box with new position
                    player.updateBB();

                    // Check if player walked off platform edges
                    if (player.BB.right <= this.BB.left || player.BB.left >= this.BB.right) {
                        player.isGrounded = false;
                        player.groundedOn = null;
                        player.standingPlatform = null;
                        player.platformTime = 0; // Reset platform time
                        player.velocity.y = 1; // Small initial falling velocity
                        this.playerRiding = false;
                    }
                }
            }
            // Check if player should land on this platform
            else if (!player.isGrounded && player.velocity.y > 0) {
                const fromAbove = player.lastBB && player.lastBB.bottom <= this.BB.top + 2; // Even tighter tolerance
                const horizontalOverlap = player.BB.right > this.BB.left && player.BB.left < this.BB.right;
                const closeEnough = this.BB.top - player.BB.bottom < 5; // Smaller tolerance

                if (fromAbove && horizontalOverlap && closeEnough && !this.game.keys['s']) {
                    // Only land if we're not currently on another platform or this is closer
                    if (!player.standingPlatform ||
                        (this.BB.top - player.BB.bottom) < (player.standingPlatform.BB.top - player.BB.bottom)) {

                        player.isGrounded = true;
                        player.groundedOn = 'platform';
                        player.standingPlatform = this;
                        player.velocity.y = 0; // Force zero vertical velocity
                        player.y = this.BB.top - player.height; // Exact position
                        player.updateBB();
                        this.playerRiding = true;
                    }
                }
            }
        } else {
            // Player is dead or not existing
            this.playerRiding = false;
        }
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw bounding box
            ctx.strokeStyle = this.playerRiding ? 'green' : 'red';
            ctx.strokeRect(this.BB.left, this.BB.top, this.BB.right - this.BB.left, this.BB.bottom - this.BB.top);

            // Draw top collision area to make sure it's not extending too high
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.BB.left, this.BB.top - 5, this.BB.right - this.BB.left, 10);

            // Show if player is riding
            if (this.playerRiding) {
                ctx.fillStyle = 'green';
                ctx.fillText("PLAYER RIDING", this.x + 10, this.y - 10);
            }
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    }
}