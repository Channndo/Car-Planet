/* Tutorial beats — post-Bronson office page via drive intercom */

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

window.triggerMikeOfficePage = triggerMikeOfficePage;
window.checkMikeOfficePageOnDrive = checkMikeOfficePageOnDrive;
window.tryTriggerMikeOfficePageOnDrive = tryTriggerMikeOfficePageOnDrive;
window.completeMikeOfficePageIfNeeded = completeMikeOfficePageIfNeeded;
