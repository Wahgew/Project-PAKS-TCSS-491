// Global transition manager that handles all elevator door transitions
class ElevatorTransitionManager {
    constructor() {
        // Door animation constants
        this.animationDuration = 1000; // milliseconds
        this.dingDelay = 300; // milliseconds (delay after ding before doors move)

        // State tracking
        this.isTransitioning = false;
        this.callback = null;
        this.isInitialized = false;

        // Audio setup
        this.doorSound = new Audio('./sounds/elevator-ding.mp3');
        this.doorSound.volume = 0.3;
    }

    // Initialize assets and containers - called after ASSET_MANAGER is ready
    init() {
        console.log("Initializing ElevatorTransitionManager");

        // Check if ASSET_MANAGER exists and has transition assets
        if (!ASSET_MANAGER) {
            console.error("ASSET_MANAGER not available yet");
            return false;
        }

        try {
            // Load door assets from global ASSET_MANAGER
            this.elevatorLeft = ASSET_MANAGER.getAsset("./sprites/elevator_left.png");
            this.elevatorRight = ASSET_MANAGER.getAsset("./sprites/elevator_right.png");

            // Verify assets were loaded
            if (!this.elevatorLeft || !this.elevatorRight) {
                console.error("Door assets not loaded yet!");
                return false;
            }

            // Create the container for doors
            this.createTransitionContainer();
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error("Error initializing transition manager:", error);
            return false;
        }
    }

    createTransitionContainer() {
        // Remove any existing transition elements first
        const existingContainer = document.getElementById('elevatorTransitionContainer');
        if (existingContainer) {
            document.body.removeChild(existingContainer);
        }

        // Create main container that will be on top of everything
        this.container = document.createElement('div');
        this.container.id = 'elevatorTransitionContainer';
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.zIndex = '9999'; // Very high z-index
        this.container.style.pointerEvents = 'none'; // Let clicks pass through when not transitioning
        this.container.style.overflow = 'hidden'; // Ensure door images don't overflow

        // Make background transparent by default, we'll add a semi-transparent backdrop when active
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';

        // Background element for transition
        this.backdropElement = document.createElement('div');
        this.backdropElement.style.position = 'absolute';
        this.backdropElement.style.top = '0';
        this.backdropElement.style.left = '0';
        this.backdropElement.style.width = '100%';
        this.backdropElement.style.height = '100%';
        this.backdropElement.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
        this.backdropElement.style.transition = 'background-color 0.5s ease-in-out';
        this.backdropElement.style.zIndex = '9998';
        this.container.appendChild(this.backdropElement);

        // Left door canvas element
        this.leftDoorCanvas = document.createElement('canvas');
        this.leftDoorCanvas.width = 960; // Same as your door asset width
        this.leftDoorCanvas.height = 1080; // Same as your door asset height
        this.leftDoorCanvas.style.position = 'absolute';
        this.leftDoorCanvas.style.top = '0';
        this.leftDoorCanvas.style.left = '-960px'; // Start off-screen when not active
        this.leftDoorCanvas.style.transition = 'left 0.8s ease-in-out';
        this.leftDoorCanvas.style.zIndex = '10000';

        // Right door canvas element
        this.rightDoorCanvas = document.createElement('canvas');
        this.rightDoorCanvas.width = 960; // Same as your door asset width
        this.rightDoorCanvas.height = 1080; // Same as your door asset height
        this.rightDoorCanvas.style.position = 'absolute';
        this.rightDoorCanvas.style.top = '0';
        this.rightDoorCanvas.style.right = '-960px'; // Start off-screen when not active
        this.rightDoorCanvas.style.transition = 'right 0.8s ease-in-out';
        this.rightDoorCanvas.style.zIndex = '10000';

        // Draw door images on canvases
        this.drawDoors();

        // Add doors to container
        this.container.appendChild(this.leftDoorCanvas);
        this.container.appendChild(this.rightDoorCanvas);

        // Add container to body
        document.body.appendChild(this.container);

        console.log('Elevator transition container created with door assets');
    }

    // Draw the door images on their respective canvases
    drawDoors() {
        if (!this.elevatorLeft || !this.elevatorRight) {
            console.error('Door assets not loaded!');
            return;
        }

        // Draw left door
        const leftCtx = this.leftDoorCanvas.getContext('2d');
        leftCtx.clearRect(0, 0, this.leftDoorCanvas.width, this.leftDoorCanvas.height);
        leftCtx.drawImage(this.elevatorLeft, 0, 0);

        // Draw right door
        const rightCtx = this.rightDoorCanvas.getContext('2d');
        rightCtx.clearRect(0, 0, this.rightDoorCanvas.width, this.rightDoorCanvas.height);
        rightCtx.drawImage(this.elevatorRight, 0, 0);
    }

    // Transition function that handles both closing and opening
    transition(callback = null, skipOpening = false) {
        // Check if we need to initialize
        if (!this.isInitialized) {
            // Try to initialize
            const initSuccess = this.init();

            if (!initSuccess) {
                console.log('Transition assets not ready, using fallback transition');
                // Execute callback immediately with a simple fade effect
                if (callback) {
                    this.createSimpleFadeTransition(callback);
                }
                return;
            }
        }

        // Prevent multiple transitions
        if (this.isTransitioning) {
            console.log('Already transitioning, ignoring request');
            return;
        }

        this.isTransitioning = true;
        this.callback = callback;

        // Make sure the container is visible and active
        if (this.container) {
            this.container.style.pointerEvents = 'auto';
            // Make background visible for transition
            this.backdropElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        } else {
            console.error('Container still not available, using fallback transition');
            if (callback) {
                this.createSimpleFadeTransition(callback);
            }
            this.isTransitioning = false;
            return;
        }

        if (skipOpening) {
            // Skip closing/opening and just run the callback
            this.finishTransition();
            return;
        }

        console.log('Starting transition with close and open sequence');

        // First close the doors
        this.closeDoors().then(() => {
            console.log('Doors closed, running callback');
            // Execute the callback which should load the new content
            if (this.callback) {
                this.callback();
            }

            // Increased delay to ensure content has loaded
            setTimeout(() => {
                console.log('Preparing to open doors');
                // Then open the doors
                this.openDoors().then(() => {
                    console.log('Doors opened, finishing transition');
                    this.finishTransition();
                });
            }, 500); // Keep at 500ms for better visibility
        });
    }

    // Create a simple fade transition as fallback
    createSimpleFadeTransition(callback) {
        // Create a simple overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        overlay.style.transition = 'background-color 0.5s ease-in-out';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);

        // Play door sound if available
        try {
            const doorSound = new Audio('./sounds/elevator-ding.mp3');
            doorSound.volume = 0.3;
            doorSound.play().catch(e => console.log("Could not play door sound:", e));
        } catch (error) {
            console.log("Could not play sound:", error);
        }

        // Fade to black
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }, 100);

        // Execute callback after fade is complete
        setTimeout(() => {
            if (callback) callback();

            // Fade back in
            setTimeout(() => {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';

                // Remove overlay when done
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 600);
            }, 200);
        }, 700);
    }

    // Closes the elevator doors and returns a promise
    closeDoors() {
        return new Promise((resolve) => {
            console.log('Closing elevator doors...');

            // Play door ding sound
            this.doorSound.play().catch(e => console.log('Could not play door sound:', e));

            // Start door animation after the ding
            setTimeout(() => {
                this.leftDoorCanvas.style.left = '0';
                this.rightDoorCanvas.style.right = '0';

                // Resolve promise after animation completes
                setTimeout(resolve, this.animationDuration);
            }, this.dingDelay);
        });
    }

    // Opens the elevator doors and returns a promise
    openDoors() {
        return new Promise((resolve) => {
            console.log('Opening elevator doors...');

            // Play door ding sound
            this.doorSound.play().catch(e => console.log('Could not play door sound:', e));

            // Start door animation after the ding
            setTimeout(() => {
                this.leftDoorCanvas.style.left = '-960px';
                this.rightDoorCanvas.style.right = '-960px';

                // Resolve promise after animation completes
                setTimeout(resolve, this.animationDuration);
            }, this.dingDelay);
        });
    }

    // Completes the transition and resets the state
    finishTransition() {
        this.isTransitioning = false;
        this.callback = null;
        this.container.style.pointerEvents = 'none';
        // Fade out background
        this.backdropElement.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
        console.log('Transition complete');
    }
}

// Initialize the transition manager without immediately creating the elements
window.ELEVATOR_TRANSITION = new ElevatorTransitionManager();