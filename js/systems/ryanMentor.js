/* Ryan — walk-up intro + ongoing mentor hints */

const RYAN_DRIVE_DESK = { tx: 11, ty: 11, dir: 'down' };

/* Short beat after Mike's office — explore the dealership, no tour/follow */
function getRyanWalkAroundLines() {
    return [
        "RYAN: Hey — " + playerDetails.name + ".",
        "RYAN: Mike just hooked you up with\nthose running shoes.",
        "RYAN: Look around the shop, parts, and drive\nbefore noon.",
        "RYAN: I'll be at my desk if you need anything."
    ];
}

function getRyanIntroLines() {
    return getRyanWalkAroundLines();
}

function resetDriveRyanToDesk() {
    const ryan = maps.drive && maps.drive.npcs ? maps.drive.npcs.find(n => n.id === 'ryan') : null;
    if (!ryan) return;
    ryan.hidden = false;
    ryan.tx = RYAN_DRIVE_DESK.tx;
    ryan.ty = RYAN_DRIVE_DESK.ty;
    ryan.dir = RYAN_DRIVE_DESK.dir;
    if (typeof ensureNpcMotion === 'function') ensureNpcMotion(ryan);
    if (typeof snapNpcToTile === 'function') snapNpcToTile(ryan);
}

function completeRyanIntro() {
    gameEvents._ryanIntroPlaying = false;
    gameEvents._ryanApproachPlaying = false;
    gameEvents.pendingRyanTour = false;
    gameEvents.pendingRyanDriveArrival = false;
    gameEvents.ryanTourComplete = true;
    gameEvents.ryanMentorActive = true;
    if (typeof beginStaffIntroTour === 'function') beginStaffIntroTour();
    if (gameEvents.timeMinutes > 660) gameEvents.timeMinutes = 540;
}

function beginRyanIntroDialogue() {
    gameEvents._ryanIntroPlaying = true;
    activeDialogue = getRyanWalkAroundLines();
    activeLine = 0;
    dName.innerText = 'RYAN';
    dText.innerText = activeDialogue[0];
    drawPortrait('RYAN');
    dContainer.style.display = 'flex';
}

function getRyanMentorHint() {
    const s = questState.step;

    if (s < 8) {
        if (s <= 1) return "Walk up to the customer's vehicle and check them in.";
        if (s === 2) return "Use your desk — CHECK IN — to write the RO.";
        if (s === 3) return "Take the RO to Mike on the drive for dispatch.";
        if (s === 4) return "Find the tech Mike assigned in the shop.";
        if (s === 5) return "Check your desk email. Mike wants you in his office.";
        if (s === 6) return "Mike's office is upstairs when you're ready.";
        if (s === 7) return "Look around the shop, parts, and drive before noon.";
    }

    if (gameEvents.currentDay === 2 && typeof isFredAppointmentActive === 'function' && isFredAppointmentActive()) {
        const ph = typeof getFredPhase === 'function' ? getFredPhase() : 'idle';
        if (ph === 'idle' || ph === 'checked_in') return "Fred's noon oil change — check in his Escape first.";
        if (ph === 'need_mike' || ph === 'at_vinnie') return "Fred's RO goes to Mike, then Vinnie in the shop.";
        if (ph === 'need_mike_help' || ph === 'need_bri') return "Vinnie won't touch it yet — Mike said get Bri to clean it.";
        if (ph === 'bri_cleaning' || ph === 'bri_done' || ph === 'vinnie_ready') return "Bri's on the detail — then send it back to Vinnie.";
        if (ph === 'vinnie_working') return "Vinnie's on the LOF. Fred should be happy soon.";
    }

    if (s >= 8) {
        if (gameEvents.isAfterHours) return "End your shift at the desk when you're done.";
        if (gameEvents.carWaitingForRO) return "Finish the RO at your desk, then see Mike.";
        if (gameEvents.pendingDispatch) return "Take that RO to Mike on the drive for dispatch.";
        if (gameEvents.dailyAptsCompleted < 3) {
            return "Next appointment — check in at the car, RO at desk, Mike dispatches.";
        }
        if (gameEvents.dailyWalkIn && !gameEvents.dailyWalkInDone) {
            return "Walk-in on the drive — same check-in flow as a regular guest.";
        }
        if (probation.active) {
            const day = typeof getProbationDayNumber === 'function' ? getProbationDayNumber() : '?';
            return "Probation day " + day + " — keep CSI up. Don't skip check-ins.";
        }
    }

    return "Check in at the car, write the RO at your desk, dispatch through Mike.";
}

function getRyanMentorDialogue() {
    const tips = [
        "Hold B while moving if you've got the running shoes.",
        "Whitney cares about CSI — prompt check-ins help everybody.",
        "If a tech refuses a car, talk to Mike. There's usually a workaround.",
        "The parking lot connects shop, showroom, and drive — learn the warps."
    ];
    const idx = (gameEvents.ryanHintIndex || 0) % tips.length;
    gameEvents.ryanHintIndex = idx + 1;
    return [
        "RYAN: " + getRyanMentorHint(),
        "RYAN: " + tips[idx]
    ];
}

function showRyanMentorHints() {
    activeDialogue = getRyanMentorDialogue();
    activeLine = 0;
    dName.innerText = 'RYAN';
    dText.innerText = activeDialogue[0];
    drawPortrait('RYAN');
    dContainer.style.display = 'flex';
}

function shouldPlayRyanWalkAroundBeat() {
    return questState.step >= 7
        && !!playerDetails.hasRunningShoes
        && !gameEvents.ryanTourComplete
        && !gameEvents._ryanIntroPlaying
        && !gameEvents._ryanApproachPlaying;
}

function armRyanWalkAroundAfterMikeOffice() {
    if (questState.step < 7 || !playerDetails.hasRunningShoes || gameEvents.ryanTourComplete) return;
    gameEvents.pendingRyanTour = true;
    gameEvents.pendingRyanDriveArrival = true;
}

function startRyanWalkAroundOnDrive() {
    if (!shouldPlayRyanWalkAroundBeat()) return;

    gameEvents._ryanApproachPlaying = true;
    if (typeof restoreDriveWhitneyToDesk === 'function') restoreDriveWhitneyToDesk();

    const ryan = maps.drive && maps.drive.npcs ? maps.drive.npcs.find(function (n) { return n.id === 'ryan'; }) : null;
    if (ryan) {
        ryan.hidden = false;
        var rtx = Math.max(1, player.tx - 1);
        var rty = Math.min(MAP_ROWS - 2, player.ty + 1);
        if (typeof isSolid === 'function' && isSolid(rtx, rty)) {
            rtx = player.tx;
            rty = Math.min(MAP_ROWS - 2, player.ty + 1);
        }
        ryan.tx = rtx;
        ryan.ty = rty;
        ryan.dir = rtx < player.tx ? 'right' : 'left';
        if (typeof ensureNpcMotion === 'function') ensureNpcMotion(ryan);
        if (typeof snapNpcToTile === 'function') snapNpcToTile(ryan);
    }
    player.dir = 'up';

    beginRyanIntroDialogue();
}

function tryTriggerRyanApproachAfterOfficeExit(attempt) {
    var tryNum = attempt || 0;
    if (currentMapKey !== 'drive') return;
    if (!shouldPlayRyanWalkAroundBeat()) return;
    if (typeof isCinematicActive === 'function' && isCinematicActive()) {
        if (tryNum < 30) setTimeout(function () { tryTriggerRyanApproachAfterOfficeExit(tryNum + 1); }, 200);
        return;
    }
    if (activeDialogue || gameState === 'MENU' || gameState === 'TRANSITION' || gameState === 'FLASH') {
        if (tryNum < 30) setTimeout(function () { tryTriggerRyanApproachAfterOfficeExit(tryNum + 1); }, 200);
        return;
    }
    startRyanWalkAroundOnDrive();
}

function onLeaveDrive() {
    if (gameEvents.ryanTourComplete) resetDriveRyanToDesk();
}

function onArriveDrive(fromMap) {
    if (currentMapKey !== 'drive') return;

    if (questState.step >= 7 && typeof restoreDriveWhitneyToDesk === 'function') {
        restoreDriveWhitneyToDesk();
    }

    if (gameEvents.ryanTourComplete) {
        if (fromMap && fromMap !== 'drive') resetDriveRyanToDesk();
        return;
    }

    if (shouldPlayRyanWalkAroundBeat()) {
        setTimeout(function () { tryTriggerRyanApproachAfterOfficeExit(0); }, 150);
        return;
    }

    if (fromMap && fromMap !== 'drive') resetDriveRyanToDesk();
}

function handleRyanInteract(npc) {
    if (!npc || npc.id !== 'ryan' || currentMapKey !== 'drive') return false;
    if (gameEvents._ryanApproachPlaying || (typeof isCinematicActive === 'function' && isCinematicActive())) return false;

    if (questState.step < 7) {
        activeDialogue = npc.dialogue && npc.dialogue.length
            ? npc.dialogue
            : ["I've been on hold with\nextended warranty for an hour."];
        activeLine = 0;
        dName.innerText = 'RYAN';
        dText.innerText = activeDialogue[0];
        drawPortrait('RYAN');
        dContainer.style.display = 'flex';
        return true;
    }

    if (shouldPlayRyanWalkAroundBeat()) {
        startRyanWalkAroundOnDrive();
        return true;
    }

    if (gameEvents.ryanTourComplete || gameEvents.ryanMentorActive || questState.step >= 7) {
        showRyanMentorHints();
        return true;
    }

    return false;
}

function onRyanDialogueFinished() {
    if (gameEvents._ryanIntroPlaying) {
        completeRyanIntro();
        return true;
    }
    return false;
}

window.handleRyanInteract = handleRyanInteract;
window.onRyanDialogueFinished = onRyanDialogueFinished;
window.beginRyanIntroDialogue = beginRyanIntroDialogue;
window.getRyanIntroLines = getRyanIntroLines;
window.getRyanWalkAroundLines = getRyanWalkAroundLines;
window.resetDriveRyanToDesk = resetDriveRyanToDesk;
window.onLeaveDrive = onLeaveDrive;
window.onArriveDrive = onArriveDrive;
window.tryTriggerRyanApproachAfterOfficeExit = tryTriggerRyanApproachAfterOfficeExit;
window.startRyanWalkAroundOnDrive = startRyanWalkAroundOnDrive;
window.armRyanWalkAroundAfterMikeOffice = armRyanWalkAroundAfterMikeOffice;
window.shouldPlayRyanWalkAroundBeat = shouldPlayRyanWalkAroundBeat;
