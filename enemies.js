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
        this.time = this.atkspd; // shoot projectile immediately
        this.reverse = false;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/launcher_small.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);

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
        switch (this.shotdirec) {
            case 'UP':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, 90);
                break;
            case 'DOWN':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, 270);
                break;
            case 'RIGHT':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, 180);
                break;
            case 'LEFT':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
                break;
        }
    }
}

class Projectile {
    constructor(game, x, y, speed, direction) {
        Object.assign(this, {game, x, y, speed, direction});
        // switch(direction) { // this is because the sprite is slightly misaligned temp.
        //     case 'UP':
        //         this.y += 9;
        //     break;
        // }
        this.y += 9; // this is hardcoded right now, needs to adjust for direction, use switch case prolly.

        this.height = 45;
        this.width = 45;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tempproj3.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);
        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        // Set velocity based on direction
        switch (this.direction) {
            case 'UP':
                this.velocity.y = -this.speed;
                break;
            case 'DOWN':
                this.velocity.y = this.speed;
                break;
            case 'RIGHT':
                this.velocity.x = this.speed;
                break;
            case 'LEFT':
                this.velocity.x = -this.speed;
                break;
        }

        // Update position
        this.x += this.game.clockTick * this.velocity.x;
        this.y += this.game.clockTick * this.velocity.y;

        // Check for collisions with map
        const map = this.game.entities.find(entity => entity instanceof drawMap);
        if (map) {
            const collision = map.checkCollisions({
                BB: this.BB,
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            });

            if (collision.collides) {
                this.removeFromWorld = true;
                return; // Stop processing if we're removing from world
            }
        }

        // Check for collisions with big blocks
        this.game.entities.forEach(entity => {
            if (entity instanceof BigBlock && this.BB.collide(entity.BB)) {
                this.removeFromWorld = true;
            }
        });

        this.updateBB();
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        switch (this.direction) {
            case 'UP':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, 90);
                break;
            case 'DOWN':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, 270);
                break;
            case 'RIGHT':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, 180);
                break;
            case 'LEFT':
                this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
                break;
        }
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

        this.height = 40;
        this.width = 40;
        this.time = 0;
        this.reverse = false;
        this.spin = 0;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/spike_small.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);

        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        var that = this;
        if (this.moving && this.tracking) {
            this.game.entities.forEach(function (entity) { 
                if (entity instanceof Player) {
                    if (entity.x + entity.width / 2 > that.x + that.width / 2) {
                        that.velocity.x = that.speed;
                    } else {
                        that.velocity.x = -that.speed;
                    }
                    if (entity.y + entity.height / 2 > that.y + that.height / 2) {
                        that.velocity.y = that.speed;
                    } else {
                        that.velocity.y = -that.speed;
                    }
                }
            });
        } else if (this.moving && !this.tracking) { 
           updateMovement(this.game, this)
        }
        // Calculate next position
        const nextX = this.x + this.game.clockTick * this.velocity.x;
        const nextY = this.y + this.game.clockTick * this.velocity.y;

        // Check for collisions with map
        const map = this.game.entities.find(entity => entity instanceof drawMap);
        if (map) {
            // Check horizontal movement collision
            const horizontalBB = new BoundingBox(nextX, this.y, this.width, this.height);
            const horizontalCollision = map.checkCollisions({
                BB: horizontalBB,
                x: nextX,
                y: this.y,
                width: this.width,
                height: this.height
            });

            // Check vertical movement collision
            const verticalBB = new BoundingBox(this.x, nextY, this.width, this.height);
            const verticalCollision = map.checkCollisions({
                BB: verticalBB,
                x: this.x,
                y: nextY,
                width: this.width,
                height: this.height
            });

            // Apply horizontal movement if no collision
            if (!horizontalCollision.collides) {
                this.x = nextX;
            } else if (this.tracking) {
                // If tracking and hit a wall, reverse direction
                this.velocity.x = -this.velocity.x;
            }

            // Apply vertical movement if no collision
            if (!verticalCollision.collides) {
                this.y = nextY;
            } else if (this.tracking) {
                // If tracking and hit a wall, reverse direction
                this.velocity.y = -this.velocity.y;
            }
        } else {
            // If no map found, just apply movement
            this.x = nextX;
            this.y = nextY;
        }

        // Check for collisions with BigBlock entities
        this.game.entities.forEach(entity => {
            if (entity instanceof BigBlock) {
                const horizontalBB = new BoundingBox(this.x, this.y, this.width, this.height);
                if (horizontalBB.collide(entity.BB)) {
                    // Restore previous position and possibly reverse direction
                    this.x = prevX;
                    if (this.tracking) {
                        this.velocity.x = -this.velocity.x;
                    }
                }

                const verticalBB = new BoundingBox(this.x, this.y, this.width, this.height);
                if (verticalBB.collide(entity.BB)) {
                    // Restore previous position and possibly reverse direction
                    this.y = prevY;
                    if (this.tracking) {
                        this.velocity.y = -this.velocity.y;
                    }
                }
            }
        });
        this.spin += 360 * this.game.clockTick;
        if (this.spin >= 720) this.spin = 0;
        this.updateBB();
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw the sprite
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1, this.spin);
    }
}

class Laser { 
    constructor({gameEngine, x, y, speed, moving, direction, reverseTime, shotdirec, length}) {
        this.game = gameEngine;
        Object.assign(this, {x, y, speed, moving, direction, reverseTime, shotdirec, length});

        this.height = 15; // hard coded in height, change if lineWidth changes.
        this.width = this.length;
        this.reverse = false;
        this.time = 0;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/laser_test.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);
        this.velocity = {x: 0, y: 0};
        this.updateBB();
    }

    updateBB(){
        this.BB = new BoundingBox(this.x, this.y - this.height / 2, this.width, this.height); 
    }

    update() {
        if (this.moving) updateMovement(this.game, this);
        this.x += this.game.clockTick * this.velocity.x; 
        this.y += this.game.clockTick * this.velocity.y;
        this.updateBB();
    }

    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y - this.height / 2, this.width, this.height);
        }
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        switch (this.shotdirec) {
            case 'UP':
                ctx.lineTo(this.x, this.y - this.length);
                break;
            case 'DOWN':
                ctx.lineTo(this.x, this.y + this.length);
                break;
            case 'LEFT':
                ctx.lineTo(this.x - this.length, this.y);
                break;
            case 'RIGHT':
                ctx.lineTo(this.x + this.length, this.y);
                break;
        }
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Enhanced Laser class that renders a glowing laser effect using HTML5 Canvas
 *
 * @param {object} options - Configuration options for the laser
 * @param {object} options.gameEngine - The game engine instance
 * @param {number} options.x - Starting X position
 * @param {number} options.y - Starting Y position
 * @param {string} options.direction - Orientation of the laser: 'HORIZONTAL' or 'VERTICAL'
 * @param {string} options.flow - Direction of beam: 'LEFT', 'RIGHT', 'UP', 'DOWN' (affects animation)
 * @param {number} options.length - Length of the laser beam
 * @param {string} options.color - Main color of the laser (default: 'red')
 * @param {string} options.glowColor - Color of the glow effect (default: 'rgba(255, 0, 0, 0.5)')
 * @param {number} options.width - Width of the central laser beam (default: 4)
 * @param {number} options.glowWidth - Width of the glow effect (default: 12)
 */
class GlowingLaser {
    constructor(options) {
        // Required parameters
        this.game = options.gameEngine;
        this.x = options.x;
        this.y = options.y;

        // Direction handling - simplified to HORIZONTAL or VERTICAL
        if (options.direction === 'HORIZONTAL' || options.direction === 'VERTICAL') {
            this.orientation = options.direction;
        } else if (options.direction === 'LEFT' || options.direction === 'RIGHT') {
            this.orientation = 'HORIZONTAL';
        } else if (options.direction === 'UP' || options.direction === 'DOWN') {
            this.orientation = 'VERTICAL';
        } else {
            this.orientation = 'HORIZONTAL'; // Default
            console.warn("Invalid direction for GlowingLaser. Using HORIZONTAL as default.");
        }

        // Flow direction (for animation)
        this.flow = options.flow || options.direction || 'RIGHT';
        this.length = options.length || 500;

        // Visual customization
        this.color = options.color || 'red';
        this.glowColor = options.glowColor || 'rgba(255, 0, 0, 0.5)';
        this.width = options.width || 8;  // Increased default width for visibility
        this.glowWidth = options.glowWidth || 20;  // Increased default glow width

        // Set endpoints based on orientation
        this.setEndpoints();

        // Create the bounding box for collision detection
        this.createBoundingBox();

        // Animation properties
        this.pulseRate = 0.005; // Controls how fast the laser pulses
        this.pulseAmount = 0.2;  // Controls how much the laser intensity changes
        this.pulseOffset = Math.random() * Math.PI * 2; // Random starting offset for animation
        this.particleTime = 0;

        // Particles for enhanced effect
        this.particles = [];

        // Debug info
        console.log(`Created GlowingLaser at (${this.x}, ${this.y}) with orientation ${this.orientation}`);
        console.log(`Endpoints: (${this.endX}, ${this.endY}), Length: ${this.length}`);
    }

    setEndpoints() {
        // Calculate the end point based on orientation and length
        if (this.orientation === 'HORIZONTAL') {
            if (this.flow === 'LEFT') {
                this.endX = this.x - this.length;
                this.endY = this.y;
            } else {
                this.endX = this.x + this.length;
                this.endY = this.y;
            }
        } else { // VERTICAL
            if (this.flow === 'UP') {
                this.endX = this.x;
                this.endY = this.y - this.length;
            } else {
                this.endX = this.x;
                this.endY = this.y + this.length;
            }
        }
    }

    createBoundingBox() {
        let x, y, width, height;

        // Set dimensions and position based on orientation
        if (this.orientation === 'HORIZONTAL') {
            const startX = Math.min(this.x, this.endX);
            const endX = Math.max(this.x, this.endX);
            x = startX;
            y = this.y - this.width/2; // Center the beam vertically
            width = endX - startX;
            height = this.width;
        } else { // VERTICAL
            const startY = Math.min(this.y, this.endY);
            const endY = Math.max(this.y, this.endY);
            x = this.x - this.width/2; // Center the beam horizontally
            y = startY;
            width = this.width;
            height = endY - startY;
        }

        this.BB = new BoundingBox(x, y, width, height);
    }

    update() {
        // Get the time increment from game engine
        const TICK = this.game.clockTick;
        if (!TICK) return; // Safety check

        // Update pulsing animation
        this.pulseOffset += this.pulseRate * 1000 * TICK;

        // Update particles
        this.particleTime += TICK;
        if (this.particleTime > 0.05) {
            // Add new particles occasionally
            this.addParticles();
            this.particleTime = 0;
        }

        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.life -= TICK;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                particle.alpha = particle.life / particle.maxLife;

                // Move particles slightly based on flow direction
                switch (this.flow) {
                    case 'RIGHT':
                        particle.x += particle.speed * TICK;
                        break;
                    case 'LEFT':
                        particle.x -= particle.speed * TICK;
                        break;
                    case 'DOWN':
                        particle.y += particle.speed * TICK;
                        break;
                    case 'UP':
                        particle.y -= particle.speed * TICK;
                        break;
                }
            }
        }
    }

    addParticles() {
        // Add particles along the laser beam
        const particlesCount = 2; // Increased for more visual effect

        for (let i = 0; i < particlesCount; i++) {
            // Position particles randomly along the beam
            let randomPos = Math.random();
            let px, py;

            if (this.orientation === 'HORIZONTAL') {
                px = this.x + (this.endX - this.x) * randomPos;
                py = this.y + (Math.random() * 2 - 1) * (this.width / 2);
            } else {
                px = this.x + (Math.random() * 2 - 1) * (this.width / 2);
                py = this.y + (this.endY - this.y) * randomPos;
            }

            // Create particle
            this.particles.push({
                x: px,
                y: py,
                size: 2 + Math.random() * 4, // Increased size for visibility
                speed: 10 + Math.random() * 20,
                life: 0.2 + Math.random() * 0.3,
                maxLife: 0.2 + Math.random() * 0.3,
                alpha: 1
            });
        }
    }

    draw(ctx) {
        // Safety check for context
        if (!ctx) {
            console.error("GlowingLaser.draw called without context");
            return;
        }

        // Debug visualization
        if (this.game && this.game.options && this.game.options.debugging) {
            // Draw debug info
            console.log("Drawing GlowingLaser from", this.x, this.y, "to", this.endX, this.endY);

            // Draw very obvious debug shapes at start and end points
            ctx.fillStyle = 'magenta';
            ctx.fillRect(this.x - 10, this.y - 10, 20, 20); // Start point
            ctx.fillRect(this.endX - 10, this.endY - 10, 20, 20); // End point

            // Draw bounding box
            if (this.BB) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.BB.left, this.BB.top, this.BB.width, this.BB.height);
            }

            // Add orientation text
            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`Laser: ${this.orientation} (${this.x},${this.y}) to (${this.endX},${this.endY})`,
                this.x, this.y - 15);
        }

        // LASER BEAM RENDERING
        // --------------------
        // Pulse effect value between 0.8 and 1.2
        const pulseValue = 1 + Math.sin(this.pulseOffset) * this.pulseAmount;

        // Save the context state
        ctx.save();

        try {
            // Draw glow effect (outer layer)
            ctx.beginPath();
            ctx.lineWidth = this.glowWidth * pulseValue;
            ctx.strokeStyle = this.glowColor;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();

            // Draw secondary glow (middle layer)
            ctx.beginPath();
            ctx.lineWidth = (this.glowWidth / 2) * pulseValue;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();

            // Draw core beam (inner layer)
            ctx.beginPath();
            ctx.lineWidth = this.width * pulseValue;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();

            // Draw bright white center
            ctx.beginPath();
            ctx.lineWidth = (this.width / 2) * pulseValue;
            ctx.strokeStyle = 'white';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();

            // Draw endpoints (bright spots)
            this.drawEndpoint(ctx, this.x, this.y, pulseValue);
            this.drawEndpoint(ctx, this.endX, this.endY, pulseValue);

            // Draw particles
            this.drawParticles(ctx);
        } catch (e) {
            console.error("Error drawing laser:", e);
        }

        // Restore the context state
        ctx.restore();
    }

    drawEndpoint(ctx, x, y, pulseValue) {
        try {
            // Draw a bright glow at the endpoints
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.glowWidth * pulseValue);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.3, this.color);
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, this.glowWidth * pulseValue, 0, Math.PI * 2);
            ctx.fill();
        } catch (e) {
            console.error("Error drawing laser endpoint:", e);
        }
    }

    drawParticles(ctx) {
        try {
            // Draw all particles
            for (const particle of this.particles) {
                ctx.globalAlpha = particle.alpha;

                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(0.5, this.color);
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        } catch (e) {
            console.error("Error drawing laser particles:", e);
        }
    }
}

/**
 * Update movement for if enemy entity is moving but !tracking.
 * @param {gameEngine} game 
 * @param {enemies} object 
 */
function updateMovement(game, object) { // consider option to make reverse coord based, so spikes can move in same location but staggered start.
    if ((object.moving && !object.tracking)) { // make option for based on distance from starting, i.e. move until x is like -50 from start coord.
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

/* class templateExample {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.height = ;
        this.width = ;

        // Load spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/temptest.png");

        // Create animator with full sprite dimensions
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);

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