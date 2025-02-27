class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration});
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
    }

    drawFrame(tick, ctx, x, y, scale = 1, rotate = null) {
        if (!ctx || !this.spritesheet || !this.spritesheet.complete) {
            return;
        }

        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();

        if (rotate != null) {
            var degrees = (rotate * Math.PI) / 180;
            ctx.save();
            ctx.translate(x + this.width / 2, y + this.height / 2);
            ctx.rotate(degrees);

            ctx.drawImage(
                this.spritesheet,
                this.xStart + this.width * frame, 
                this.yStart,
                this.width, 
                this.height,
                - this.width / 2, 
                - this.height / 2,
                this.width,      
                this.height       
            );
    
            ctx.restore();
        } else {
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
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration) % this.frameCount;
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}