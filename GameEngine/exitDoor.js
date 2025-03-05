class exitDoor {
    constructor(game, x, y, levers = 0) { // 0 levers required by default
        Object.assign(this, { game, x, y, levers});

        // Door dimensions (same as tile size)
        this.width = 276;
        this.height = 326;
    
        // Load door sprite/image
        //this.doorSprite = ASSET_MANAGER.getAsset("./sprites/exitDoor.png"); // You'll need to add this sprite
        this.doorLock = ASSET_MANAGER.getAsset("./sprites/exit_door_locked.png");
        this.doorUnlock = ASSET_MANAGER.getAsset("./sprites/exit_door_unlocked.png")
        this.animLock  = new Animator(this.doorLock, 0, 0, this.width, this.height, 1, 0.1);
        this.animUnlock  = new Animator(this.doorUnlock, 0, 0, this.width, this.height, 1, 0.1);

        // Door state
        this.isOpen = false;
        this.active = true; // If the door can be interacted with
        this.collectedLevers = 0;
        this.scale = 0.25

        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width * this.scale, this.height * this.scale);
    }

    update() {
        if (!this.active) return;
        if (this.collectedLevers >= this.levers) this.isOpen = true;
    }

    draw(ctx) {
        if (!ctx) return;

        // if (this.doorSprite) {
        //     // Draw door sprite
        //     ctx.drawImage(this.doorSprite, this.x, this.y, this.width, this.height);
        // } else {
        //     // Fallback: draw a colored rectangle if sprite isn't loaded
        //     ctx.fillStyle = "brown";
        //     ctx.fillRect(this.x, this.y, this.width, this.height);
        // }
        if (this.isOpen) {
            this.animUnlock.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.25);
        } else  {
            this.animLock.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.25);
        }

        // Debug: draw collision box
        if (this.game.options.debugging) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.width * this.scale, this.height * this.scale);
        }
    }
}