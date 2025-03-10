class AutoScreenResizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.originalWidth = canvas.width;
        this.originalHeight = canvas.height;

        // Detect screen size and apply initial scaling
        this.initializeScreenScaling();

        // Listen for window resize events
        window.addEventListener('resize', () => this.initializeScreenScaling());
    }

    initializeScreenScaling() {
        // Get screen dimensions
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;

        // Define scaling logic based on screen size
        let scaleFactor = 1;

        // For screens smaller than Full HD (1920x1080)
        if (screenWidth < 1920 || screenHeight < 1080) {
            scaleFactor = 0.75; // Reduce to 75% of original size
        }

        // For very small screens (like laptops or smaller displays)
        if (screenWidth < 1366 || screenHeight < 768) {
            scaleFactor = 0.5; // Reduce to 50% of original size
        }

        // Apply scaling
        this.canvas.style.transform = `scale(${scaleFactor})`;
        this.canvas.style.transformOrigin = 'top left';

        // Log scaling information for debugging
        console.log(`Screen Size: ${screenWidth}x${screenHeight}`);
        console.log(`Applied Scale: ${scaleFactor}`);
    }
}

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameWorld');
    new AutoScreenResizer(canvas);
});