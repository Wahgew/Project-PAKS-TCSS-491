class LevelsScreen {
    constructor() {
        this.createLevelsScreen();
    }

    createLevelsScreen() {
        // Create container
        this.levelsContainer = document.createElement("div");
        this.levelsContainer.id = "levelsScreen";
        this.levelsContainer.style.position = "fixed";
        this.levelsContainer.style.width = "980px";
        this.levelsContainer.style.height = "743px";
        this.levelsContainer.style.left = "50%";
        this.levelsContainer.style.top = "50%";
        this.levelsContainer.style.transform = "translate(-50%, -50%)";
        this.levelsContainer.style.backgroundColor = "transparent";
        this.levelsContainer.style.backgroundImage = "url('./sprites/levelBackground.jpg')";
        this.levelsContainer.style.backgroundSize = "100%"; 
        this.levelsContainer.style.backgroundPosition = "center";
        this.levelsContainer.style.backgroundRepeat = "no-repeat";
        this.levelsContainer.style.display = "none"; 
        this.levelsContainer.style.zIndex = "3";

        // Manually create 10 level buttons
        this.createLevel1Button();
        this.createLevel2Button();
        this.createLevel3Button();
        this.createLevel4Button();
        this.createLevel5Button();
        this.createLevel6Button();
        this.createLevel7Button();
        this.createLevel8Button();
        this.createLevel9Button();
        this.createLevel10Button();
        this.createLevel11Button();
        this.createLevel12Button();
        this.createnextButton();
        this.createbackButton();
        // Append levels screen to body
        document.body.appendChild(this.levelsContainer);
    }

    show() {
        this.levelsContainer.style.display = "block";
    }

    hide() {
        this.levelsContainer.style.display = "none";
    }

    createButton(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/buttons.png"; // Replace with specific button images if needed
        button.alt = `Level ${level}`;
        button.style.position = "absolute";
        button.style.width = "16px"; // Adjust button size
        button.style.height = "16px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;

        // Add hover effects
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.1) rotate(5deg)";
            button.style.filter = "drop-shadow(0 0 7px black)";
        });

        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.filter = "none";
        });

        // Attach a unique event listener
        button.addEventListener("click", clickHandler);

        this.levelsContainer.appendChild(button);
    }

    // Individual methods for each button
    createLevel1Button() {
        this.createButton(115, 244, 1, () => this.goToLevel1());
    }

    createLevel2Button() {
        this.createButton(196, 244, 2, () => this.goToLevel2());
    }

    createLevel3Button() {
        this.createButton(279, 244, 3, () => this.goToLevel3());
    }

    createLevel4Button() {
        this.createButton(115, 298, 4, () => this.goToLevel4());
    }

    createLevel5Button() {
        this.createButton(196, 298, 5, () => this.goToLevel5());
    }

    createLevel6Button() {
        this.createButton(279, 298, 6, () => this.goToLevel6());
    }

    createLevel7Button() {
        this.createButton(117, 353, 7, () => this.goToLevel7());
    }

    createLevel8Button() {
        this.createButton(197, 353, 8, () => this.goToLevel8());
    }

    createLevel9Button() {
        this.createButton(280.5, 353, 9, () => this.goToLevel9());
    }

    createLevel10Button() {
        this.createButton(117, 409, 10, () => this.goToLevel10());
    }

    createLevel11Button() {
        this.createButton(197, 409, 11, () => this.goToLevel11());
    }

    createLevel12Button() {
        this.createButton(280.95, 409, 12, () => this.goToLevel12());
    }

    createnextButton() {
        this.createButton(153, 455, 13, () => {
            this.hide(); // Hide the levels screen
            const welcomeScreen = document.getElementById("welcomeScreen");
            if (welcomeScreen) {
                welcomeScreen.style.display = "flex"; // Show the welcome screen
            }
        });
    }

    createbackButton() {
        this.createButton(234, 454.5, 14, () => this.goTogame());
    }

    // Methods for handling level clicks
    goToLevel1() {
        console.log("Navigating to Level 1...");
        alert("Loading Level 1...");
    }

    goToLevel2() {
        console.log("Navigating to Level 2...");
        alert("Loading Level 2...");
    }

    goToLevel3() {
        console.log("Navigating to Level 3...");
        alert("Loading Level 3...");
    }

    goToLevel4() {
        console.log("Navigating to Level 4...");
        alert("Loading Level 4...");
    }

    goToLevel5() {
        console.log("Navigating to Level 5...");
        alert("Loading Level 5...");
    }

    goToLevel6() {
        console.log("Navigating to Level 6...");
        alert("Loading Level 6...");
    }

    goToLevel7() {
        console.log("Navigating to Level 7...");
        alert("Loading Level 7...");
    }

    goToLevel8() {
        console.log("Navigating to Level 8...");
        alert("Loading Level 8...");
    }

    goToLevel9() {
        console.log("Navigating to Level 9...");
        alert("Loading Level 9...");
    }

    goToLevel10() {
        console.log("Navigating to Level 10...");
        alert("Loading Level 10...");
    }

    goToLevel11() {
        console.log("Navigating to Level 11...");
        alert("Loading Level 11...");
    }

    goToLevel12() {
        console.log("Navigating to Level 12...");
        alert("Loading Level 12...");
    }

    goTogame() {
        console.log("Navigating to game...");
        alert("Loading game...");
    }
}



