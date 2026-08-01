// orchestrator.js - Scene & Screen Manager
export class ScreenOrchestrator {
    constructor() {
        this.currentScreen = 'menu';
        this.screens = ['menu', 'team', 'game', 'shop', 'stats', 'museum'];
    }

    setScreen(screenName) {
        if (this.screens.includes(screenName)) {
            this.currentScreen = screenName;
            document.querySelectorAll('.screen').forEach(el => {
                el.classList.remove('active');
            });
            const target = document.getElementById(`screen-${screenName}`);
            if (target) {
                target.classList.add('active');
            }
        }
    }
}
