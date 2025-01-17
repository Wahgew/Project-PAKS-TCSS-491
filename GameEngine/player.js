class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.game.Player = this;
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/temptest.png");
        this.animator = new Animator(ASSET_MANAGER.getAsset("./sprites/temptest.png"), 0, 0, 219, 240, 1, 1);

        this.facing = 1; // 0 = left, 1 = right
        this.state = 0; // 0 = idle, 1 = walking, 2 = running, 3 = skidding, 4 = in air, 5 = crouching/sliding
        this.dead = false;

        this.velocity = {x : 0, y : 0};
        this.fallAcc = 562.5;
    }

    update() {
        const TICK = this.game.clockTick;
        console.log(this.game.keys['k']);

        // Currently same values for Mario's movement from Mariott.
        const MIN_WALK = 20;
        const MAX_WALK = 500;
        const MAX_RUN = 1000; 
        const ACC_WALK = 650;
        const ACC_RUN = 1250; 
        const DEC_REL = 900;
        const DEC_SKID = 1800;
        const MIN_SKID = 180; // not used?

        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const STOP_FALL_A = 450;
        const WALK_FALL_A = 421.875;
        const RUN_FALL_A = 562.5;

        const MAX_FALL = 270;

        this.velocity.y += this.fallAcc * TICK;

        if (this.state !== 4) { // if player is not jumping
            // idle, walking, running, skidding ground physics
            if (Math.abs(this.velocity.x) < MIN_WALK) {
                this.velocity.x = 0;
                this.state = 0;
                if (this.game.keys['a'] && !this.game.keys['s']) {
                    this.velocity.x -= MIN_WALK;
                }
                if (this.game.keys['d'] && !this.game.keys['s']) {
                    this.velocity.x += MIN_WALK;
                }
            } else if (Math.abs(this.velocity.x) >= MIN_WALK) { // accelerating or decelerating
                if (this.facing === 0) { // left
                    if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) { // moving
                        if (this.game.keys['shift']) { // if sprinting
                            this.velocity.x -= ACC_RUN * TICK;
                        } else this.velocity.x -= ACC_WALK * TICK;
                    } else if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) { // skidding
                        this.velocity.x += DEC_SKID * TICK;
                        this.state = 3
                    } else { // holding nothing
                        this.velocity.x += DEC_REL * TICK;
                    }
                }
                if (this.facing === 1) { // right
                    if (this.game.keys['d'] && !this.game.keys['a'] && !this.game.keys['s']) { // moving
                        if (this.game.keys['shift']) { // if sprinting
                            this.velocity.x += ACC_RUN * TICK;
                        } else this.velocity.x += ACC_WALK * TICK;
                    } else if (this.game.keys['a'] && !this.game.keys['d'] && !this.game.keys['s']) { // skidding
                        this.velocity.x -= DEC_SKID * TICK;
                        this.state = 3
                    } else { // holding nothing
                        this.velocity.x -= DEC_REL * TICK;
                    }
                }
            }
        }
        
        this.velocity.y += this.fallAcc * TICK;

        // max speed calculation
        if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
        if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

        if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
        if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
        if (this.velocity.x >= MAX_WALK && !this.game.keys['shift']) this.velocity.x = MAX_WALK;
        if (this.velocity.x <= -MAX_WALK && !this.game.keys['shift']) this.velocity.x = -MAX_WALK;

        // update position
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
        if (this.y > 500) this.y = 500; // hard coding in a floor and walls temporarily while no collision or level.
        if (this.x < 0) this.x = 0; 
        if (this.x > 804) this.x = 804 

        // update facing
        if (this.velocity.x < 0) this.facing = 0;
        if (this.velocity.x > 0) this.facing = 1;
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}