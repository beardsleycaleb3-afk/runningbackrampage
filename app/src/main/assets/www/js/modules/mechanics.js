// mechanics.js - 3D Runner Physics & Defender AI Mechanics
export class GameMechanics {
    constructor() {
        this.lane = 1; // 0: left, 1: center, 2: right
        this.yPos = 0; // 0 to 100 yards
        this.obstacles = [];
        this.speed = 0.8;
        this.trucking = false;
        this.truckTimer = 0;
        this.slowMo = false;
        this.slowTimer = 0;
    }

    reset() {
        this.lane = 1;
        this.yPos = 0;
        this.obstacles = [];
        this.trucking = false;
        this.slowMo = false;
        this.speed = 0.8;
    }

    moveLeft() {
        if (this.lane > 0) this.lane--;
    }

    moveRight() {
        if (this.lane < 2) this.lane++;
    }
    
    activateTruck() {
        this.trucking = true;
        this.truckTimer = 1.0; // 1 second of trucking
    }
    
    activateSlowMo() {
        this.slowMo = true;
        this.slowTimer = 2.0; // 2 seconds of slow mo
    }

    update(dt) {
        if (this.truckTimer > 0) {
            this.truckTimer -= dt;
            if (this.truckTimer <= 0) this.trucking = false;
        }
        
        let currentSpeed = this.speed;
        if (this.slowTimer > 0) {
            this.slowTimer -= dt;
            currentSpeed *= 0.5;
            if (this.slowTimer <= 0) this.slowMo = false;
        }

        this.yPos += currentSpeed * dt * 10;
        this.obstacles.forEach(obs => {
            obs.y += (0.5 * (this.slowMo ? 0.5 : 1.0)) * dt;
        });
        this.obstacles = this.obstacles.filter(obs => obs.y < 1.2);
    }
}
