export class AnnouncerLogic {
    constructor() {
        this.vocabulary = {
            "ROOKIE": ["The rookie is finding his legs!", "Welcome to the big leagues!"],
            "FRIDGE": ["Here comes the Bulldozer!", "The Fridge is clearing the way!"],
            "NEON": ["He's a blur out there!", "Neon speed!"],
            "CLOCKMASTER": ["Ice in his veins!", "The Clockmaster strikes again!"],
            "TOUCHDOWN": ["TOUCHDOWN! UNBELIEVABLE RUN!", "HE GOES ALL THE WAY! TOUCHDOWN!"],
            "OBJECTIVE": ["He nailed the mini-goal! Bonus coins!", "Objective complete! Extra coins!"]
        };
        this.announcerEl = document.getElementById('announcer-text');
    }
    
    announce(archetype) {
        let lines = this.vocabulary[archetype || "ROOKIE"];
        if (!lines) lines = this.vocabulary["ROOKIE"];
        const line = lines[Math.floor(Math.random() * lines.length)];
        
        if (this.announcerEl) {
            this.announcerEl.innerText = line;
            this.announcerEl.style.opacity = 1;
            setTimeout(() => {
                this.announcerEl.style.opacity = 0;
            }, 2500);
        }
    }
}
