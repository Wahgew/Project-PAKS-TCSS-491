class WelcomeScreen {
    constructor(startCallback, levelsCallback, aboutCallback) {
        this.startCallback = startCallback;
        this.levelsCallback = levelsCallback;
        this.aboutCallback = aboutCallback;
        this.createWelcomeScreen();
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

        // Create title
        const title = document.createElement("h1");
        title.style.color = "black";
        title.style.fontSize = "48px";
        title.style.marginBottom = "40px";
        title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";

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

            // Add click handler
            buttonImg.addEventListener("click", () => {
                this.hideWelcomeScreen();
                button.callback();
            });

            buttonContainer.appendChild(buttonImg);
        });

        this.welcomeContainer.appendChild(title);
        this.welcomeContainer.appendChild(buttonContainer);
        document.body.appendChild(this.welcomeContainer);
    }

    hideWelcomeScreen() {
        this.welcomeContainer.style.display = "none";
    }

    showWelcomeScreen() {
        this.welcomeContainer.style.display = "flex";
    }
}
