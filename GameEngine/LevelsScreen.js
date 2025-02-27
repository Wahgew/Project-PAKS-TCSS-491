class LevelsScreen {
    constructor() {
        this.createLevelsScreen();
    }

    createLevelsScreen() {
        // Create container
        this.levelsContainer = document.createElement("div");
        this.levelsContainer.id = "levelsScreen";
        this.levelsContainer.style.position = "fixed";
        this.levelsContainer.style.top = "0";
        this.levelsContainer.style.left = "0";
        this.levelsContainer.style.width = "100vw";
        this.levelsContainer.style.height = "100vh";
        this.levelsContainer.style.backgroundImage = "url('./sprites/levelBackground.jpg')";
        // Adjust background-size to make it a bit smaller:
        this.levelsContainer.style.backgroundSize = "80%";
        this.levelsContainer.style.backgroundPosition = "center";
        this.levelsContainer.style.backgroundRepeat = "no-repeat";
        this.levelsContainer.style.display = "none";
        this.levelsContainer.style.zIndex = "3";

        // Create back button
        const backButton = document.createElement("button");
        backButton.textContent = "Back";
        backButton.style.position = "absolute";
        backButton.style.top = "20px";
        backButton.style.left = "20px";
        backButton.style.padding = "10px 20px";
        backButton.style.fontSize = "16px";
        
        backButton.addEventListener("click", () => {
            this.hide();
            const welcomeScreen = document.getElementById("welcomeScreen");
            if (welcomeScreen) {
                welcomeScreen.style.display = "flex";
            }
        });

        this.levelsContainer.appendChild(backButton);
        document.body.appendChild(this.levelsContainer);
    }

    show() {
        this.levelsContainer.style.display = "block";
    }

    hide() {
        this.levelsContainer.style.display = "none";
    }
}
