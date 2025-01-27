class exitDoor {
    constructor(game, x, y, size) {
        Object.assign(this, { game, x, y, size });

        // Door dimensions (same as tile size)
        this.width = size;
        this.height = size;

        // Load door sprite/image
        this.doorSprite = ASSET_MANAGER.getAsset("./sprites/exitDoor.png"); // You'll need to add this sprite

        // Door state
        this.isOpen = false;
        this.active = true; // If the door can be interacted with
    }

    update() {
        if (!this.active) return;

        // Get player reference (if needed)
        const player = this.game.entities.find(entity => entity instanceof Player);
        if (!player) return;

        // Check for collision/interaction with player
        if (this.checkPlayerCollision(player)) {
            // Handle door interaction (e.g., level completion, transition, etc.)
            console.log("Player reached the door!");
            // You can add level completion logic here
        }
    }

    checkPlayerCollision(player) {
        return (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y);
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