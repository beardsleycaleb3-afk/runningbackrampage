// translator.js - Text & Localization Manager
export class Translator {
    constructor() {
        this.lang = 'en';
        this.dictionary = {
            en: {
                title: "GRIDIRON CAREER",
                startRun: "START DRIVE / RUN",
                teamManagement: "Team Management & Colors",
                shop: "⚡ Upgrades Shop",
                stats: "🏆 Career Stats",
                quarter: "Quarter",
                touchdown: "🏈 TOUCHDOWN!",
                tackled: "💥 TACKLED!"
            }
        };
    }

    t(key) {
        return this.dictionary[this.lang][key] || key;
    }
}
