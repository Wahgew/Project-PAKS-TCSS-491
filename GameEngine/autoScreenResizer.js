/**
 * AutoScreenResizer
 *
 * A unified screen resizing utility that handles automatic scaling of the game canvas
 * based on the user's screen size. This combines functionality from both original
 * autoScreenResizer.js and autoScaler.js implementations.
 *
 * @author Andrew D Hwang
 * @edited by Peter - Merged duplicate implementations to resolve conflicts
 */
class AutoScreenResizer {
    /**
     * Creates a new instance of the AutoScreenResizer
     * @param {HTMLCanvasElement} canvas - The game canvas element to resize
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.originalWidth = canvas.width;
        this.originalHeight = canvas.height;

        // Ensure DOM is fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeResizer());
        } else {
            this.initializeResizer();
        }
    }

    /**
     * Initialize the screen resizing system
     */
    initializeResizer() {
        // Reset body and html styles for consistent behavior
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#000'; // Changed to pure black as requested

        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.id = 'game-container';

        // Create inner wrapper for precise scaling
        const innerWrapper = document.createElement('div');
        innerWrapper.style.position = 'relative';
        innerWrapper.style.display = 'flex';
        innerWrapper.style.justifyContent = 'center';
        innerWrapper.style.alignItems = 'center';
        innerWrapper.id = 'game-inner-wrapper';

        // Remove the focus outline from canvas
        this.canvas.style.outline = 'none';

        // Move canvas into inner wrapper
        this.canvas.parentNode.insertBefore(container, this.canvas);
        container.appendChild(innerWrapper);
        innerWrapper.appendChild(this.canvas);

        // Handle debug controls
        this.positionDebugControls();

        // Apply scaling
        this.applyScaling();

        // Resize listener
        window.addEventListener('resize', () => this.applyScaling());
    }

    /**
     * Positions debug controls and ensures they work correctly
     */
    positionDebugControls() {
        // Find existing debug checkbox
        const debugCheckbox = document.getElementById('debug');

        // Remove any existing debug containers
        const existingDebugContainers = document.querySelectorAll('[data-debug-container]');
        existingDebugContainers.forEach(el => el.remove());

        if (debugCheckbox) {
            // Create a new container for debug controls
            const controlsContainer = document.createElement('div');
            controlsContainer.style.position = 'fixed';
            controlsContainer.style.top = '10px';
            controlsContainer.style.left = '10px';
            controlsContainer.style.zIndex = '1000';
            controlsContainer.style.display = 'flex';
            controlsContainer.style.alignItems = 'center';
            controlsContainer.style.gap = '10px';
            controlsContainer.setAttribute('data-debug-container', 'true');

            // Recreate label for checkbox
            const label = document.createElement('label');
            label.setAttribute('for', 'debug');
            label.textContent = 'Debug 🛠️';
            label.style.color = '#fff'; // Make text visible
            label.style.cursor = 'pointer'; // Show it's clickable

            // Clear any existing text nodes or duplicates
            while (debugCheckbox.nextSibling) {
                debugCheckbox.parentNode.removeChild(debugCheckbox.nextSibling);
            }

            // Append elements
            controlsContainer.appendChild(debugCheckbox);
            controlsContainer.appendChild(label);

            // Add to body
            document.body.appendChild(controlsContainer);
        }
    }

    /**
     * Apply scaling to the canvas based on screen size
     */
    applyScaling() {
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

        // Apply scaling to canvas through the inner wrapper
        const innerWrapper = document.getElementById('game-inner-wrapper');
        if (innerWrapper) {
            innerWrapper.style.transform = `scale(${scaleFactor})`;
            innerWrapper.style.transformOrigin = 'center center';
        }

        console.log(`Screen Size: ${screenWidth}x${screenHeight}`);
        console.log(`Applied Scale: ${scaleFactor}`);
    }
}

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameWorld');
    new AutoScreenResizer(canvas);
});