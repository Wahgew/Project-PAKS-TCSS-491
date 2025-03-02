/**
 * Creates and manages an elevator-style volume control panel for the game
 */
class VolumeControl {
    constructor() {
        this.container = null;
        this.slider = null;
        this.muteButton = null;
        this.isVisible = false;

        // Delay initialization until DOM is fully loaded
        if (document.readyState === 'complete') {
            this.createVolumeControl();
        } else {
            window.addEventListener('load', () => this.createVolumeControl());
        }
    }

    createVolumeControl() {
        console.log("Creating volume control panel");

        // Create the main container with elevator panel styling
        this.container = document.createElement('div');
        this.container.id = 'volumeControlPanel';

        // Add panel title
        const title = document.createElement('div');
        title.textContent = 'VOLUME';
        title.style.color = '#ffcc00';
        title.style.fontFamily = 'monospace';
        title.style.fontSize = '12px';
        title.style.marginBottom = '5px';
        title.style.fontWeight = 'bold';

        // Create LED indicator
        const ledIndicator = document.createElement('div');
        ledIndicator.style.width = '8px';
        ledIndicator.style.height = '8px';
        ledIndicator.style.borderRadius = '50%';
        ledIndicator.style.backgroundColor = '#3f3';
        ledIndicator.style.marginBottom = '10px';
        ledIndicator.style.boxShadow = '0 0 5px #3f3';

        const sliderElements = this.createVerticalSlider();
        this.slider = sliderElements.slider;

        // // Add the CSS class instead of inline styles for the slider
        // this.slider.className = 'elevator-volume-slider';

        // Create the mute button with speaker icon
        this.muteButton = document.createElement('button');
        this.muteButton.innerHTML = '🔊';
        this.muteButton.style.backgroundColor = '#555';
        this.muteButton.style.border = 'none';
        this.muteButton.style.borderRadius = '5px';
        this.muteButton.style.color = '#fff';
        this.muteButton.style.padding = '5px 8px';
        this.muteButton.style.cursor = 'pointer';
        this.muteButton.style.fontSize = '14px';

        // Create elevator floor indicators (decorative)
        const floorIndicators = document.createElement('div');
        floorIndicators.style.display = 'flex';
        floorIndicators.style.flexDirection = 'column';
        floorIndicators.style.alignItems = 'center';
        floorIndicators.style.marginTop = '5px';

        // Add event listeners
        this.slider.addEventListener('input', () => {
            if (window.AUDIO_MANAGER) {
                window.AUDIO_MANAGER.setVolume(parseFloat(this.slider.value));

                // Update mute button icon based on volume
                this.updateMuteButtonIcon();
            }
        });

        this.muteButton.addEventListener('click', () => {
            if (window.AUDIO_MANAGER) {
                const isMuted = window.AUDIO_MANAGER.toggleMute();
                this.muteButton.innerHTML = isMuted ? '🔇' : '🔊';

                // Change LED color when muted
                ledIndicator.style.backgroundColor = isMuted ? '#f33' : '#3f3';
                ledIndicator.style.boxShadow = isMuted ? '0 0 5px #f33' : '0 0 5px #3f3';
            }
        });

        // Assemble the control panel
        this.container.appendChild(title);
        this.container.appendChild(ledIndicator);
        this.container.appendChild(sliderElements.container); // Add the container instead of the slider directly
        this.container.appendChild(this.muteButton);
        this.container.appendChild(floorIndicators);

        // Add to document but hide initially
        document.body.appendChild(this.container);
        console.log("Volume control panel created, hiding initially");
        this.hide();
    }

    createVerticalSlider() {
        // Create a container for the slider to help with orientation
        const sliderContainer = document.createElement('div');
        sliderContainer.style.width = '30px';
        sliderContainer.style.height = '100px';
        sliderContainer.style.display = 'flex';
        sliderContainer.style.justifyContent = 'center';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.position = 'relative';
        sliderContainer.style.margin = '10px 0';

        // Create standard horizontal range input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = window.AUDIO_MANAGER ? window.AUDIO_MANAGER.volume : '0.5';

        // Style the slider for rotation
        slider.style.width = '100px';
        slider.style.height = '20px';
        slider.style.margin = '0';
        slider.style.transform = 'rotate(-90deg)'; // Rotate it to make it vertical
        slider.style.cursor = 'pointer';
        slider.style.appearance = 'none'; // Standard property

        // Add custom styling
        slider.style.background = '#333';
        slider.style.borderRadius = '4px';
        slider.style.outline = 'none';

        // Add the class for additional CSS styling
        slider.className = 'elevator-volume-slider';

        // Add the slider to its container
        sliderContainer.appendChild(slider);

        // Return both the container and the slider input
        return { container: sliderContainer, slider: slider };
    }

    updateMuteButtonIcon() {
        const volume = parseFloat(this.slider.value);
        if (volume === 0) {
            this.muteButton.innerHTML = '🔇';
        } else if (volume < 0.5) {
            this.muteButton.innerHTML = '🔉';
        } else {
            this.muteButton.innerHTML = '🔊';
        }
    }

    show() {
        console.log("Showing volume control panel");
        if (this.container) {
            this.container.style.display = 'flex';
            this.isVisible = true;
        } else {
            console.error("Volume control container is null");
        }
    }

    hide() {
        console.log("Hiding volume control panel");
        if (this.container) {
            this.container.style.display = 'none';
            this.isVisible = false;
        } else {
            console.error("Volume control container is null");
        }
    }

    toggle() {
        console.log("Toggling volume control panel, current state:", this.isVisible);
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        return this.isVisible;
    }
}

// Wait until DOM is fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating VOLUME_CONTROL");
    window.VOLUME_CONTROL = new VolumeControl();
});