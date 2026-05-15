/* Canvas, game loop, input */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pCanvas = document.getElementById('portrait-canvas');
const pCtx = pCanvas.getContext('2d');

const dContainer = document.getElementById('dialogue-container');
const dName = document.getElementById('dialogue-name');
const dText = document.getElementById('dialogue-text');
const cBox = document.getElementById('choice-buttons');
const arrow = document.getElementById('diag-arrow');

function defaultPlayer() {
    return {
        tx: 9, ty: 8, x: 9 * TILE_SIZE, y: 8 * TILE_SIZE,
        dir: 'down', isMoving: false, moveTimer: 0, speed: 2
    };
}

function initPlayer(fromSave) {
    let savedPlayer = null;
    if (fromSave) {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (raw) savedPlayer = JSON.parse(raw).player;
        } catch (e) {}
    }
    player = savedPlayer || defaultPlayer();
}

function initWorldAfterLoad() {
    applyDealershipLayouts();
    applyNeighborhoodLayouts();
    applyParkingStreetWarps();
    syncDriveDailyCustomers();
}

function update() {
    if (gameState === 'MENU') return;
    if (gameState === 'TITLE' || gameState === 'INTRO' || activeDialogue || gameState === 'CUTSCENE') return;
    let joe = (maps && maps[currentMapKey] && maps[currentMapKey].npcs) ? maps[currentMapKey].npcs.find(n => n.id === 'coolant_joe') : null;
    if (joe && !joe.hidden) updateWanderer(joe);
    let bri = (maps && maps[currentMapKey] && maps[currentMapKey].npcs) ? maps[currentMapKey].npcs.find(n => n.id === 'bri') : null;
    if (bri && !bri.hidden) updateWanderer(bri);

    if (gameState === 'PLAYING') {
        if (gameEvents.pendingMikeOfficePage && questState.step === 5 && currentMapKey === 'drive') {
            checkMikeOfficePageOnDrive();
        }
        gameEvents.tick++;
        if (gameEvents.tick >= 60) { gameEvents.tick = 0; if (gameEvents.timeMinutes < 1440) gameEvents.timeMinutes++; }

        if (gameEvents.currentDay === 1 && questState.step === 7 && gameEvents.timeMinutes >= 720) {
            questState.step = 8;
            gameEvents.dailyAptsCompleted = 2;
            gameEvents.dailyWalkIn = false;
            gameEvents.dailySchedule = null;
            generateDailyCustomerSchedule();
            triggerPAAnnouncement();
        }

        tickIntradayWalkIn();

        if (gameEvents.timeMinutes === 900 && !gameEvents.zackComeback) {
            gameEvents.zackComeback = true;
            let zCust = maps.drive.npcs.find(n => n.id === 'zack_cust');
            let zCar = maps.drive.npcs.find(n => n.id === 'zack_car');
            if (zCust) zCust.hidden = false;
            if (zCar) zCar.hidden = false;
            activeDialogue = ["[P.A. SYSTEM]\nZack, you have a comeback\nwaiting on the drive."];
            activeLine = 0; dName.innerText = "SYSTEM"; dText.innerText = activeDialogue[0];
            drawPortrait('NONE'); dContainer.style.display = 'flex';
        }

        if (gameEvents.timeMinutes === 1050 && !gameEvents.meeting) {
            gameEvents.meeting = true;
            activeDialogue = ["[P.A. SYSTEM]\nAll service advisors report\nto Mike's office immediately."];
            activeLine = 0; dName.innerText = "SYSTEM"; dText.innerText = activeDialogue[0];
            drawPortrait('NONE'); dContainer.style.display = 'flex';
            gameEvents.pendingMeetingTeleport = true;
        }

        if (gameEvents.timeMinutes === 1080 && !gameEvents.lightsOut) {
            gameEvents.lightsOut = true; gameEvents.isAfterHours = true;
            Object.values(maps).forEach(m => {
                m.npcs.forEach(n => {
                    if (n.id !== 'coolant_joe' && n.id !== 'dave' && !n.isObject) { n.hidden = true; }
                });
            });
        }
    }

    if (gameState === 'FLASH') {
        if (flash.state === 'fade_out') {
            flash.alpha += 0.1;
            if (flash.alpha >= 1) {
                flash.alpha = 1; flash.state = 'fade_in';
                let dc = maps.drive.npcs.find(n => n.id === 'customer_car'); if (dc && questState.step < 8) dc.hidden = true;
                let ac = maps.drive.npcs.find(n => n.id === 'angry_customer'); if (ac && questState.step < 8) ac.hidden = true;
                let sc = maps.shop.npcs.find(n => n.id === 'shop_car'); if (sc && questState.step < 8) sc.hidden = false;
            }
        } else if (flash.state === 'fade_in') {
            flash.alpha -= 0.1;
            if (flash.alpha <= 0) {
                flash.alpha = 0; flash.active = false; gameState = 'PLAYING';
                tryStartDay2MeetingAfterFlash();
                tryTriggerMikeOfficePageOnDrive();
            }
        }
        return;
    }
    if (gameState === 'TRANSITION') {
        if (transition.state === 'fade_out') {
            transition.alpha += 0.05;
            if (transition.alpha >= 1) {
                transition.alpha = 1; transition.state = 'fade_in';
                currentMapKey = transition.dest.to;
                player.tx = transition.dest.px; player.ty = transition.dest.py;
                player.x = player.tx * TILE_SIZE; player.y = player.ty * TILE_SIZE;
            }
        } else if (transition.state === 'fade_in') {
            transition.alpha -= 0.05;
            if (transition.alpha <= 0) {
                transition.alpha = 0; transition.active = false; gameState = 'PLAYING';
                if (currentMapKey === 'drive' && playerDetails.inUniform && !gameEvents.firstCustomerTriggered) {
                    let customer = maps.drive.npcs.find(n => n.id === 'angry_customer');
                    if (customer) triggerCutscene(customer);
                }
                if (transition.dest && transition.dest.isDay2Meeting) {
                    setTimeout(() => beginDay2OfficeDialogue(), 200);
                } else if (transition.dest && transition.dest.isMeeting) {
                    let oryan = maps.office.npcs.find(n => n.id === 'office_ryan');
                    let ozack = maps.office.npcs.find(n => n.id === 'office_zack');
                    let owhit = maps.office.npcs.find(n => n.id === 'office_whitney');
                    if (oryan) oryan.hidden = false;
                    if (ozack) ozack.hidden = false;
                    if (owhit) owhit.hidden = false;
                    player.dir = 'up';
                    setTimeout(() => {
                        activeDialogue = ["Listen up, team.", "CSI is slipping and Bronson's comebacks\nare through the roof.", "We're having a mandatory meeting\ntomorrow at 7:00 AM sharp.", "Don't be late. Back to work."];
                        activeLine = 0; dName.innerText = "MIKE"; dText.innerText = activeDialogue[0];
                        drawPortrait('MIKE'); dContainer.style.display = 'flex';
                    }, 200);
                } else if (transition.dest && transition.dest.afterDay2Meeting) {
                    setTimeout(() => onAfterDay2MeetingArriveDrive(), 200);
                } else if (transition.dest && transition.dest.to === 'drive') {
                    setTimeout(() => tryTriggerMikeOfficePageOnDrive(), 200);
                }
            }
        }
        return;
    }

    if (!player.isMoving) {
        let dx = 0; let dy = 0;
        if (keys.w) { dy = -1; player.dir = 'up'; }
        else if (keys.s) { dy = 1; player.dir = 'down'; }
        else if (keys.a && !keys.enter) { dx = -1; player.dir = 'left'; }
        else if (keys.d) { dx = 1; player.dir = 'right'; }
        if (dx !== 0 || dy !== 0) {
            if (!isSolid(player.tx + dx, player.ty + dy)) {
                player.tx += dx; player.ty += dy;
                player.isMoving = true; player.moveTimer = TILE_SIZE;
                player.speed = (playerDetails.hasRunningShoes && keys.b) ? 4 : 2;
            }
        }
    } else {
        player.moveTimer -= player.speed;
        if (player.dir === 'up') player.y -= player.speed;
        if (player.dir === 'down') player.y += player.speed;
        if (player.dir === 'left') player.x -= player.speed;
        if (player.dir === 'right') player.x += player.speed;
        if (player.moveTimer <= 0) {
            player.isMoving = false;
            player.x = player.tx * TILE_SIZE; player.y = player.ty * TILE_SIZE;
            const warp = maps[currentMapKey].warps.find(w => w.tx === player.tx && w.ty === player.ty);
            if (warp) triggerWarp(warp);
        }
    }
}

function loop() { update(); draw(); requestAnimationFrame(loop); }

window.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT') return;
    let k = e.key.toLowerCase();
    if (k === 'arrowup') k = 'w';
    if (k === 'arrowdown') k = 's';
    if (k === 'arrowleft') k = 'a';
    if (k === 'arrowright') k = 'd';
    if (k === 'p' && gameState !== 'INTRO' && gameState !== 'TITLE') toggleStartMenu();
    if (k === 'shift' || k === 'b') k = 'b';
    if (keys.hasOwnProperty(k)) keys[k] = true;
});
window.addEventListener('keyup', e => {
    if (document.activeElement.tagName === 'INPUT') return;
    let k = e.key.toLowerCase();
    if (k === 'arrowup') k = 'w';
    if (k === 'arrowdown') k = 's';
    if (k === 'arrowleft') k = 'a';
    if (k === 'arrowright') k = 'd';
    if (k === 'shift' || k === 'b') k = 'b';
    if (keys.hasOwnProperty(k)) keys[k] = false;
    if ((e.key === 'Enter' || e.key === ' ') && !actionTriggered) {
        actionTriggered = true;
        interact();
        setTimeout(() => { actionTriggered = false; }, 100);
    }
});

const bindTouchDir = (id, k) => {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', e => { e.preventDefault(); keys[k] = true; });
    btn.addEventListener('touchend', e => { e.preventDefault(); keys[k] = false; });
};
bindTouchDir('btn-up', 'w');
bindTouchDir('btn-down', 's');
bindTouchDir('btn-left', 'a');
bindTouchDir('btn-right', 'd');
document.getElementById('btn-a').addEventListener('touchstart', e => {
    e.preventDefault();
    if (!actionTriggered) { actionTriggered = true; interact(); }
});
document.getElementById('btn-a').addEventListener('touchend', e => {
    e.preventDefault();
    actionTriggered = false;
});
document.getElementById('btn-b').addEventListener('touchstart', e => { e.preventDefault(); keys['b'] = true; });
document.getElementById('btn-b').addEventListener('touchend', e => { e.preventDefault(); keys['b'] = false; });
document.getElementById('btn-start').addEventListener('touchstart', e => { e.preventDefault(); toggleStartMenu(); });

function boot() {
    loadGameSettings();
    initPlayer(false);
    initWorldAfterLoad();
    refreshTitleScreen();
    loop();
}

window.initPlayer = initPlayer;
window.initWorldAfterLoad = initWorldAfterLoad;

boot();
