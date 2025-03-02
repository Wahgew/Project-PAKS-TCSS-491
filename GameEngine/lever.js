class Lever {
    //testing
    constructor({gameEngine, x, y, speed, moving, direction, reverseTime}) {
        this.game = gameEngine;
        Object.assign(this, {x, y, speed, moving, direction, reverseTime});

        this.height = 53;
        this.width = 23;
        this.time = 0;
        this.reverse = false;
        this.collected = false;

        // Load spritesheet
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/lever_uncollected.png");
        //this.spritesheet2 = ASSET_MANAGER.getAsset("./sprites/lever_collected.png");
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/leverOn.png");
        this.spritesheet2 = ASSET_MANAGER.getAsset("./sprites/leverOff.png")

        // Create animator with the actual image dimensions
        const imageWidth = this.spritesheet.width;   // Use actual image width
        const imageHeight = this.spritesheet.height; // Use actual image height

        // Create animator with full sprite dimensions
        this.animatorUn = new Animator(this.spritesheet, 0, 0, imageWidth, imageHeight, 1, 0.1);
        this.animatorCol = new Animator(this.spritesheet2, 0, 0, imageWidth, imageHeight, 1, 0.1);

        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        if (this.moving) updateMovement();
        this.updateBB();
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        if (!this.collected) {
            this.animatorUn.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.5);
        } else {
            this.animatorCol.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.5);
        }
    }
}

/**
 * Update movement for if enemy entity is moving but !tracking.
 * @param {gameEngine} game 
 * @param {enemies} object 
 */
function updateMovement(game, object) { // consider option to make reverse coord based, so spikes can move in same location but staggered start.
    if (object.moving && !object.tracking) { // make option for based on distance from starting, i.e. move until x is like -50 from start coord.
        switch (object.direction) {
            case 'UP':
                if (!object.reverse) object.velocity.y = object.speed;
                else object.velocity.y = -object.speed;
                if (object.time >= object.reverseTime) {
                    object.time = 0;
                    object.reverse = !object.reverse;
                }
                object.time += game.clockTick;
                break;
            case 'DOWN':
                if (object.reverse) object.velocity.y = object.speed;
                else object.velocity.y = -object.speed;
                if (object.time >= object.reverseTime) {
                    object.time = 0;
                    object.reverse = !object.reverse;
                }
                object.time += game.clockTick;
                break;
            case 'LEFT':
                if (object.reverse) object.velocity.x = object.speed;
                else object.velocity.x = -object.speed;
                if (object.time >= object.reverseTime) {
                    object.time = 0;
                    object.reverse = !object.reverse;
                }
                object.time += game.clockTick;
                break;
            case 'RIGHT':
                if (!object.reverse) object.velocity.x = object.speed;
                else object.velocity.x = -object.speed;
                if (object.time >= object.reverseTime) {
                    object.time = 0;
                    object.reverse = !object.reverse;
                }
                object.time += game.clockTick;
                break;
        }
    }
}   