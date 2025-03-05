class DeathAnimation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.finished = false;
        this.duration = 0.5; // seconds
        this.elapsed = 0;
        this.initialized = false;
    }

    initialize() {
        // Create particles in a circular pattern
        const numLines = 20;
        const numBlobs = 15;
        const numBodyParts = 6;

        // Add blood lines
        for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2;
            this.particles.push(new DeathParticle(
                this.x,
                this.y,
                'line',
                angle,
                Math.random() * 300 + 400
            ));
        }

        // Add blood blobs
        for (let i = 0; i < numBlobs; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push(new DeathParticle(
                this.x,
                this.y,
                'blob',
                angle,
                Math.random() * 200 + 300
            ));
        }

        // Add body parts
        for (let i = 0; i < numBodyParts; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push(new DeathParticle(
                this.x,
                this.y,
                'bodyPart',
                angle,
                Math.random() * 150 + 250
            ));
        }

        this.initialized = true;
    }

    update(deltaTime) {
        if (!this.initialized) {
            this.initialize();
        }

        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.finished = true;
            return;
        }

        // Update all particles and remove dead ones
        this.particles = this.particles.filter(particle => particle.update(deltaTime));
    }

    draw(ctx) {
        if (!this.initialized) return;

        // Draw all particles
        this.particles.forEach(particle => particle.draw(ctx));
    }
}