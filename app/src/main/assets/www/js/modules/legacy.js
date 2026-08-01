export const ArchetypeRegistry = {
    "FRIDGE": {
        name: "The Fridge",
        condition: (state) => state.stiffArmLevel >= 3 && state.totalTouchdowns >= 5,
        buff: "Human Bulldozer",
        description: "Power runner. Swipe UP for a guaranteed truck move."
    },
    "NEON": {
        name: "The Neon",
        condition: (state) => state.speedLevel >= 3 && state.totalRushingYards >= 200,
        buff: "Blur",
        description: "Speedster. Leaves a blur trail."
    },
    "CLOCKMASTER": {
        name: "The Clockmaster",
        condition: (state) => state.agilityLevel >= 3 && state.staminaLevel >= 3,
        buff: "Slow-Motion",
        description: "Clutch player. Swipe DOWN to slow down time."
    }
};

export class LegacyProcessor {
    constructor(manager) {
        this.manager = manager;
    }

    evaluateArchetypes() {
        const state = this.manager.state;
        let newArchetype = null;
        for (let key in ArchetypeRegistry) {
            if (ArchetypeRegistry[key].condition(state) && !state.unlockedArchetypes.includes(key)) {
                state.unlockedArchetypes.push(key);
                if (!state.activeArchetype) state.activeArchetype = key;
                newArchetype = ArchetypeRegistry[key];
            }
        }
        return newArchetype;
    }

    evaluateChapter() {
        const state = this.manager.state;
        if (state.totalRushingYards > 2000) return "Chapter 4: The Twilight";
        if (state.totalRushingYards > 1000) return "Chapter 3: The Peak";
        if (state.totalRushingYards > 300) return "Chapter 2: The Breakout";
        return "Chapter 1: The Rookie Grind";
    }
    
    addLegacyPoints(points) {
        this.manager.state.legacyPoints += points;
        this.manager.save();
    }
}
