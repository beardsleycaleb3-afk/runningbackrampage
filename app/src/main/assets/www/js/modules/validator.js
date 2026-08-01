// validator.js - Input & Collision Validator
export class InputValidator {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
    }

    validateSwipe(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
            return diffX > 0 ? 'RIGHT' : 'LEFT';
        }
        return null;
    }

    checkCollision(playerLane, playerY, obstacleLane, obstacleY) {
        return playerLane === obstacleLane && Math.abs(playerY - obstacleY) < 0.08;
    }
}
