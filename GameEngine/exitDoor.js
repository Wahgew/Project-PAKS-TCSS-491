class exitDoor {
    constructor(game, x, y, size, levers = 0) { // 0 levers required by default
        Object.assign(this, { game, x, y, size, levers});

        // Door dimensions (same as tile size)
        this.width = size;
        this.height = size;

        // Load door sprite/image
        this.doorSprite = ASSET_MANAGER.getAsset("./sprites/exitDoor.png"); // You'll need to add this sprite

        // Door state
        this.isOpen = false;
        this.active = true; // If the door can be interacted with

        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        if (!this.active) return;
        this.updateBB();
    }

    draw(ctx) {
        if (!ctx) return;

        if (this.doorSprite) {
            // Draw door sprite
            ctx.drawImage(this.doorSprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: draw a colored rectangle if sprite isn't loaded
            ctx.fillStyle = "brown";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Debug: draw collision box
        if (this.game.options.debugging) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}