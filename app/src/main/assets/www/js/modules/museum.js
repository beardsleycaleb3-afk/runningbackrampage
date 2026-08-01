export class MuseumView {
    constructor() {
        this.canvas = document.getElementById('museumCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.rotation = 0;
        }
    }
    
    render(state, chapter) {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Simple 3D rotating trophy effect
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        this.rotation += 0.02;
        
        this.ctx.save();
        this.ctx.translate(cx, cy);
        
        // Draw pedestal
        this.ctx.fillStyle = '#444';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 50, 60, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw Trophy based on Archetype
        this.ctx.rotate(Math.sin(this.rotation) * 0.2); // slight sway
        
        if (state.activeArchetype === 'FRIDGE') {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(-20, -30, 40, 80);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '16px sans-serif';
            this.ctx.fillText("POWER", -30, 0);
        } else if (state.activeArchetype === 'NEON') {
            this.ctx.fillStyle = '#00FFFF';
            this.ctx.beginPath();
            this.ctx.moveTo(0, -50);
            this.ctx.lineTo(20, 0);
            this.ctx.lineTo(-20, 0);
            this.ctx.fill();
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '16px sans-serif';
            this.ctx.fillText("SPEED", -25, 20);
        } else if (state.activeArchetype === 'CLOCKMASTER') {
            this.ctx.fillStyle = '#C0C0C0';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '14px sans-serif';
            this.ctx.fillText("CLUTCH", -25, 5);
        } else {
            // Rookie football trophy
            this.ctx.fillStyle = '#A0522D';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -10, 20, 35, Math.PI/2, 0, Math.PI*2);
            this.ctx.fill();
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '14px sans-serif';
            this.ctx.fillText("ROOKIE", -25, 40);
        }
        
        this.ctx.restore();
        
        requestAnimationFrame(() => {
            if (document.getElementById('screen-museum') && document.getElementById('screen-museum').classList.contains('active')) {
                this.render(state, chapter);
            }
        });
    }
}
