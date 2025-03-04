class BigBlock {
    constructor(game, x, y, x2, y2) {
        Object.assign(this, {game, x, y, x2, y2});
        this.width = x2 - x;
        this.height = y2 - y;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.colors = ["maroon", 'teal', 'plum', 'darkslategray'] // actual colors are black, "darkcyan", "darkslateblue", 'slategray'
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
        ctx.fillStyle = this.colors[this.game.currentColor];
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}