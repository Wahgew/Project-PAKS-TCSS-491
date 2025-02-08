/**  
 *  Example Template
 * 
 * 	gameEngine.addEntity(new ProjectileLauncher({gameEngine, x: 975, y: 325, speed: 0, moving: false, direction: "LEFT", reverseTime: 0}));
 *      
 *  Pass in an object for parameters when constructing, note the brackets above {}
 *    
 *  @param {gameEngine} gameEngine Cannot be renamed, gameEngine must be gameEngine object.
 *  @param {int} x x coordinate of the launcher.
 *  @param {int} y y coordinate of the launcher.
 *  @param {int} speed how fast projectiles move.
 *  @param {bool} moving if the launcher should move, if true AND tracking is false, then direction needs to be set
 *  @param {string} direction "UP", "DOWN", "LEFT", "RIGHT" determines starting moving direction.
 *  @param {int} reverseTime determines how long until project reverses its direction if moving in seconds.
 *  @param {int} atkspd time in seconds between shots.
 *  @param {int} projspd velocity of the projectile.
 *  @param {string} shotdirec "UP", "DOWN", "LEFT", "RIGHT" determines projectile direction.
 */
class ProjectileLauncher {
    constructor({gameEngine, x, y, speed, moving, direction, reverseTime, atkspd, projspd, shotdirec}) {
        this.game = gameEngine;
        Object.assign(this, {x, y, speed, moving, direction, reverseTime, atkspd, projspd, shotdirec});

        this.height = 54;
        this.width = 58;
        this.time = 0;
        this.reverse = false;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/launcher_small.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 1, 0.1);

        this.velocity = {x: 0, y: 0};
    }

    update() {
        if (this.moving) updateMovement(this.game, this);
        if (this.time >= this.atkspd) {
            this.time = 0;
            this.game.addEntity(new Projectile(this.game, this.x, this.y, this.projspd, this.shotdirec))
        }
        this.time += this.game.clockTick;
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
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    }
}

class Projectile {
    constructor(game, x, y, speed, direction) {
        Object.assign(this, {game, x, y, speed, direction});
        this.y += 9; // this is hardcoded right now, needs to adjust for direction, use switch case prolly.

        this.height = 45;
        this.width = 45;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tempproj3.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.height, this.width, 1, 0.1);
        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        switch (this.direction) {
            case 'UP':
                this.velocity.y = -this.speed;
            case 'DOWN':
                this.velocity.y = this.speed;
            case 'RIGHT':
                this.velocity.x = this.speed;
            case 'LEFT':
                this.velocity.x = -this.speed;
        }
        this.x += this.game.clockTick * this.velocity.x; 
        this.y += this.game.clockTick * this.velocity.y;
        
        this.updateBB();
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    }
}

/**  
 *  Example Template
 * 
 *  gameEngine.addEntity(new Spike({gameEngine, x: 500, y: 250, speed: 50, moving: true, direction: null, tracking: true, reverseTime: 0}));
 *      
 *  Pass in an object for parameters when constructing, note the brackets above {}
 *    
 *  @param {gameEngine} gameEngine Cannot be renamed, gameEngine must be gameEngine object.
 *  @param {int} x x coordinate of the spike.
 *  @param {int} y y coordinate of the spike.
 *  @param {int} speed how fast spike moves if moving/tracking.
 *  @param {bool} moving if the spike should move, if true AND tracking is false, then direction needs to be set.
 *  @param {string} direction "UP", "DOWN", "LEFT", "RIGHT" determines starting moving direction.
 *  @param {bool} tracking Determines if spike will move toward center of player's body.
 *  @param {int} reverseTime determines how long until spike reverses its direction if moving in seconds.
 */
class Spike {
    constructor({gameEngine, x, y, speed, moving, direction, tracking, reverseTime}) { 
        this.game = gameEngine;
        Object.assign(this, {x, y, speed, moving, direction, tracking, reverseTime});

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
        } else if (this.moving && !this.tracking) { // CHANGE THIS TO USE timer.js implementation.
           updateMovement(this.game, this)
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
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    }
}

class Laser { // A LOT OF JANK with this, refactor this later for sure.
    constructor({gameEngine, x, y, speed, moving, direction, shotdirec, length}) {
        this.game = gameEngine;
        Object.assign(this, {x, y, speed, moving, direction, shotdirec, length});

        this.height = 60;
        this.width = this.length;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/laser_test.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);
        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    updateBB(){
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        //if (this.moving) updateMovement(this.game, this);
        this.x += this.game.clockTick * this.velocity.x; 
        this.y += this.game.clockTick * this.velocity.y;
        this.updateBB();
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
            case 'RIGHT':
                if (object.reverse) object.velocity.x = object.speed;
                else object.velocity.x = -object.speed;
                if (object.time >= object.reverseTime) {
                    object.time = 0;
                    object.reverse = !object.reverse;
                }
                object.time += game.clockTick;
                break;
            case 'LEFT':
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