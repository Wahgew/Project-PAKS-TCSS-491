class Transition {
    constructor(gameEngine, open) {
        this.game = gameEngine;
        if (open) { // check if these numbers are correct
            this.elevatorLx = -960;
            this.elevatorRx = 1920;
        } else {
            this.elevatorLx = 0;
            this.elevatorRx = 960;
        }
        this.elevatorLeft = ASSET_MANAGER.getAsset("./sprites/elevator_left.png");
        this.elevatorRight = ASSET_MANAGER.getAsset("./sprites/elevator_right.png");
        this.state = 0; // 0 = stopped, 1 = opening, 2 = closing 3 = invisible.;
        this.velocity = 50;
    }
    update() {
        if (this.state == 1) { // opening
            if (this.elevatorLx <= -960 || this.elevatorRx >= 1920) {
                this.state = 3;
            }
            this.elevatorLx += this.game.clockTick * this.velocity;
            this.elevatorRx -= this.game.clockTick * this.velocity;
        } else if (this.state == 2) { // closing
            if (this.elevatorLx >= 0 || this.elevatorRx <= 960) {
                this.state = 3;
            }
            this.elevatorLx -= this.game.clockTick * this.velocity;
            this.elevatorRx += this.game.clockTick * this.velocity;
        }
    }
    draw(ctx) {
        if (this.state != 3) {
            ctx.drawImage(this.elevatorLeft, this.elevatorLx, 0);
            ctx.drawImage(this.elevatorRight, this.elevatorRx, 0);
        }
    }
    openDoor() {
        this.state = 1;
    }
    closeDoor() {
        this.state = 2;
    }
}