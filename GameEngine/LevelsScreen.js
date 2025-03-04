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
        
        this.createInstructionButton();
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

    createInstructionsButton(x, y, level, clickHandler) {
        const button = document.createElement("img");
        button.src = "./sprites/instructions.png"; // Use same default image as other buttons
        button.alt = `Instructions`;
        button.style.position = "absolute";
        button.style.width = "225px"; // Match the size of other buttons
        button.style.height = "50px";
        button.style.cursor = "pointer";
        button.style.transition = "0.3s ease-in-out";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
    
        // Store the original image
        const originalSrc = button.src;
        
        // Add hover effects
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.1) rotate(0.1deg)";
            button.style.filter = "drop-shadow(0 0 7px black)";
        });
    
        button.addEventListener("mouseout", () => {
            // Restore original image and styling
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

    createInstructionButton() {
        this.createInstructionsButton(75, 135, 15, () => this.showInstructions());
    }

    showInstructions() {
        console.log("Showing instructions...");
        
        // Check if instructions panel already exists
        let instructionsPanel = document.getElementById("instructionsPanel");
        
        if (instructionsPanel) {
            // If it exists, just toggle its visibility
            if (instructionsPanel.style.display === "none") {
                instructionsPanel.style.display = "block";
            } else {
                instructionsPanel.style.display = "none";
            }
            return;
        }
        
        // Create a new instructions panel
        instructionsPanel = document.createElement("div");
        instructionsPanel.id = "instructionsPanel";
        instructionsPanel.style.position = "fixed";
        instructionsPanel.style.width = "500px";
        instructionsPanel.style.height = "400px";
        instructionsPanel.style.left = "50%";
        instructionsPanel.style.top = "50%";
        instructionsPanel.style.transform = "translate(-50%, -50%)";
        instructionsPanel.style.zIndex = "10";
        instructionsPanel.style.background = "transparent"; // Set background to transparent
        
        // Create the image element with the elevator instructions
        const instructionsImage = document.createElement("img");
        instructionsImage.src = "./sprites/instructionsUI.png"; // Path to your instruction image
        instructionsImage.style.width = "100%";
        instructionsImage.style.height = "100%";
        instructionsImage.style.objectFit = "contain";
        
        instructionsPanel.appendChild(instructionsImage);
        
        // Add close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "25px";
        closeButton.style.right = "30px";
        closeButton.style.background = "rgba(0, 0, 0, 0.7)";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "50%";
        closeButton.style.width = "20px";
        closeButton.style.height = "20px";
        closeButton.style.fontSize = "16px"; // Slightly smaller font size to fit better
        closeButton.style.lineHeight = "1";
        closeButton.style.paddingBottom = "2px"; // Adjust to center × vertically
        closeButton.style.cursor = "pointer";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.addEventListener("click", () => {
            instructionsPanel.style.display = "none";
        });
        
        instructionsPanel.appendChild(closeButton);
        
        // Add the panel to the body
        document.body.appendChild(instructionsPanel);
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

