class WelcomeScreen {
    constructor(startCallback) {
        this.startCallback = startCallback;
        this.createWelcomeScreen();
    }

    createWelcomeScreen() {
        this.welcomeContainer = document.createElement("div");
        this.welcomeContainer.style.position = "fixed";
        this.welcomeContainer.style.width = "100vw";
        this.welcomeContainer.style.height = "100vh";
        this.welcomeContainer.style.backgroundImage = "url('./sprites/BG.webp')";
        this.welcomeContainer.style.backgroundSize = "cover";
        this.welcomeContainer.style.backgroundPosition = "center";
        this.welcomeContainer.style.display = "flex";
        this.welcomeContainer.style.flexDirection = "column";
        this.welcomeContainer.style.alignItems = "center";
        this.welcomeContainer.style.justifyContent = "center";
        this.welcomeContainer.style.textAlign = "center";
        this.welcomeContainer.style.zIndex = "2";

        const playButton = document.createElement("button");
        playButton.textContent = "Play";
        playButton.style.fontSize = "1.5rem";
        playButton.style.padding = "10px 20px";
        playButton.style.border = "none";
        playButton.style.backgroundColor = "black";
        playButton.style.color = "white";
        playButton.style.cursor = "pointer";
        playButton.style.borderRadius = "10px";
        playButton.style.transition = "0.3s";

        playButton.addEventListener("mouseover", () => {
            playButton.style.backgroundColor = "white";
            playButton.style.color = "black";
        });

        playButton.addEventListener("mouseout", () => {
            playButton.style.backgroundColor = "black";
            playButton.style.color = "gray";
        });

        playButton.addEventListener("click", () => {
            this.hideWelcomeScreen();
            this.startCallback();
        });

        this.welcomeContainer.appendChild(playButton);
        document.body.appendChild(this.welcomeContainer);
    }

    hideWelcomeScreen() {
        this.welcomeContainer.style.display = "none";
    }
}