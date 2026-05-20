/* Tutorial beats — post-Bronson office page, Whitney check-in, etc. */

let whitneyTutorialSaved = null;
const WHITNEY_DRIVE_DESK = { tx: 7, ty: 11, dir: 'down' };

function restoreDriveWhitneyToDesk() {
    const whit = maps.drive && maps.drive.npcs ? maps.drive.npcs.find(n => n.id === 'whitney') : null;
    if (!whit) return;
    whit.hidden = false;
    whit.tx = WHITNEY_DRIVE_DESK.tx;
    whit.ty = WHITNEY_DRIVE_DESK.ty;
    whit.dir = WHITNEY_DRIVE_DESK.dir;
    if (typeof ensureNpcMotion === 'function') ensureNpcMotion(whit);
    if (typeof snapNpcToTile === 'function') snapNpcToTile(whit);
}

function startWhitneyCheckInTutorial() {
    gameEvents.inWhitneyCheckInTutorial = true;
    const whit = maps.drive && maps.drive.npcs ? maps.drive.npcs.find(n => n.id === 'whitney') : null;
    if (whit) {
        whitneyTutorialSaved = { tx: whit.tx, ty: whit.ty, dir: whit.dir || 'down' };
        whit.tx = 5;
        whit.ty = 5;
        whit.dir = 'left';
    }
    activeDialogue = [
        "WHITNEY: Hey. I'm going to show you how\nto do this since no one else\naround here will.",
        "WHITNEY: Walk up to the customer's vehicle\nand face it. Press the action button.",
        "WHITNEY: When it asks to check the\nvehicle in, say YES.",
        "WHITNEY: Then go to YOUR DESK and\nwrite the repair order.",
        "WHITNEY: After that, take the RO to Mike.\nDon't mess up my CSI."
    ];
    activeLine = 0;
    dName.innerText = 'WHITNEY';
    dText.innerText = activeDialogue[0];
    drawPortrait('WHITNEY');
    dContainer.style.display = 'flex';
}

function completeWhitneyCheckInTutorial() {
    const whit = maps.drive && maps.drive.npcs ? maps.drive.npcs.find(n => n.id === 'whitney') : null;
    if (whit && whitneyTutorialSaved) {
        whit.tx = whitneyTutorialSaved.tx;
        whit.ty = whitneyTutorialSaved.ty;
        whit.dir = whitneyTutorialSaved.dir;
        whitneyTutorialSaved = null;
        if (typeof snapNpcToTile === 'function') snapNpcToTile(whit);
    }
    gameEvents.whitneyCheckInTutorialDone = true;
    questState.step = 1;
}

function triggerMikeOfficePage() {
    if (!gameEvents.pendingMikeOfficePage || questState.step !== 5) return false;
    if (activeDialogue || gameState === 'MENU' || gameState === 'TRANSITION' || gameState === 'FLASH') return false;

    gameEvents.pendingMikeOfficePage = false;
    gameEvents.mikeOfficePageActive = true;

    activeDialogue = [
        '[P.A. SYSTEM]\n' + playerDetails.name + ', please come\nto Mike\'s office.'
    ];
    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
    return true;
}

function checkMikeOfficePageOnDrive() {
    if (currentMapKey !== 'drive') return;
    if (!gameEvents.pendingMikeOfficePage || questState.step !== 5) return;
    triggerMikeOfficePage();
}

function tryTriggerMikeOfficePageOnDrive() {
    setTimeout(checkMikeOfficePageOnDrive, 200);
}

function completeMikeOfficePageIfNeeded() {
    if (!gameEvents.mikeOfficePageActive) return false;
    gameEvents.mikeOfficePageActive = false;
    if (questState.step === 5) questState.step = 6;
    return true;
}

window.startWhitneyCheckInTutorial = startWhitneyCheckInTutorial;
window.completeWhitneyCheckInTutorial = completeWhitneyCheckInTutorial;
window.restoreDriveWhitneyToDesk = restoreDriveWhitneyToDesk;
window.triggerMikeOfficePage = triggerMikeOfficePage;
window.checkMikeOfficePageOnDrive = checkMikeOfficePageOnDrive;
window.tryTriggerMikeOfficePageOnDrive = tryTriggerMikeOfficePageOnDrive;
window.completeMikeOfficePageIfNeeded = completeMikeOfficePageIfNeeded;
