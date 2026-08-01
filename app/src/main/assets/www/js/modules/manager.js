// manager.js - Game State & Team Customization Manager
export class GameManager {
    constructor() {
        this.state = {
            teamName: "Gridiron Blitz",
            primaryColor: "#1B5E20",
            secondaryColor: "#FFD700",
            logoSymbol: "🛡️",
            currentQuarter: 1,
            score: 0,
            coins: 200,
            yardsGained: 0,
            targetYards: 100,
            speedLevel: 1,
            stiffArmLevel: 1,
            agilityLevel: 1,
            staminaLevel: 1,
            totalTouchdowns: 0,
            totalRushingYards: 0,
            legacyPoints: 0,
            reputation: 50,
            unlockedArchetypes: [],
            activeArchetype: null,
            activePlaybook: 'BALANCED_DIVE',
            clutchFactor: 0,
            xp: 0,
            level: 1,
            unlockedBadges: [],
            hapticEnabled: true,
            careerGamesPlayed: 0,
            lockerRoomMorale: 100
        };
        this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem('gridiron_career_state');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
                if (this.state.hapticEnabled === undefined) {
                    this.state.hapticEnabled = true;
                }
                if (this.state.careerGamesPlayed === undefined) {
                    this.state.careerGamesPlayed = 0;
                }
                if (this.state.lockerRoomMorale === undefined) {
                    this.state.lockerRoomMorale = 100;
                }
            }
        } catch (e) {
            console.error('Failed to load state', e);
        }
    }

    save() {
        try {
            localStorage.setItem('gridiron_career_state', JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save state', e);
        }
    }

    updateTeam(customization) {
        this.state = { ...this.state, ...customization };
        this.save();
    }

    addCoins(amount) {
        this.state.coins += amount;
        this.save();
    }

    spendCoins(amount) {
        if (this.state.coins >= amount) {
            this.state.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    upgradeStat(stat) {
        const cost = this.state[stat + 'Level'] * 50;
        if (this.spendCoins(cost)) {
            this.state[stat + 'Level'] += 1;
            this.save();
            return true;
        }
        return false;
    }

    recordDrive(yards, touchdown, isRival) {
        this.state.yardsGained += yards;
        this.state.totalRushingYards += yards;
        if (touchdown) {
            this.state.totalTouchdowns += 1;
            this.state.score += 7;
            this.state.currentQuarter = this.state.currentQuarter < 4 ? this.state.currentQuarter + 1 : 1;
            this.state.yardsGained = 0;
        } else {
            this.state.score += 3;
        }
        
        let xpGained = touchdown ? 150 : Math.floor(yards);
        let bonusXp = 0;
        if (isRival && touchdown) {
            bonusXp = 50;
            xpGained += bonusXp;
        }
        const result = this.addXp(xpGained);
        result.bonusXp = bonusXp;
        return result;
    }

    addXp(amount) {
        if (!this.state.xp) this.state.xp = 0;
        if (!this.state.level) this.state.level = 1;
        if (!this.state.unlockedBadges) this.state.unlockedBadges = [];

        this.state.xp += amount;
        let nextLevelXp = this.state.level * 200;
        let leveledUp = false;
        let latestBadge = "";

        while (this.state.xp >= nextLevelXp) {
            this.state.xp -= nextLevelXp;
            this.state.level += 1;
            leveledUp = true;
            latestBadge = this.unlockBadgeForLevel(this.state.level);
            nextLevelXp = this.state.level * 200;
        }
        this.save();
        return { leveledUp, badge: latestBadge, xpGained: amount };
    }

    unlockBadgeForLevel(level) {
        const badgeList = ['Rookie Runner', 'Varsity Star', 'All-American', 'Pro Prospect', 'Gridiron Legend', 'Hall of Famer', 'GOAT'];
        const badgeName = badgeList[Math.min(level - 1, badgeList.length - 1)];
        if (!this.state.unlockedBadges.includes(badgeName)) {
            this.state.unlockedBadges.push(badgeName);
        }
        return badgeName;
    }
}
