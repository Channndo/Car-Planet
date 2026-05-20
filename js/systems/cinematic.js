/* Pokémon-style walk-ups, follow tours, and locked story beats */

let cinematic = {
    active: false,
    steps: [],
    stepIndex: 0,
    phase: 'idle',
    waitFrames: 0,
    saved: {},
    onComplete: null,
    followLeaderId: null,
    followOffset: 1
};

function ensureNpcMotion(npc) {
    if (!npc) return;
    if (npc.x === undefined) npc.x = npc.tx * TILE_SIZE;
    if (npc.y === undefined) npc.y = npc.ty * TILE_SIZE;
    if (npc.isMoving === undefined) npc.isMoving = false;
    if (npc.moveTimer === undefined) npc.moveTimer = 0;
    if (npc.speed === undefined) npc.speed = 2;
}

function getNpc(mapKey, id) {
    const m = maps[mapKey || currentMapKey];
    if (!m || !m.npcs) return null;
    return m.npcs.find(n => n.id === id) || null;
}

function snapNpcToTile(npc) {
    if (!npc) return;
    npc.x = npc.tx * TILE_SIZE;
    npc.y = npc.ty * TILE_SIZE;
    npc.isMoving = false;
    npc.moveTimer = 0;
}

function npcStepToward(npc, targetTx, targetTy, speed) {
    if (!npc) return false;
    ensureNpcMotion(npc);
    if (npc.isMoving) return true;
    if (npc.tx === targetTx && npc.ty === targetTy) return false;

    let nx = npc.tx;
    let ny = npc.ty;
    const dx = targetTx - npc.tx;
    const dy = targetTy - npc.ty;

    if (Math.abs(dx) >= Math.abs(dy)) nx += dx > 0 ? 1 : -1;
    else ny += dy > 0 ? 1 : -1;

    const tryOrder = [
        { tx: nx, ty: ny },
        { tx: npc.tx + (dx !== 0 ? (dx > 0 ? 1 : -1) : 0), ty: npc.ty },
        { tx: npc.tx, ty: npc.ty + (dy !== 0 ? (dy > 0 ? 1 : -1) : 0) }
    ];

    let moved = false;
    for (let i = 0; i < tryOrder.length; i++) {
        const t = tryOrder[i];
        const blockPlayer = !(t.tx === player.tx && t.ty === player.ty);
        const solid = isSolid(t.tx, t.ty);
        const otherNpc = maps[currentMapKey].npcs.some(n => {
            if (n.hidden || n.isObject || n === npc) return false;
            if (n.charCode === 'CAR' || n.charCode === 'SUV_BLACK' || n.charCode === 'WRECK_CAR') {
                return t.tx >= n.tx && t.tx <= n.tx + 2 && t.ty >= n.ty && t.ty <= n.ty + 1;
            }
            return n.tx === t.tx && n.ty === t.ty;
        });
        if (!solid && !otherNpc && (blockPlayer || (t.tx === targetTx && t.ty === targetTy))) {
            if (t.tx > npc.tx) npc.dir = 'right';
            else if (t.tx < npc.tx) npc.dir = 'left';
            else if (t.ty > npc.ty) npc.dir = 'down';
            else npc.dir = 'up';
            npc.tx = t.tx;
            npc.ty = t.ty;
            npc.isMoving = true;
            npc.moveTimer = 0;
            npc.speed = speed || 2;
            moved = true;
            break;
        }
    }
    return moved;
}

function advanceNpcMotion(npc) {
    if (!npc || !npc.isMoving) return;
    if (npc.dir === 'up') npc.y -= npc.speed;
    if (npc.dir === 'down') npc.y += npc.speed;
    if (npc.dir === 'left') npc.x -= npc.speed;
    if (npc.dir === 'right') npc.x += npc.speed;
    npc.moveTimer += npc.speed;
    if (npc.moveTimer >= TILE_SIZE) {
        npc.isMoving = false;
        npc.moveTimer = 0;
        npc.x = npc.tx * TILE_SIZE;
        npc.y = npc.ty * TILE_SIZE;
    }
}

function playerStepToward(targetTx, targetTy, speed) {
    if (player.isMoving) return true;
    if (player.tx === targetTx && player.ty === targetTy) return false;
    let nx = player.tx;
    let ny = player.ty;
    const dx = targetTx - player.tx;
    const dy = targetTy - player.ty;
    if (Math.abs(dx) >= Math.abs(dy)) nx += dx > 0 ? 1 : -1;
    else ny += dy > 0 ? 1 : -1;
    if (!isSolid(nx, ny)) {
        if (nx > player.tx) player.dir = 'right';
        else if (nx < player.tx) player.dir = 'left';
        else if (ny > player.ty) player.dir = 'down';
        else player.dir = 'up';
        player.tx = nx;
        player.ty = ny;
        player.isMoving = true;
        player.moveTimer = TILE_SIZE;
        player.speed = speed || 2;
        return true;
    }
    return false;
}

function advancePlayerMotion() {
    if (!player.isMoving) return;
    if (player.dir === 'up') player.y -= player.speed;
    if (player.dir === 'down') player.y += player.speed;
    if (player.dir === 'left') player.x -= player.speed;
    if (player.dir === 'right') player.x += player.speed;
    player.moveTimer -= player.speed;
    if (player.moveTimer <= 0) {
        player.isMoving = false;
        player.x = player.tx * TILE_SIZE;
        player.y = player.ty * TILE_SIZE;
    }
}

function followNpc(leaderId, offsetRows) {
    const leader = getNpc(currentMapKey, leaderId);
    if (!leader) return;
    const behindTy = leader.ty + (offsetRows || 1);
    let behindTx = leader.tx;
    if (leader.dir === 'left') behindTx = leader.tx + 1;
    else if (leader.dir === 'right') behindTx = leader.tx - 1;
    if (player.tx !== behindTx || player.ty !== behindTy) {
        playerStepToward(behindTx, behindTy, Math.max(1, (leader.speed || 2) - 1));
    }
    if (leader.ty < player.ty) player.dir = 'up';
    else if (leader.ty > player.ty) player.dir = 'down';
}

function startCinematic(steps, onComplete) {
    cinematic.active = true;
    cinematic.steps = steps;
    cinematic.stepIndex = 0;
    cinematic.phase = 'idle';
    cinematic.waitFrames = 0;
    cinematic.stuckFrames = 0;
    cinematic.runawayFrames = 0;
    cinematic.onComplete = onComplete || null;
    cinematic.followLeaderId = null;
    gameState = 'STORY';
    gameEvents.storyTimeFrozen = true;
    if (typeof playStoryChime === 'function') playStoryChime();
    runCinematicStep();
}

function hideTourRyanOnOtherMaps() {
    ['shop', 'parts', 'office'].forEach(function (mapKey) {
        const r = getNpc(mapKey, 'ryan');
        if (r) r.hidden = true;
    });
}

function resetPlayerMotion() {
    if (!player) return;
    player.isMoving = false;
    player.moveTimer = 0;
    player.x = player.tx * TILE_SIZE;
    player.y = player.ty * TILE_SIZE;
}

function endCinematic() {
    cinematic.active = false;
    cinematic.steps = [];
    cinematic.stepIndex = 0;
    cinematic.followLeaderId = null;
    cinematic.stuckFrames = 0;
    cinematic.walkTarget = null;
    cinematic.followUntil = null;
    hideTourRyanOnOtherMaps();
    resetPlayerMotion();
    gameEvents.storyTimeFrozen = false;
    gameState = 'PLAYING';
    const done = cinematic.onComplete;
    cinematic.onComplete = null;
    if (done) done();
}

function skipCinematicStepIfStuck() {
    cinematic.stuckFrames = (cinematic.stuckFrames || 0) + 1;
    if (cinematic.stuckFrames > 120) {
        cinematic.stuckFrames = 0;
        cinematic.stepIndex++;
        runCinematicStep();
        return true;
    }
    return false;
}

function showCinematicDialogue(lines, speakerName, portrait) {
    activeDialogue = lines.slice();
    activeLine = 0;
    dName.innerText = speakerName || 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait(portrait || 'NONE');
    dContainer.style.display = 'flex';
    cinematic.phase = 'dialogue';
}

function storyWarp(mapKey, px, py, npcId, ntx, nty) {
    if (mapKey !== currentMapKey) hideTourRyanOnOtherMaps();
    currentMapKey = mapKey;
    player.tx = px;
    player.ty = py;
    resetPlayerMotion();
    const npc = getNpc(mapKey, npcId);
    if (npc) {
        npc.hidden = false;
        npc.tx = ntx;
        npc.ty = nty;
        ensureNpcMotion(npc);
        snapNpcToTile(npc);
    }
}

function forceEndCinematic() {
    if (!cinematic.active) return;
    dContainer.style.display = 'none';
    activeDialogue = null;
    endCinematic();
}

function runCinematicStep() {
    if (!cinematic.active) return;
    const step = cinematic.steps[cinematic.stepIndex];
    if (!step) {
        endCinematic();
        return;
    }

    if (step.type === 'wait') {
        cinematic.phase = 'wait';
        cinematic.waitFrames = step.frames || 30;
        return;
    }
    if (step.type === 'dialogue') {
        showCinematicDialogue(step.lines, step.name, step.portrait);
        return;
    }
    if (step.type === 'walk_npc') {
        cinematic.phase = 'walk_npc';
        cinematic.walkTarget = { map: step.map || currentMapKey, id: step.npcId, tx: step.tx, ty: step.ty, speed: step.speed || 1 };
        if (step.map && step.map !== currentMapKey) storyWarp(step.map, step.px, step.py, step.npcId, step.ntx || step.tx, step.nty || step.ty);
        return;
    }
    if (step.type === 'walk_player') {
        cinematic.phase = 'walk_player';
        cinematic.walkTarget = { tx: step.tx, ty: step.ty, speed: step.speed || 2 };
        return;
    }
    if (step.type === 'follow') {
        cinematic.phase = 'follow';
        cinematic.followLeaderId = step.npcId;
        cinematic.followOffset = step.offset || 1;
        cinematic.followUntil = { map: step.map || currentMapKey, tx: step.tx, ty: step.ty };
        if (step.map && step.map !== currentMapKey) {
            storyWarp(step.map, step.px, step.py, step.npcId, step.ntx, step.nty);
        }
        return;
    }
    if (step.type === 'warp') {
        storyWarp(step.map, step.px, step.py, step.npcId, step.ntx, step.nty);
        cinematic.stepIndex++;
        runCinematicStep();
        return;
    }
    if (step.type === 'callback') {
        if (step.fn) step.fn();
        cinematic.stepIndex++;
        runCinematicStep();
        return;
    }
    cinematic.stepIndex++;
    runCinematicStep();
}

function advanceCinematicDialogue() {
    if (cinematic.phase !== 'dialogue' || !activeDialogue) return false;
    activeLine++;
    if (activeLine < activeDialogue.length) {
        dText.innerText = activeDialogue[activeLine];
        applyDialogueSpeakerPortrait(activeDialogue[activeLine]);
        checkChoiceTrigger();
        return true;
    }
    dContainer.style.display = 'none';
    activeDialogue = null;
    cinematic.phase = 'idle';
    cinematic.stepIndex++;
    runCinematicStep();
    return true;
}

function updateCinematic() {
    if (!cinematic.active) return;

    cinematic.runawayFrames = (cinematic.runawayFrames || 0) + 1;
    if (cinematic.runawayFrames > 3600) {
        forceEndCinematic();
        return;
    }

    if (cinematic.phase === 'dialogue') return;

    if (cinematic.phase === 'wait') {
        cinematic.waitFrames--;
        if (cinematic.waitFrames <= 0) {
            cinematic.stepIndex++;
            runCinematicStep();
        }
        return;
    }

    const followMap = cinematic.followUntil ? (cinematic.followUntil.map || currentMapKey) : currentMapKey;
    const leader = cinematic.followLeaderId ? getNpc(followMap, cinematic.followLeaderId) : null;
    if (leader) advanceNpcMotion(leader);
    advancePlayerMotion();

    if (cinematic.phase === 'walk_npc' && cinematic.walkTarget) {
        const t = cinematic.walkTarget;
        const npc = getNpc(t.map, t.id);
        if (!npc) {
            if (skipCinematicStepIfStuck()) return;
            return;
        }
        cinematic.stuckFrames = 0;
        advanceNpcMotion(npc);
        if (!npc.isMoving && npc.tx === t.tx && npc.ty === t.ty) {
            cinematic.stepIndex++;
            runCinematicStep();
            return;
        }
        if (!npc.isMoving && !npcStepToward(npc, t.tx, t.ty, t.speed)) {
            if (skipCinematicStepIfStuck()) return;
        }
        return;
    }

    if (cinematic.phase === 'walk_player' && cinematic.walkTarget) {
        const t = cinematic.walkTarget;
        if (!player.isMoving && player.tx === t.tx && player.ty === t.ty) {
            cinematic.stepIndex++;
            runCinematicStep();
            return;
        }
        playerStepToward(t.tx, t.ty, t.speed);
        return;
    }

    if (cinematic.phase === 'follow' && cinematic.followUntil) {
        const u = cinematic.followUntil;
        if (!leader) {
            if (skipCinematicStepIfStuck()) return;
            return;
        }
        cinematic.stuckFrames = 0;
        followNpc(cinematic.followLeaderId, cinematic.followOffset);
        if (!leader.isMoving && leader.tx === u.tx && leader.ty === u.ty) {
            const px = player.tx;
            const py = player.ty;
            const near = Math.abs(px - u.tx) <= 1 && Math.abs(py - u.ty) <= 2;
            if (near && !player.isMoving) {
                cinematic.stepIndex++;
                runCinematicStep();
                return;
            }
        }
        if (!leader.isMoving && !npcStepToward(leader, u.tx, u.ty, 1)) {
            if (skipCinematicStepIfStuck()) return;
        }
    }
}

/* —— Whitney check-in approach —— */
let whitneySaved = null;

function beginWhitneyApproachCinematic() {
    const whit = getNpc('drive', 'whitney');
    if (whit) {
        whit.hidden = false;
        whitneySaved = { tx: whit.tx, ty: whit.ty, dir: whit.dir || 'down', hidden: whit.hidden };
        ensureNpcMotion(whit);
    }
    player.dir = 'up';
    startCinematic([
        { type: 'wait', frames: 20 },
        { type: 'walk_npc', npcId: 'whitney', tx: 7, ty: 8, speed: 1 },
        { type: 'walk_npc', npcId: 'whitney', tx: 8, ty: 6, speed: 1 },
        { type: 'wait', frames: 24 },
        { type: 'callback', fn: function () {
            const w = getNpc('drive', 'whitney');
            if (w) { w.dir = 'left'; player.dir = 'right'; }
        }},
        { type: 'dialogue', name: 'WHITNEY', portrait: 'WHITNEY', lines: [
            "WHITNEY: Hey. I'm going to show you how\nto do this since no one else\naround here will.",
            "WHITNEY: Walk up to the customer's vehicle\nand face it. Press the action button.",
            "WHITNEY: When it asks to check the\nvehicle in, say YES.",
            "WHITNEY: Then go to YOUR DESK and\nwrite the repair order.",
            "WHITNEY: After that, take the RO to Mike.\nDon't mess up my CSI."
        ]},
        { type: 'callback', fn: function () {
            if (whitneySaved) {
                whitneyTutorialSaved = whitneySaved;
                whitneySaved = null;
            }
            completeWhitneyCheckInTutorial();
        }}
    ]);
}

/* —— Ryan walk-up after Mike's office (no follow tour; player stays put) —— */
const RYAN_DRIVE_DESK_TX = 11;
const RYAN_DRIVE_DESK_TY = 11;

function beginRyanApproachCinematic() {
    if (cinematic.active) return;
    if (gameEvents.ryanTourComplete) return;
    if (!gameEvents.pendingRyanTour && !gameEvents.pendingRyanDriveArrival) return;

    gameEvents._ryanApproachPlaying = true;
    if (typeof restoreDriveWhitneyToDesk === 'function') restoreDriveWhitneyToDesk();

    const ryan = getNpc('drive', 'ryan');
    if (ryan) {
        ryan.hidden = false;
        ryan.tx = RYAN_DRIVE_DESK_TX;
        ryan.ty = RYAN_DRIVE_DESK_TY;
        ryan.dir = 'down';
        ensureNpcMotion(ryan);
        snapNpcToTile(ryan);
    }

    resetPlayerMotion();
    player.dir = 'up';
    const lines = typeof getRyanWalkAroundLines === 'function'
        ? getRyanWalkAroundLines()
        : (typeof getRyanIntroLines === 'function' ? getRyanIntroLines() : ["RYAN: Look around before noon."]);

    startCinematic([
        { type: 'wait', frames: 20 },
        { type: 'walk_npc', npcId: 'ryan', tx: 11, ty: 9, speed: 1 },
        { type: 'walk_npc', npcId: 'ryan', tx: 14, ty: 4, speed: 1 },
        { type: 'wait', frames: 24 },
        { type: 'callback', fn: function () {
            const r = getNpc('drive', 'ryan');
            if (r) { r.dir = 'left'; player.dir = 'right'; }
        }},
        { type: 'dialogue', name: 'RYAN', portrait: 'RYAN', lines: lines },
        { type: 'callback', fn: function () {
            gameEvents._ryanApproachPlaying = false;
            if (typeof completeRyanIntro === 'function') completeRyanIntro();
        }}
    ]);
}

window.updateCinematic = updateCinematic;
window.advanceCinematicDialogue = advanceCinematicDialogue;
window.beginWhitneyApproachCinematic = beginWhitneyApproachCinematic;
window.beginRyanApproachCinematic = beginRyanApproachCinematic;
window.isCinematicActive = function () { return cinematic.active; };
window.forceEndCinematic = forceEndCinematic;
window.resetPlayerMotion = resetPlayerMotion;
