export class GestureEngine {
    constructor(canvas, onSwipe) {
        this.canvas = canvas;
        this.onSwipe = onSwipe;
        this.touchX = 0;
        this.touchY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchX = e.touches[0].clientX;
            this.touchY = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = endX - this.touchX;
            const diffY = endY - this.touchY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 30) {
                    if (this.onSwipe) this.onSwipe(diffX > 0 ? 'RIGHT' : 'LEFT');
                }
            } else {
                if (Math.abs(diffY) > 30) {
                    if (this.onSwipe) this.onSwipe(diffY > 0 ? 'DOWN' : 'UP');
                }
            }
        });
    }
}
