// accumulator.js - Stats, Score & Yardage Accumulator
export class StatsAccumulator {
    constructor() {
        this.sessionYards = 0;
        this.sessionCoins = 0;
        this.sessionTouchdowns = 0;
    }

    addYards(yards) {
        this.sessionYards += yards;
    }

    addCoins(coins) {
        this.sessionCoins += coins;
    }

    addTouchdown() {
        this.sessionTouchdowns += 1;
    }

    resetSession() {
        this.sessionYards = 0;
        this.sessionCoins = 0;
        this.sessionTouchdowns = 0;
    }
}
