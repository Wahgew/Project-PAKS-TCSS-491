class BigBlock {
    constructor(game, x, y, width, height) {
        Object.assign(this, {game, x, y, width, height});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bigblock.png"); // get sprite 1920 x 1080
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.1);
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }
    update() {
        ;
    }
    draw(ctx) {
        if (this.game.options.debugging) {
            // Draw debug box
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}