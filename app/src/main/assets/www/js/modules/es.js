// es.js - Main ES Module Binder & App Initialization
import { GameManager } from './manager.js';
import { GameClock } from './clock.js';
import { ScreenOrchestrator } from './orchestrator.js';
import { StatsAccumulator } from './accumulator.js';
import { AudioManager } from './audio.js';
import { Translator } from './translator.js';
import { Communicator } from './communicator.js';
import { ShopContractor } from './contractor.js';
import { InputValidator } from './validator.js';
import { AssetBuffer } from './buffer.js';
import { GameMechanics } from './mechanics.js';
import { LegacyProcessor, ArchetypeRegistry } from './legacy.js';
import { MuseumView } from './museum.js';
import { GestureEngine } from './gesture.js';
import { AnnouncerLogic } from './announcer.js';

window.addEventListener('DOMContentLoaded', () => {
    const manager = new GameManager();
    const orchestrator = new ScreenOrchestrator();
    const accumulator = new StatsAccumulator();
    const audio = new AudioManager();
    const translator = new Translator();
    const communicator = new Communicator();
    const contractor = new ShopContractor(manager, audio);
    const validator = new InputValidator();
    const buffer = new AssetBuffer();
    const mechanics = new GameMechanics();
    
    const legacy = new LegacyProcessor(manager);
    const museum = new MuseumView();
    const announcer = new AnnouncerLogic();

    // Touch audio unlock
    window.addEventListener('touchstart', () => audio.init(), { once: true });
    window.addEventListener('click', () => audio.init(), { once: true });

    // UI Binding & Navigation
    window.navigateTo = (screen) => {
        audio.playSwipe();
        orchestrator.setScreen(screen);
        if (screen === 'menu') updateUI();
        if (screen === 'shop') updateShopUI();
        if (screen === 'stats') updateStatsUI();
        if (screen === 'team') updateTeamUI();
        if (screen === 'leaderboard') updateLeaderboardUI();
        if (screen === 'settings') {
            document.getElementById('toggle-haptics-btn').innerText = manager.state.hapticEnabled ? "ON" : "OFF";
            document.getElementById('toggle-haptics-btn').style.background = manager.state.hapticEnabled ? "#1B5E20" : "#555";
        }
        if (screen === 'playbook') {
            document.querySelectorAll('#screen-playbook .card').forEach(el => el.style.border = '2px solid transparent');
            const scheme = manager.state.activePlaybook || 'BALANCED_DIVE';
            const el = document.getElementById('play-card-' + scheme);
            if(el) el.style.border = '2px solid #FFD700';
        }
        if (screen === 'museum') {
            updateMuseumUI();
            museum.render(manager.state, legacy.evaluateChapter());
        }
    };

    function updateLeaderboardUI() {
        const container = document.getElementById('leaderboard-container');
        container.innerHTML = '<p style="text-align: center; color: #CAC4D0;">Loading Leaderboard...</p>';
        
        // Mock data generation
        setTimeout(() => {
            const players = [
                { name: 'Marcus "The Jet" Vance', yards: 18450 },
                { name: 'Leon "Bruiser" Tusk', yards: 16210 },
                { name: 'Desmond "Ghost" Ryder', yards: 15990 },
                { name: 'Julian "Flash" Pierce', yards: 14800 },
                { name: 'Tyrone "Truck" Jackson', yards: 13550 },
                { name: 'Dante "Spin" Miller', yards: 12100 },
                { name: 'Kobe "Elusive" Bryant', yards: 11050 },
                { name: 'Elijah "Power" Stone', yards: 10400 },
                { name: 'Caleb "Dash" Owens', yards: 9800 },
                { name: 'Javon "Shadow" Reed', yards: 8500 }
            ];
            
            const currentPlayer = {
                name: manager.state.teamName + ' (You)',
                yards: manager.state.totalRushingYards
            };
            players.push(currentPlayer);
            
            players.sort((a, b) => b.yards - a.yards);
            
            let html = '';
            for (let i = 0; i < Math.min(10, players.length); i++) {
                if (players[i]) {
                    const isYou = players[i].name === currentPlayer.name;
                    const color = isYou ? '#FFD700' : '#FFF';
                    const weight = isYou ? 'bold' : 'normal';
                    html += `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #555; color: ${color}; font-weight: ${weight};">
                        <span>#${i + 1} ${players[i].name}</span>
                        <span>${players[i].yards.toLocaleString()} yds</span>
                    </div>`;
                }
            }
            
            // If current player is not in top 10, show them at the bottom
            const playerIndex = players.findIndex(p => p.name === currentPlayer.name);
            if (playerIndex >= 10) {
                html += `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #555; color: #FFD700; font-weight: bold; margin-top: 12px; border-top: 2px dashed #777;">
                    <span>#${playerIndex + 1} ${currentPlayer.name}</span>
                    <span>${currentPlayer.yards.toLocaleString()} yds</span>
                </div>`;
            }
            
            container.innerHTML = html;
        }, 500); // Simulate network delay
    }

    function updateMuseumUI() {
        const s = manager.state;
        const chapter = legacy.evaluateChapter();
        document.getElementById('museum-chapter').innerText = chapter;
        document.getElementById('museum-lp').innerText = s.legacyPoints;
        document.getElementById('museum-rep').innerText = s.reputation;
        document.getElementById('museum-clutch').innerText = s.clutchFactor;
        
        let archName = "None";
        if (s.activeArchetype && ArchetypeRegistry[s.activeArchetype]) {
            archName = ArchetypeRegistry[s.activeArchetype].name;
        }
        document.getElementById('museum-archetype').innerText = archName;
    }

    function updateUI() {
        const team = manager.state;
        document.getElementById('menu-team-name').innerText = team.teamName;
        document.getElementById('menu-quarter-coins').innerText = `Quarter ${team.currentQuarter} | 🪙 ${team.coins}`;
        document.getElementById('menu-logo').innerText = team.logoSymbol;
        document.getElementById('menu-logo').style.backgroundColor = team.secondaryColor;
        document.getElementById('menu-card').style.backgroundColor = team.primaryColor;
    }

    function updateShopUI() {
        document.getElementById('shop-coins').innerText = `🪙 ${manager.state.coins}`;
        document.getElementById('lv-speed').innerText = `Lv. ${manager.state.speedLevel}`;
        document.getElementById('lv-stiff').innerText = `Lv. ${manager.state.stiffArmLevel}`;
        document.getElementById('lv-agility').innerText = `Lv. ${manager.state.agilityLevel}`;
        document.getElementById('lv-stamina').innerText = `Lv. ${manager.state.staminaLevel}`;
    }

    function updateStatsUI() {
        const s = manager.state;
        document.getElementById('stat-team').innerText = s.teamName;
        document.getElementById('stat-level').innerText = s.level || 1;
        document.getElementById('stat-xp').innerText = `(${s.xp || 0} / ${(s.level || 1) * 200} XP)`;
        document.getElementById('stat-badges').innerText = (s.unlockedBadges && s.unlockedBadges.length > 0) ? s.unlockedBadges.join(', ') : 'None';
        document.getElementById('stat-quarter').innerText = `Q ${s.currentQuarter}`;
        document.getElementById('stat-score').innerText = `${s.score} pts`;
        document.getElementById('stat-td').innerText = `${s.totalTouchdowns} TDs`;
        document.getElementById('stat-yards').innerText = `${s.totalRushingYards} yds`;
        document.getElementById('stat-coins').innerText = `🪙 ${s.coins}`;
    }

    function updateTeamUI() {
        document.getElementById('input-team-name').value = manager.state.teamName;
    }

    // Upgrades bindings
    window.buyUpgrade = (stat) => {
        contractor.buyUpgrade(stat);
        updateShopUI();
    };

    // Team Customization saving
    window.saveTeamCustomization = () => {
        const name = document.getElementById('input-team-name').value || "Gridiron Blitz";
        const primary = document.getElementById('select-primary').value;
        const secondary = document.getElementById('select-secondary').value;
        const logo = document.getElementById('select-logo').value;
        manager.updateTeam({ teamName: name, primaryColor: primary, secondaryColor: secondary, logoSymbol: logo });
        audio.playCoin();
        window.navigateTo('menu');
    };

    window.selectPlay = (scheme) => {
        manager.state.activePlaybook = scheme;
        manager.save();
        audio.playCoin();
        
        document.querySelectorAll('#screen-playbook .card').forEach(el => {
            el.style.border = '2px solid transparent';
        });
        document.getElementById('play-card-' + scheme).style.border = '2px solid #FFD700';
    };

    window.toggleHaptics = () => {
        manager.state.hapticEnabled = !manager.state.hapticEnabled;
        manager.save();
        audio.playSwipe();
        document.getElementById('toggle-haptics-btn').innerText = manager.state.hapticEnabled ? "ON" : "OFF";
        document.getElementById('toggle-haptics-btn').style.background = manager.state.hapticEnabled ? "#1B5E20" : "#555";
        if (manager.state.hapticEnabled) {
            triggerHaptic(50);
        }
    };

    function triggerHaptic(ms) {
        if (manager.state.hapticEnabled && navigator.vibrate) {
            navigator.vibrate(ms);
        }
    }

    // Canvas Game Loop
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let gameActive = false;
    let isCelebrating = false;
    let celebrationTimer = 0;
    let localYards = 0;
    let localScore = 0;
    let activeObjective = null;
    let yardsSinceLastJuke = 0;
    let coinsEarnedThisDrive = 0;
    
    let isSprinting = false;
    let fatigue = 0;
    const maxFatigue = 100;
    
    window.startSprint = () => { if (gameActive) isSprinting = true; };
    window.stopSprint = () => { isSprinting = false; };

    let effectiveSpeed = 1;
    let effectiveAgility = 1;
    let effectiveStamina = 1;
    let effectiveTrucking = 1;

    window.startRun = () => {
        audio.playSwipe();
        window.navigateTo('game');
        mechanics.reset();
        
        const s = manager.state;
        effectiveSpeed = s.speedLevel;
        effectiveAgility = s.agilityLevel;
        effectiveStamina = s.staminaLevel;
        effectiveTrucking = s.stiffArmLevel;
        
        if (s.activePlaybook === 'POWER_RUN') {
            effectiveStamina += 2;
            effectiveTrucking += 2;
            effectiveSpeed = Math.max(1, effectiveSpeed - 1);
        } else if (s.activePlaybook === 'SPEED_SWEEP') {
            effectiveSpeed += 2;
            effectiveAgility += 2;
            effectiveTrucking = Math.max(1, effectiveTrucking - 1);
        }

        localYards = 0;
        localScore = manager.state.score;
        gameActive = true;
        isCelebrating = false;
        celebrationTimer = 0;
        yardsSinceLastJuke = 0;
        coinsEarnedThisDrive = 0;
        fatigue = 0;
        isSprinting = false;
        activeObjective = Math.random() > 0.5 ? { type: 'NO_JUKE', target: 20, reward: 50, completed: false, text: "Rush 20 yards without juking" } : null;

        const opponents = ["Stallions", "Vipers", "Ironclads", "Sentinels", "Grizzlies", "Outlaws"];
        manager.state.currentOpponent = opponents[Math.floor(Math.random() * opponents.length)];
        if (!manager.state.rivalries) manager.state.rivalries = {};
        if (!manager.state.rivalries[manager.state.currentOpponent]) {
            manager.state.rivalries[manager.state.currentOpponent] = { gamesPlayed: 0, closeGames: 0, highScoringGames: 0, isRival: false };
        }
    };

    // Swipe & Touch Controls
    const gestureEngine = new GestureEngine(canvas, (swipeDir) => {
        if (!gameActive) return;
        if (swipeDir === 'LEFT') {
            mechanics.moveLeft();
            audio.playSwipe();
            triggerHaptic(50);
            yardsSinceLastJuke = 0;
        } else if (swipeDir === 'RIGHT') {
            mechanics.moveRight();
            audio.playSwipe();
            triggerHaptic(50);
            yardsSinceLastJuke = 0;
        } else if (swipeDir === 'UP' && manager.state.activeArchetype === 'FRIDGE') {
            mechanics.activateTruck();
            announcer.announce("FRIDGE");
        } else if (swipeDir === 'DOWN' && manager.state.activeArchetype === 'CLOCKMASTER') {
            mechanics.activateSlowMo();
            announcer.announce("CLOCKMASTER");
        }
    });

    window.moveLane = (dir) => {
        audio.playSwipe();
        triggerHaptic(50);
        if (dir === 'left') mechanics.moveLeft();
        if (dir === 'right') mechanics.moveRight();
        yardsSinceLastJuke = 0;
    };

    // Clock Game Loop
    const clock = new GameClock((dt) => {
        if (!gameActive && !isCelebrating) return;
        
        if (isCelebrating) {
            celebrationTimer += dt;
            if (celebrationTimer > 3.0) {
                isCelebrating = false;
                const isRival = manager.state.rivalries && manager.state.rivalries[manager.state.currentOpponent]?.isRival;
                const xpResult = manager.recordDrive(100, true, isRival);
                showGameOver(true, 100, xpResult, coinsEarnedThisDrive, (activeObjective && activeObjective.completed) ? activeObjective : null);
            }
            renderGame(ctx, canvas.width, canvas.height, mechanics, manager.state, true, celebrationTimer);
            return;
        }

        if (isSprinting && fatigue < maxFatigue) {
            fatigue += dt * 30; // Fatigue increases while sprinting
        } else {
            fatigue -= dt * (10 + (effectiveStamina * 5)); // Recover fatigue
            if (fatigue < 0) fatigue = 0;
        }

        let speedMultiplier = 1.0;
        if (isSprinting && fatigue < maxFatigue) speedMultiplier = 1.8;
        
        let fatiguePenalty = (fatigue / maxFatigue) * 0.5; // Max 50% slower when tired
        speedMultiplier -= fatiguePenalty;
        if (speedMultiplier < 0.4) speedMultiplier = 0.4;

        mechanics.update(dt * speedMultiplier);
        localYards += (0.6 + (effectiveSpeed * 0.1) + (effectiveStamina * 0.05)) * speedMultiplier;
        yardsSinceLastJuke += (0.6 + (effectiveSpeed * 0.1) + (effectiveStamina * 0.05)) * speedMultiplier;

        if (activeObjective && !activeObjective.completed) {
            if (activeObjective.type === 'NO_JUKE' && yardsSinceLastJuke >= activeObjective.target) {
                activeObjective.completed = true;
                manager.addCoins(activeObjective.reward);
                coinsEarnedThisDrive += activeObjective.reward;
                audio.playCoin();
                announcer.announce("OBJECTIVE");
            }
        }

        // Obstacle spawner
        const spawnChance = Math.max(0.01, 0.035 - (effectiveAgility * 0.003));
        if (Math.random() < spawnChance) {
            mechanics.obstacles.push({
                lane: Math.floor(Math.random() * 3),
                y: -0.2,
                type: Math.random() > 0.3 ? 'DEFENDER' : 'COIN'
            });
        }

        // Collision check
        for (let obs of mechanics.obstacles) {
            if (validator.checkCollision(mechanics.lane, 0.8, obs.lane, obs.y)) {
                if (obs.type === 'DEFENDER') {
                    if (mechanics.trucking || Math.random() < (effectiveTrucking * 0.05)) {
                        audio.playHit();
                        triggerHaptic(200);
                        legacy.addLegacyPoints(5);
                        obs.y = 2.0; // move off screen
                    } else {
                        audio.playHit();
                        triggerHaptic(200);
                        gameActive = false;
                        const isRival = manager.state.rivalries && manager.state.rivalries[manager.state.currentOpponent]?.isRival;
                        const xpResult = manager.recordDrive(Math.floor(localYards), false, isRival);
                        showGameOver(false, Math.floor(localYards), xpResult, coinsEarnedThisDrive, (activeObjective && activeObjective.completed) ? activeObjective : null);
                    }
                } else if (obs.type === 'COIN') {
                    audio.playCoin();
                    manager.addCoins(10);
                    coinsEarnedThisDrive += 10;
                    localScore += 50;
                    mechanics.obstacles = mechanics.obstacles.filter(o => o !== obs);
                }
            }
        }

        // Touchdown check
        if (localYards >= 100) {
            audio.playTouchdown();
            announcer.announce("TOUCHDOWN");
            gameActive = false;
            isCelebrating = true;
            celebrationTimer = 0;
        }

        renderGame(ctx, canvas.width, canvas.height, mechanics, manager.state, false, 0);
    });

    clock.start();

    function renderGame(ctx, width, height, mech, team, isCelebrating = false, celebrationTimer = 0) {
        ctx.clearRect(0, 0, width, height);

        // Turf Background
        ctx.fillStyle = team.primaryColor || '#1B5E20';
        ctx.fillRect(0, 0, width, height);

        // Perspective Field Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        const horizonY = height * 0.3;
        const laneW = width / 3;

        for (let i = 0; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(width / 2 + (i * laneW - width / 2) * 0.2, horizonY);
            ctx.moveTo(i * laneW, height);
            ctx.lineTo(width / 2 + (i * laneW - width / 2) * 0.2, horizonY);
            ctx.lineTo(i * laneW, height);
            ctx.stroke();
        }

        // Yard marks
        for (let i = 0; i < 5; i++) {
            const y = horizonY + (height - horizonY) * (i / 5);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Obstacles
        mech.obstacles.forEach(obs => {
            const lCenter = (obs.lane * laneW) + (laneW / 2);
            const cx = width / 2 + (lCenter - width / 2) * (0.2 + 0.8 * obs.y);
            const cy = horizonY + (height - horizonY) * obs.y;
            const r = 25 * (0.2 + 0.8 * obs.y);

            ctx.fillStyle = obs.type === 'DEFENDER' ? '#D32F2F' : '#FFD700';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Player
        const pCenter = (mech.lane * laneW) + (laneW / 2);
        let py = height * 0.82;
        let pRadius = 42;
        let shadowOffset = 10;
        
        if (isCelebrating) {
            const jumpHeight = Math.abs(Math.sin(celebrationTimer * 6)) * 60;
            py -= jumpHeight;
            pRadius = 42 + jumpHeight * 0.1;
            shadowOffset = 10 + jumpHeight * 0.5;
        }

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(pCenter + 5, (height * 0.82) + shadowOffset, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = team.secondaryColor || '#FFD700';
        ctx.beginPath();
        ctx.arc(pCenter, py, pRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isCelebrating) {
            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FFFFFF';
                const timeMod = celebrationTimer % 0.5;
                const sx = pCenter + Math.cos(celebrationTimer * 10 + i * Math.PI/3) * 80 * (timeMod * 2);
                const sy = py + Math.sin(celebrationTimer * 10 + i * Math.PI/3) * 80 * (timeMod * 2);
                ctx.beginPath();
                ctx.arc(sx, sy, 6 * (1 - timeMod * 2), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // HUD overlay in canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        if (isCelebrating) {
             ctx.font = 'bold 28px sans-serif';
             ctx.fillStyle = '#FFD700';
             ctx.fillText(`TOUCHDOWN!`, width / 2 - 80, height / 2 - 100);
             ctx.fillStyle = '#FFFFFF';
             ctx.font = 'bold 18px sans-serif';
        }
        
        let vsText = `Vs. ${manager.state.currentOpponent || 'Unknown'}`;
        if (manager.state.rivalries && manager.state.rivalries[manager.state.currentOpponent]?.isRival) {
            vsText += " ⚔️ (RIVAL)";
            ctx.fillStyle = '#FF4081';
        } else {
            ctx.fillStyle = '#FFFFFF';
        }
        ctx.fillText(vsText, 20, 20);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Yards: ${Math.floor(localYards)}/100`, 20, 40);
        ctx.fillText(`Score: ${localScore}`, width - 130, 40);
        
        // Fatigue Bar
        ctx.fillStyle = '#79747E';
        ctx.fillRect(width - 130, 60, 100, 10);
        ctx.fillStyle = (fatigue > maxFatigue * 0.8) ? '#FF4081' : '#FFD700';
        ctx.fillRect(width - 130, 60, 100 * (1 - (fatigue / maxFatigue)), 10);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Stamina', width - 130, 85);

        if (activeObjective) {
            ctx.fillStyle = activeObjective.completed ? '#4CAF50' : '#FFD700';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(activeObjective.text, 20, 70);
            if (!activeObjective.completed) {
                ctx.fillText(`(${Math.floor(yardsSinceLastJuke)}/${activeObjective.target})`, 20, 90);
            } else {
                ctx.fillText(`Completed!`, 20, 90);
            }
        }
    }

    function showGameOver(isTD, yards, xpResult, coinsEarned, objectiveCleared) {
        if (isTD) {
            legacy.addLegacyPoints(50);
            manager.state.clutchFactor += 1;
        } else {
            legacy.addLegacyPoints(yards);
        }
        
        const opponent = manager.state.currentOpponent;
        let rivalData = manager.state.rivalries ? manager.state.rivalries[opponent] : null;
        if (rivalData) {
             rivalData.gamesPlayed++;
             if (yards >= 80 && !isTD) rivalData.closeGames++;
             if (isTD) rivalData.highScoringGames++;
             if (!rivalData.isRival && (rivalData.closeGames >= 2 || rivalData.highScoringGames >= 3)) {
                 rivalData.isRival = true;
             }
        }
        
        const unlocked = legacy.evaluateArchetypes();
        manager.state.careerGamesPlayed++;
        manager.save();

        document.getElementById('summary-title').innerText = isTD ? "🏈 TOUCHDOWN!" : "💥 TACKLED!";
        document.getElementById('summary-title').style.color = isTD ? "#FFD700" : "#FF4081";
        document.getElementById('summary-subtitle').innerText = isTD ? "Incredible drive! You rushed 100 yards for a Touchdown!" : `You were tackled by the defense at ${yards} yards.`;
        
        let oppText = opponent || 'Unknown';
        if (rivalData && rivalData.isRival) oppText += ' ⚔️ (RIVAL)';
        document.getElementById('summary-opponent').innerText = oppText;
        if (rivalData && rivalData.isRival) {
            document.getElementById('summary-opponent').style.color = '#FF4081';
        } else {
            document.getElementById('summary-opponent').style.color = '#FFF';
        }
        
        document.getElementById('summary-yards').innerText = `${yards} yds`;
        
        if (objectiveCleared) {
            document.getElementById('summary-objectives').innerText = `Yes (${objectiveCleared.text})`;
            document.getElementById('summary-objectives').style.color = '#4CAF50';
        } else {
            document.getElementById('summary-objectives').innerText = 'None';
            document.getElementById('summary-objectives').style.color = '#79747E';
        }
        
        let xpText = xpResult ? `+${xpResult.xpGained} XP` : '0 XP';
        if (xpResult && xpResult.bonusXp) {
            xpText += ` (+${xpResult.bonusXp} Rival Bonus!)`;
        }
        document.getElementById('summary-xp').innerText = xpText;
        document.getElementById('summary-coins').innerText = `+${coinsEarned} 🪙`;

        if (unlocked) {
            document.getElementById('summary-unlocks').innerText = `🎉 LEGEND UNLOCKED: ${unlocked.name}\n${unlocked.description}`;
        } else {
            document.getElementById('summary-unlocks').innerText = '';
        }
        
        window.navigateTo('summary');
        
        if (manager.state.careerGamesPlayed % 17 === 0 && manager.state.careerGamesPlayed > 0) {
            showContractModal(xpResult);
        } else if (xpResult && xpResult.leveledUp) {
            showLevelUpModal(xpResult);
        }
    }

    function showLevelUpModal(xpResult) {
        document.getElementById('levelup-number').innerText = manager.state.level;
        document.getElementById('levelup-badge-name').innerText = xpResult.badge;
        document.getElementById('levelup-modal').classList.add('visible');
        
        window.closeLevelUpModal = () => {
            document.getElementById('levelup-modal').classList.remove('visible');
        };
    }

    function showContractModal(xpResult) {
        document.getElementById('modal-contract').style.display = 'flex';
        const baseOffer = manager.state.level * 1000 + manager.state.reputation * 10;
        document.getElementById('contract-offer-amt').innerText = baseOffer;
        document.getElementById('contract-morale').innerText = manager.state.lockerRoomMorale;
        
        window.acceptContract = () => {
            manager.addCoins(baseOffer);
            manager.state.lockerRoomMorale = Math.min(100, manager.state.lockerRoomMorale + 5);
            manager.save();
            document.getElementById('modal-contract').style.display = 'none';
            if (xpResult && xpResult.leveledUp) showLevelUpModal(xpResult);
        };
        
        window.holdOutContract = () => {
            manager.addCoins(Math.floor(baseOffer * 1.5));
            manager.state.lockerRoomMorale -= 20;
            if (manager.state.lockerRoomMorale < 0) manager.state.lockerRoomMorale = 0;
            manager.save();
            document.getElementById('modal-contract').style.display = 'none';
            if (xpResult && xpResult.leveledUp) showLevelUpModal(xpResult);
        };
    }

    updateUI();
});
