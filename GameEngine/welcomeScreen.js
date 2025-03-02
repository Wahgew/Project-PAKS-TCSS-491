class WelcomeScreen {
    constructor(startCallback, levelsCallback, aboutCallback) {
        this.startCallback = startCallback;
        this.levelsCallback = levelsCallback;
        this.aboutCallback = aboutCallback;
        this.createWelcomeScreen();

        // Start playing menu music if audio manager exists
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.playMenuMusic();
        }
    }

    createWelcomeScreen() {
        // Create container
        this.welcomeContainer = document.createElement("div");
        this.welcomeContainer.id = "welcomeScreen";
        this.welcomeContainer.style.position = "fixed";
        // Set container dimensions to the image's natural size:
        this.welcomeContainer.style.width = "980px";
        this.welcomeContainer.style.height = "743px";
        // Center the container in the viewport:
        this.welcomeContainer.style.left = "50%";
        this.welcomeContainer.style.top = "50%";
        this.welcomeContainer.style.transform = "translate(-50%, -50%)";
        this.welcomeContainer.style.backgroundColor = "transparent";
        this.welcomeContainer.style.backgroundImage = "url('./sprites/BG.webp')";
        // Zoom in the background image slightly while preserving its aspect ratio:
        this.welcomeContainer.style.backgroundSize = "100%";
        this.welcomeContainer.style.backgroundPosition = "center";
        this.welcomeContainer.style.backgroundRepeat = "no-repeat";
        this.welcomeContainer.style.display = "flex";
        this.welcomeContainer.style.flexDirection = "column";
        this.welcomeContainer.style.alignItems = "center";
        this.welcomeContainer.style.justifyContent = "center";
        this.welcomeContainer.style.textAlign = "center";
        this.welcomeContainer.style.zIndex = "2";

        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "row";
        buttonContainer.style.gap = "20px";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.alignItems = "center";

        // Define buttons
        const buttons = [
            { src: "./sprites/start.png", callback: this.startCallback, width: "150px" },
            { src: "./sprites/aboutme.png", callback: this.aboutCallback, width: "120px" },
            { src: "./sprites/levels.png", callback: this.levelsCallback, width: "150px" }
        ];

        // Create buttons
        buttons.forEach(button => {
            const buttonImg = document.createElement("img");
            buttonImg.src = button.src;
            buttonImg.style.width = button.width;
            buttonImg.style.cursor = "pointer";
            buttonImg.style.transition = "0.3s ease-in-out";

            // Add hover effects
            buttonImg.addEventListener("mouseover", () => {
                buttonImg.style.transform = "scale(1.1) rotate(5deg)";
                buttonImg.style.filter = "drop-shadow(0 0 15px gray)";
            });
            buttonImg.addEventListener("mouseout", () => {
                buttonImg.style.transform = "scale(1)";
                buttonImg.style.filter = "none";
            });

            // About Me button uses the overlay; other buttons hide the welcome screen.
            if (button.src.includes("aboutme")) {
                buttonImg.addEventListener("click", () => {
                    this.showAboutOverlay();
                });
            } else {
                buttonImg.addEventListener("click", () => {
                    this.hideWelcomeScreen();
                    button.callback();
                });
            }

            buttonContainer.appendChild(buttonImg);
        });

        this.welcomeContainer.appendChild(buttonContainer);
        document.body.appendChild(this.welcomeContainer);
    }

    createAboutContent() {
        return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <img src="./sprites/AboutUsNewSmall.gif" alt="Profile" style="width: 300px; border-radius: 8px; margin-bottom: 20px;">
                
                <p style="margin: 0; line-height: 1.6;">
                    Hello, Welcome to P.A.K.S
                </p>

            </div>
        `;
    }

    showAboutOverlay() {
        // Create backdrop to cover the welcome screen.
        const backdrop = document.createElement("div");
        backdrop.style.position = "fixed";
        backdrop.style.top = "0";
        backdrop.style.left = "0";
        backdrop.style.width = "100%";
        backdrop.style.height = "100%";
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        backdrop.style.zIndex = "1000";

        // Create and style the overlay container.
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.width = "600px";
        overlay.style.maxHeight = "80vh";
        overlay.style.backgroundColor = "rgba(40, 40, 40, 0.95)";
        overlay.style.color = "white";
        overlay.style.borderRadius = "8px";
        overlay.style.zIndex = "1001";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";

        // Create header.
        const header = document.createElement("div");
        header.style.padding = "20px";
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";

        // Add title.
        const title = document.createElement("h2");
        title.textContent = "About Me";
        title.style.margin = "0";
        title.style.fontSize = "32px";
        title.style.fontFamily = "Molot, sans-serif";
        title.style.fontWeight = "normal"; 
        header.appendChild(title);

        // Add close button.
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "×";
        closeButton.style.fontSize = "32px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "white";
        closeButton.style.opacity = "0.8";
        closeButton.style.transition = "opacity 0.2s";
        closeButton.style.userSelect = "none";
        closeButton.addEventListener("mouseover", () => closeButton.style.opacity = "1");
        closeButton.addEventListener("mouseout", () => closeButton.style.opacity = "0.8");
        closeButton.addEventListener("click", () => {
            overlay.remove();
            backdrop.remove();
            // Remove the blur effect from the welcome screen.
            this.welcomeContainer.style.filter = "none";
        });
        header.appendChild(closeButton);
        overlay.appendChild(header);

        // Create content container with scrollbar.
        const content = document.createElement("div");
        content.style.padding = "20px";
        content.style.overflowY = "auto";
        content.style.maxHeight = "calc(80vh - 81px)"; // Account for header height.
        // Set an ID to allow for custom scrollbar styling.
        content.id = "aboutContent";
        content.innerHTML = this.createAboutContent();
        overlay.appendChild(content);

        // Add scrollbar styles.
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            #aboutContent::-webkit-scrollbar {
                width: 8px;
            }
            #aboutContent::-webkit-scrollbar-track {
                background: #333;
                border-radius: 4px;
            }
            #aboutContent::-webkit-scrollbar-thumb {
                background: #666;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(styleSheet);

        // Append backdrop and overlay to the document.
        document.body.appendChild(backdrop);
        document.body.appendChild(overlay);

        // Apply a blur effect to the welcome screen.
        this.welcomeContainer.style.filter = "blur(3px)";
    }

    hideWelcomeScreen() {
        this.welcomeContainer.style.display = "none";
    }

    showWelcomeScreen() {
        this.welcomeContainer.style.display = "flex";

        // Ensure we're playing menu music when returning to welcome screen
        if (window.AUDIO_MANAGER) {
            window.AUDIO_MANAGER.stopGameMusic();
            window.AUDIO_MANAGER.playMenuMusic();
        }
    }
}
