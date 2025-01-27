class testMap {

        constructor(testSize) {
                this.testSize = testSize;
                this.gameEngine = gameEngine;
                this.block = ASSET_MANAGER.getAsset("./sprites/block.png");
                console.log("TestMap initialized with size:", testSize);
                console.log("Block sprite loaded:", this.block);

                this.spawnEntities();
        }

        // 1 - wall
        // 0 - empty space
        // 2 - player
        map = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
                [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]

        spawnEntities() {
                for (let row = 0; row < this.map.length; row++) {
                        for (let col = 0; col < this.map[row].length; col++) {
                                const tile = this.map[row][col];
                                const x = col * this.testSize;
                                const y = row * this.testSize;

                                switch(tile) {
                                        // case 2: // Player
                                        //         const playerHeight = 120;
                                        //         const spawnY = y - (playerHeight - this.testSize);
                                        //         this.gameEngine.addEntity(new Player(this.gameEngine, x, spawnY));
                                        //         this.map[row][col] = 0; // Convert to air
                                        //         break;

                                        case 3: // Exit Door
                                                this.gameEngine.addEntity(new exitDoor(this.gameEngine, x, y, this.testSize));
                                                this.map[row][col] = 0; // Convert to air
                                                break;
                                }
                        }
                }
        }

        update() {

        }

        draw(ctx) {
                if (!ctx || !ctx.drawImage) {
                        console.error("Invalid context passed to testMap.draw:", ctx);
                        return;
                }

                console.log("Drawing map");
                this.#setCanvasSize(ctx.canvas);
                this.#clearCanvas(ctx);
                this.#drawMap(ctx);
        }

        #drawMap(ctx) {
                if (!ctx) return;
                console.log("Drawing map tiles");

                for (let i = 0; i < this.map.length; i++) {
                        for (let j = 0; j < this.map[i].length; j++) {
                                if (this.map[i][j] === 1 && this.block) {
                                        try {
                                                ctx.drawImage(
                                                    this.block,
                                                    j * this.testSize,
                                                    i * this.testSize,
                                                    this.testSize,
                                                    this.testSize
                                                );
                                        } catch (e) {
                                                console.error("Error drawing tile at", i, j, ":", e);
                                        }
                                }
                        }
                }
        }

        #clearCanvas(ctx) {
                if (!ctx) return;

                try {
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                } catch (e) {
                        console.error("Error in clearCanvas:", e);
                }
        }

        #setCanvasSize(canvas) {
                if (!canvas) return;
                canvas.height = this.map.length * this.testSize;
                canvas.width = this.map[0].length * this.testSize;
        }
}

if (typeof module !== 'undefined' && module.exports) {
        module.exports = testMap;
}