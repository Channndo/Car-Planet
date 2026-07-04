/* Day 2 morning advisors meeting + probation kickoff */

let day2MeetingPhase = 'idle'; // idle | pa | office | done
let day2OfficeLineIndex = 0;

function showOfficeTeamForMeeting() {
    const oryan = maps.office.npcs.find(n => n.id === 'office_ryan');
    const ozack = maps.office.npcs.find(n => n.id === 'office_zack');
    const owhit = maps.office.npcs.find(n => n.id === 'office_whitney');
    const omike = maps.office.npcs.find(n => n.id === 'mike');
    if (oryan) oryan.hidden = false;
    if (ozack) ozack.hidden = false;
    if (owhit) owhit.hidden = false;
    if (omike) omike.hidden = false;
    const dm = maps.drive.npcs.find(n => n.id === 'mike');
    if (dm) dm.hidden = true;
}

function hideOfficeTeamAfterMeeting() {
    ['office_ryan', 'office_zack', 'office_whitney'].forEach(id => {
        const n = maps.office.npcs.find(npc => npc.id === id);
        if (n) n.hidden = true;
    });
}

function getDay2OfficeScript() {
    const pname = playerDetails.name;
    return [
        { name: 'MIKE', portrait: 'MIKE', text: "Morning, everyone. Grab a seat.\nWe're going over CSR scores\nand fixed-ops metrics." },
        { name: 'MIKE', portrait: 'MIKE', text: "Customer satisfaction is down.\nComebacks are up. CSI targets\nare not optional this month." },
        { name: 'WHITNEY', portrait: 'WHITNEY', text: "My survey scores took a hit\nwhen that oil change ran long." },
        { name: 'RYAN', portrait: 'RYAN', text: "Extended warranty calls are\neating my follow-up time." },
        { name: 'ZACK', portrait: 'ZACK', text: "Parts delays are making us\nlook bad in front of guests." },
        { name: 'MIKE', portrait: 'MIKE', text: pname + ", listen up.\nThis is the standard for everyone." },
        { name: 'MIKE', portrait: 'MIKE', text: "I'm gonna give you everything\nyou need to succeed here.\nI think you can do great." },
        { name: 'MIKE', portrait: 'MIKE', text: "Today begins your 90 day\nprobation period. Then I'll decide\nif I'm gonna keep you around." },
        { name: 'MIKE', portrait: 'MIKE', text: "Until then, if you need anything\nat all don't hesitate to ask.\nI'm here to help you win." }
    ];
}

function playDay2OfficeLine(index) {
    const script = getDay2OfficeScript();
    const line = script[index];
    if (!line) return;
    activeDialogue = script.map(l => l.text);
    activeLine = index;
    dName.innerText = line.name;
    dText.innerText = line.text;
    drawPortrait(line.portrait);
    dContainer.style.display = 'flex';
}

function buildDayStartLines() {
    return gameEvents.dailyWalkIn
        ? [
            'Day ' + gameEvents.currentDay + ' begins.\nYou have 3 appointments.',
            'Expect a walk-in later.',
            '[P.A. SYSTEM]\n' + playerDetails.name + ' to the service drive,\nguest is waiting.'
        ]
        : [
            'Day ' + gameEvents.currentDay + ' begins.\nYou have 3 appointments.',
            '[P.A. SYSTEM]\n' + playerDetails.name + ' to the service drive,\nguest is waiting.'
        ];
}

function beginStandardWorkDayDialogue() {
    resetDriveCustomersForNewDay();
    syncDriveDailyCustomers();
    activeDialogue = buildDayStartLinesWithStory();
    activeLine = 0;
    dName.innerText = "SYSTEM";
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}

function resetDriveCustomersForNewDay() {
    if (questState.step >= 8) {
        spawnCurrentDriveCustomer();
    }
}

function resetNpcsForNewDay() {
    Object.values(maps).forEach(m => {
        m.npcs.forEach(n => {
            n.hidden = false;
            if (n.id === 'customer_car' || n.id === 'angry_customer' || n.id === 'shop_car') n.hidden = true;
            if (n.id === 'mike' && m === maps.office) n.hidden = false;
            if (n.id === 'mike' && m === maps.drive) n.hidden = true;
            if (n.id === 'zack_cust' || n.id === 'zack_car') n.hidden = true;
            if (n.id.startsWith('office_')) n.hidden = true;
            /* tour-path Ryan placeholders live hidden on non-drive maps */
            if (n.id === 'ryan' && m !== maps.drive) n.hidden = true;
        });
    });
    if (typeof resetDriveRyanToDesk === 'function') resetDriveRyanToDesk();
}

function applyEndOfShiftDayRollover() {
    gameEvents.currentDay = (gameEvents.currentDay || 1) + 1;
    gameEvents.dailyAptsCompleted = 0;
    gameEvents.dailyWalkInDone = false;
    gameEvents.timeMinutes = 420;
    gameEvents.tick = 0;
    gameEvents.isAfterHours = false;
    gameEvents.meeting = false;
    gameEvents.zackComeback = false;
    gameEvents.lightsOut = false;
    gameEvents.carWaitingForRO = false;
    gameEvents.fredStoryActive = false;
    gameEvents.fredStoryComplete = false;
    gameEvents.fredStoryPhase = 'idle';
    if (typeof clearFredTimer === 'function') clearFredTimer();
    questState.step = 8;
    resetNpcsForNewDay();
    gameEvents.dailySchedule = null;
    if (!(gameEvents.currentDay === 2 && !probation.day2MeetingComplete)) {
        generateDailyCustomerSchedule();
    }
    onProbationWeekRollover();
}

function teleportToOfficeForDay2Meeting() {
    gameState = 'TRANSITION';
    transition.active = true;
    transition.alpha = 0;
    transition.state = 'fade_out';
    transition.dest = { to: 'office', px: 9, py: 8, isDay2Meeting: true };
    dContainer.style.display = 'none';
    activeDialogue = null;
}

function startDay2MorningMeeting() {
    if (!shouldRunDay2Meeting() || day2MeetingPhase !== 'idle') return;
    day2MeetingPhase = 'pa';
    gameEvents.inDay2Meeting = true;
    activeDialogue = [
        "[P.A. SYSTEM]\nMandatory advisor meeting\nin Mike's office. 7:00 AM sharp."
    ];
    activeLine = 0;
    dName.innerText = "SYSTEM";
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}

function beginDay2OfficeDialogue() {
    day2MeetingPhase = 'office';
    day2OfficeLineIndex = 0;
    player.dir = 'up';
    showOfficeTeamForMeeting();
    playDay2OfficeLine(0);
}

function advanceDay2OfficeDialogue() {
    const script = getDay2OfficeScript();
    day2OfficeLineIndex++;
    if (day2OfficeLineIndex < script.length) {
        playDay2OfficeLine(day2OfficeLineIndex);
        return true;
    }
    return false;
}

function completeDay2MeetingAndReleaseToDrive() {
    day2MeetingPhase = 'done';
    gameEvents.inDay2Meeting = false;
    activateProbation();
    hideOfficeTeamAfterMeeting();

    gameState = 'TRANSITION';
    transition.active = true;
    transition.alpha = 0;
    transition.state = 'fade_out';
    transition.dest = { to: 'drive', px: 9, py: 8, afterDay2Meeting: true };
    dContainer.style.display = 'none';
    activeDialogue = null;
}

function onAfterDay2MeetingArriveDrive() {
    gameEvents.timeMinutes = 450;
    generateDailyCustomerSchedule();
    beginStandardWorkDayDialogue();
}

function tryStartDay2MeetingAfterFlash() {
    if (gameEvents.pendingDay2Meeting) {
        gameEvents.pendingDay2Meeting = false;
        startDay2MorningMeeting();
        return true;
    }
    return false;
}

function maybeResumeDay2MeetingOnLoad() {
    if (shouldRunDay2Meeting() && gameState === 'PLAYING') {
        setTimeout(() => startDay2MorningMeeting(), 400);
    }
}
