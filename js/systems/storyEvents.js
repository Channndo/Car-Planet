/* Daily probation story event manager — one beat per calendar day */

function ensureStoryEventState() {
    if (!probation.storyEventDays) probation.storyEventDays = [];
    if (!probation.storyEventDaysUsed) probation.storyEventDaysUsed = [];
    if (!probation.storyEventsPlayedIds) probation.storyEventsPlayedIds = [];
}

function shouldPlayStoryEventToday() {
    if (!probation.active || probation.outcome) return false;
    if (shouldRunDay2Meeting()) return false;
    if (gameEvents.inDay2Meeting || gameEvents.pendingDay2Meeting) return false;
    if (getProbationDayNumber() < 1) return false;
    return needsStoryEventToday();
}

function getEligibleStoryEvents(probationDay) {
    ensureStoryEventState();
    let pool = STORY_EVENTS.filter(ev => {
        const min = ev.minDay || 1;
        const max = ev.maxDay || PROBATION_DAYS;
        if (probationDay < min || probationDay > max) return false;
        return !probation.storyEventsPlayedIds.includes(ev.id);
    });
    if (!pool.length) {
        probation.storyEventsPlayedIds = [];
        pool = STORY_EVENTS.filter(ev => {
            const min = ev.minDay || 1;
            const max = ev.maxDay || PROBATION_DAYS;
            return probationDay >= min && probationDay <= max;
        });
    }
    return pool;
}

function pickStoryEventForToday() {
    const probationDay = getProbationDayNumber();
    const pool = getEligibleStoryEvents(probationDay);
    if (!pool.length) return null;

    let total = 0;
    pool.forEach(ev => { total += ev.weight || 1; });
    let roll = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        roll -= pool[i].weight || 1;
        if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
}

function formatStoryLine(line) {
    let text = line.text
        .replace(/\[PLAYER_NAME\]/g, playerDetails.name)
        .replace(/\[RIVAL_NAME\]/g, playerDetails.rivalName)
        .replace(/\[RO_PREV\]/g, String(questState.roNumber || 600000))
        .replace(/\[STRIKES\]/g, String(probation.strikes || 0))
        .replace(/\[CSI\]/g, String(probation.csiScore || 100));
    if (line.name === 'SYSTEM' || line.name === 'P.A.') {
        if (text.indexOf('[P.A.') === 0 || text.indexOf('[') === 0) return text;
        return text;
    }
    return line.name + ': "' + text + '"';
}

function buildStoryEventDialogue(event) {
    if (!event) return [];
    gameEvents.activeStoryEvent = event;
    const lines = event.lines.map(formatStoryLine);
    lines.push('[STORY_EVENT_END]');
    return lines;
}

function applyStoryEventEffects(event) {
    if (!event || !event.effects) return;
    const fx = event.effects;
    if (fx.csi) adjustCSI(fx.csi);
    if (fx.warning) addWarning(fx.warning);
    if (fx.strike) addStrike(fx.strike);
}

function completeStoryEvent() {
    const event = gameEvents.activeStoryEvent;
    if (!event) return;
    applyStoryEventEffects(event);
    ensureStoryEventState();
    const day = gameEvents.currentDay;
    if (!probation.storyEventDaysUsed.includes(day)) {
        probation.storyEventDaysUsed.push(day);
    }
    if (!probation.storyEventsPlayedIds.includes(event.id)) {
        probation.storyEventsPlayedIds.push(event.id);
    }
    gameEvents.activeStoryEvent = null;
}

function buildDayStartLinesWithStory() {
    const dayLines = buildDayStartLines();
    if (!shouldPlayStoryEventToday()) return dayLines;
    const event = pickStoryEventForToday();
    if (!event) {
        markStoryEventDaySkipped();
        return dayLines;
    }
    reserveStoryEventSlot(gameEvents.currentDay);
    return buildStoryEventDialogue(event).concat(dayLines);
}

function markStoryEventDaySkipped() {
    ensureStoryEventState();
    const day = gameEvents.currentDay;
    if (!probation.storyEventDaysUsed.includes(day)) {
        probation.storyEventDaysUsed.push(day);
    }
}

function applyDialogueSpeakerPortrait(line) {
    if (!line || line === '[STORY_EVENT_END]') return;
    if (line.indexOf('[P.A.') === 0 || line.indexOf('[P.A. SYSTEM]') === 0) {
        dName.innerText = 'SYSTEM';
        drawPortrait('NONE');
        return;
    }
    const speakers = [
        'MIKE', 'WHITNEY', 'RYAN', 'ZACK', 'BRONSON', 'VINNIE', 'JOE', 'JAKE', 'ADAM',
        'EJ', 'GUS', 'DAVE', 'JERRY', 'TROY', 'NICK', 'BRAD', 'JOHN', 'DAMONE'
    ];
    for (let i = 0; i < speakers.length; i++) {
        const s = speakers[i];
        if (line.indexOf(s + ':') === 0) {
            dName.innerText = s;
            drawPortrait(s);
            return;
        }
    }
    if (line.indexOf(playerDetails.rivalName + ':') === 0 || line.indexOf('KASEY:') === 0) {
        dName.innerText = playerDetails.rivalName;
        drawPortrait('RIVAL');
        return;
    }
    if (line.indexOf('FRED:') === 0 || line.indexOf('FRED NANDERS:') === 0) {
        dName.innerText = 'FRED NANDERS';
        const guest = typeof getDriveGuestNpc === 'function' ? getDriveGuestNpc() : null;
        if (typeof setPortraitSubject === 'function') setPortraitSubject(guest);
        if (typeof drawGuestPortrait === 'function') drawGuestPortrait(guest);
        else drawPortrait('FRED_NANDERS');
        return;
    }
    const driveGuest = typeof getDriveGuestNpc === 'function' ? getDriveGuestNpc() : null;
    if (driveGuest && line.indexOf(driveGuest.name + ':') === 0) {
        dName.innerText = driveGuest.name;
        if (typeof setPortraitSubject === 'function') setPortraitSubject(driveGuest);
        if (typeof drawGuestPortrait === 'function') drawGuestPortrait(driveGuest);
        return;
    }
    if (line.indexOf('SHIFT REPORT') === 0 || line.indexOf('FINAL PROBATION') === 0 || line.indexOf('Day ') === 0) {
        dName.innerText = 'SYSTEM';
        drawPortrait('NONE');
    }
}

window.buildDayStartLinesWithStory = buildDayStartLinesWithStory;
window.completeStoryEvent = completeStoryEvent;
window.applyDialogueSpeakerPortrait = applyDialogueSpeakerPortrait;
