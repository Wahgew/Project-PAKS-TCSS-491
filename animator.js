class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration});
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
    }

    drawFrame(tick, ctx, x, y, scale = 1) {
        if (!ctx || !this.spritesheet || !this.spritesheet.complete) {
            return;
        }

        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();

        try {
            ctx.drawImage(
                this.spritesheet,
                this.xStart + this.width * frame, 
                this.yStart,
                this.width, 
                this.height,
                x, 
                y,
                this.width * scale,      // Use width * scale
                this.height * scale      // Use height * scale
            );
        } catch (e) {
            console.error("Draw error:", e);
        }
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration) % this.frameCount;
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}