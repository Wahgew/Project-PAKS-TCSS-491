class ProjectileLauncher {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = 0;
        this.width = 0;
        this.time = 0;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/temptest.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 1, 0.1);

        this.velocity = {x: 0, y: 0};
        
    }
    update() {

    }

    draw(ctx) {

    }
}

/**  
*   gameEngine.addEntity(new Spike({gameEngine, x: 500, y: 250, speed: 50, moving: true, direction: null, tracking: true, reverseTime: 0}));
*    
*   Pass in an object for parameters when constructing, note the brackets above {}
*    
*   @param {gameEngine} gameEngine Cannot be renamed, gameEngine must be called gameEngine
*   @param {int} x x coordinate of the spike
*   @param {int} y y coordinate of the spike
*   @param {int} speed how fast spike moves if moving/tracking
*   @param {bool} moving if the spike should move, if true AND tracking is false, then direction needs to be set
*   @param {string} direction "UP", "DOWN", "LEFT", "RIGHT" determines starting moving direction
*   @param {bool} tracking Determines if spike will move toward center of player's body
*   @param {int} reverseTime determines how long until spike reverses its direction if moving, 200 is a second roughly?
*/
class Spike {
    constructor({gameEngine, x, y, speed, moving, direction, tracking, reverseTime}) {
        this.game = gameEngine;
        Object.assign(this, { x, y, speed, moving, direction, tracking, reverseTime});

        this.height = 60;
        this.width = 60;
        this.time = 0;
        this.reverse = false;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/spike_small.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 1, 0.1);

        this.velocity = {x: 0, y: 0};
    }

    update() {
        var that = this;
        if (this.moving && this.tracking) {
            this.game.entities.forEach(function (entity) { // change this??? jank
                if (entity instanceof Player) {
                    if (entity.x + (entity.width / 4) > that.x) {
                        that.velocity.x = that.speed;
                    } else {
                        that.velocity.x = -that.speed;
                    }
                    if (entity.y + (entity.height / 4) > that.y) {
                        that.velocity.y = that.speed;
                    } else {
                        that.velocity.y = -that.speed;
                    }
                }
            });
        } else if (this.moving && !this.tracking) {
            switch(this.direction) {
                case 'UP':
                    if (!this.reverse) this.velocity.y = this.speed;
                    else this.velocity.y = -this.speed;
                    if (this.time >= this.reverseTime) {
                        this.time = 0;
                        this.reverse = !this.reverse;
                    }
                    this.time++;    
                case 'DOWN':
                    if (this.reverse) this.velocity.y = this.speed;
                    else this.velocity.y = -this.speed;
                    if (this.time >= this.reverseTime) {
                        this.time = 0;
                        this.reverse = !this.reverse;
                    }
                    this.time++;    
                case 'RIGHT':
                    if (this.reverse) this.velocity.x = this.speed;
                    else this.velocity.x = -this.speed;
                    if (this.time >= this.reverseTime) {
                        this.time = 0;
                        this.reverse = !this.reverse;
                    }
                    this.time++;    
                case 'LEFT':
                    if (!this.reverse) this.velocity.x = this.speed;
                    else this.velocity.x = -this.speed;
                    if (this.time >= this.reverseTime) {
                        this.time = 0;
                        this.reverse = !this.reverse;
                    }
                    this.time++;    
            }
        }
        this.x += this.game.clockTick * this.velocity.x; 
        this.y += this.game.clockTick * this.velocity.y;
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}


/* class templateExample {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = ;
        this.width = ;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/temptest.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 1, 0.1);

        this.velocity = {x: 0, y: 0};

        
    }
    update() {

    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    }
} */
