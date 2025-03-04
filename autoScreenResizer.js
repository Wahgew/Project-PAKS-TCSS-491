class AutoScreenResizer {
    constructor(canvas) {
        this.canvas = canvas;

        // Ensure DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeResizer());
        } else {
            this.initializeResizer();
        }
    }

    initializeResizer() {
        // Reset body and html styles
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#333';

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

    positionDebugControls() {
        // Find existing debug elements
        const debugCheckbox = document.getElementById('debug');
        const resetTimesButton = document.getElementById('resetTimes');

        // Remove any existing debug containers
        const existingDebugContainers = document.querySelectorAll('[data-debug-container]');
        existingDebugContainers.forEach(el => el.remove());

        if (debugCheckbox && resetTimesButton) {
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

            // Clear any existing text nodes or duplicates
            while (debugCheckbox.nextSibling) {
                debugCheckbox.parentNode.removeChild(debugCheckbox.nextSibling);
            }

            // Append elements
            controlsContainer.appendChild(debugCheckbox);
            controlsContainer.appendChild(label);
            controlsContainer.appendChild(resetTimesButton);

            // Add to body
            document.body.appendChild(controlsContainer);
        }
    }

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

        // Apply scaling to canvas
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