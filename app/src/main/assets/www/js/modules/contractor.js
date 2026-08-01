// contractor.js - Upgrades & Shop Contractor
export class ShopContractor {
    constructor(manager, audio) {
        this.manager = manager;
        this.audio = audio;
    }

    buyUpgrade(statType) {
        const success = this.manager.upgradeStat(statType);
        if (success) {
            this.audio.playCoin();
        } else {
            this.audio.playHit();
        }
        return success;
    }
}
