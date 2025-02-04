class testMap {
        constructor(testSize) {
                this.testSize = testSize;
                this.block = ASSET_MANAGER.getAsset("./sprites/block.png");
                console.log("TestMap initialized with size:", testSize);
        }

        map = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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

        update() {
        }

        //checkCollisions method
        checkCollisions(entity) {
                if (!entity || !entity.BB) {
                        console.error("Invalid entity passed to checkCollisions");
                        return { collides: false };
                }

                // Get the tiles the entity could be colliding with
                const tileStartX = Math.floor(entity.x / this.testSize);
                const tileEndX = Math.floor((entity.x + entity.width) / this.testSize);
                const tileStartY = Math.floor(entity.y / this.testSize);
                const tileEndY = Math.floor((entity.y + entity.height) / this.testSize);

                // Add bounds checking
                // const maxY = this.map.length;
                // const maxX = this.map[0].length;

                if (entity.x + entity.width > this.map[0].length * this.testSize) {
                        return {
                                collides: true,
                                tileX: this.map[0].length * this.testSize,
                                tileY: entity.y
                        };
                }

                // Regular tile collision checking
                for (let i = tileStartY; i <= tileEndY; i++) {
                        for (let j = tileStartX; j <= tileEndX; j++) {
                                if (this.map[i] && this.map[i][j] === 1) {
                                        const tileBB = new BoundingBox(
                                            j * this.testSize,
                                            i * this.testSize,
                                            this.testSize,
                                            this.testSize
                                        );

                                        if (entity.BB.collide(tileBB)) {
                                                return {
                                                        collides: true,
                                                        tileX: j * this.testSize,
                                                        tileY: i * this.testSize
                                                };
                                        }
                                }
                        }
                }

                return { collides: false };
        }

        draw(ctx) {
                if (!ctx || !ctx.drawImage) {
                        console.error("Invalid context passed to testMap.draw:", ctx);
                        return;
                }

                this.#setCanvasSize(ctx.canvas);
                this.#clearCanvas(ctx);
                this.#drawMap(ctx);
        }

        #drawMap(ctx) {
                if (!ctx) {
                        console.error("No context provided to drawMap");
                        return;
                }

                // Only draw the tiles that are visible
                for (let i = 0; i < this.map.length; i++) {
                        for (let j = 0; j < this.map[i].length; j++) {
                                if (this.map[i][j] === 1) {  // If it's a solid tile
                                        const x = j * this.testSize;
                                        const y = i * this.testSize;

                                        try {
                                                ctx.drawImage(
                                                    this.block,
                                                    x,
                                                    y,
                                                    this.testSize,
                                                    this.testSize
                                                );

                                                // Draw collision boxes if debugging is enabled
                                                if (this.game && this.game.options && this.game.options.debugging) {
                                                        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                                                        ctx.strokeRect(x, y, this.testSize, this.testSize);
                                                }
                                        } catch (e) {
                                                console.error("Error drawing tile at", x, y, e);
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