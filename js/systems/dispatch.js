/* Dispatch — Mike assigns ROs to shop techs by job type and bay availability */

const DISPATCH_TECH = {
    VINNIE: 'VINNIE',
    BRONSON: 'BRONSON',
    JOE: 'JOE',
    RIVAL: 'RIVAL',
};

function getActiveJobText() {
    if (gameEvents._activeJobComplaint) return String(gameEvents._activeJobComplaint).toLowerCase();
    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    if (visit && visit.complaint) return String(visit.complaint).toLowerCase();
    if (visit && visit.customer && visit.customer.complaintPool) {
        return visit.customer.complaintPool.join(' ').toLowerCase();
    }
    return '';
}

function ensureVisitComplaint(visit) {
    if (!visit || !visit.customer || !visit.customer.complaintPool || !visit.customer.complaintPool.length) {
        return '';
    }
    if (visit.complaint) {
        gameEvents._activeJobComplaint = visit.complaint;
        return visit.complaint;
    }
    const complaint = visit.customer.complaintPool[Math.floor(Math.random() * visit.customer.complaintPool.length)];
    visit.complaint = complaint;
    gameEvents._activeJobComplaint = complaint;

    if (gameEvents.dailySchedule) {
        if (visit.type === 'appointment' && gameEvents.dailyAptsCompleted < 3) {
            const apt = gameEvents.dailySchedule.appointments[gameEvents.dailyAptsCompleted];
            if (apt) apt.complaint = complaint;
        } else if (visit.type === 'walkin') {
            gameEvents.dailySchedule.walkInComplaint = complaint;
        }
    }
    return complaint;
}

function classifyJob(jobText) {
    const t = (jobText || '').toLowerCase();
    if (/warranty|recall|manufacturer|tsb|extended warranty|company pays|fleet vehicle/.test(t)) return 'warranty';
    if (/oil change|lof|rotation|tire rotation|filter|maintenance package|wiper|headlight|inspection|coupon|30k service|tire pressure|synthetic oil|annual maintenance|scheduled maintenance|oil if you can|routine oil|needs inspection|first service on new lease/.test(t)) {
        return 'easy';
    }
    if (/suspension|strut|shock|alignment|pothole|steering wheel|steering feels|clicking when i turn|click when i turn|vibration at highway|brake pad|brakes squeal|brake pedal pulses|squeak from rear|grinding brake/.test(t)) {
        return 'suspension';
    }
    if (/engine|transmission|knock|misfire|head gasket|exhaust|alternator|starter|diesel|diff whine|cel|check engine|sluggish|power window|4x4 not|trailer wiring|rear diff|transmission feels|battery died|battery warranty/.test(t)) {
        return 'engine';
    }
    return 'general';
}

function isBronsonBayOccupied() {
    if (!maps.shop || !maps.shop.npcs) return false;
    const shopCar = maps.shop.npcs.find(n => n.id === 'shop_car');
    return !!(shopCar && !shopCar.hidden);
}

function isTechBusy(techCode) {
    if (techCode === 'BRONSON' && isBronsonBayOccupied()) return true;
    if (gameEvents.techBayBusy && gameEvents.techBayBusy[techCode]) return true;
    return false;
}

function pickTechForJob(jobType) {
    let candidates = [];

    if (jobType === 'warranty') {
        candidates = ['JOE'];
    } else if (jobType === 'easy') {
        candidates = ['VINNIE'];
    } else if (jobType === 'suspension') {
        candidates = ['BRONSON', 'RIVAL', 'JOE'];
    } else if (jobType === 'engine') {
        candidates = Math.random() < 0.7 ? ['BRONSON', 'RIVAL', 'JOE'] : ['RIVAL', 'BRONSON', 'JOE'];
    } else {
        candidates = ['RIVAL', 'VINNIE', 'JOE', 'BRONSON'];
    }

    for (let i = 0; i < candidates.length; i++) {
        if (!isTechBusy(candidates[i])) return candidates[i];
    }

    if (jobType === 'easy') return 'VINNIE';
    if (jobType === 'warranty') return 'JOE';
    return 'RIVAL';
}

function techDisplayName(code) {
    if (code === 'BRONSON') return 'Bronson';
    if (code === 'VINNIE') return 'Vinnie';
    if (code === 'JOE') return 'Joe';
    if (code === 'RIVAL') return playerDetails.rivalName || 'Kasey';
    return code;
}

function buildMikeDispatchDialogue(jobText, jobType, tech, guestName) {
    const name = guestName || 'your guest';
    const techName = techDisplayName(tech);
    const lines = ['MIKE: RO #' + questState.roNumber + ' for\n' + name + '?'];

    if (jobType === 'warranty') {
        lines.push("MIKE: Warranty work goes to Joe.\nThat's the rule.");
    } else if (jobType === 'easy') {
        lines.push("MIKE: Quick job — Vinnie's bay.\nIn and out.");
    } else if (jobType === 'suspension') {
        if (tech === 'BRONSON') {
            lines.push("MIKE: Suspension noise.\nBronson gets this one.");
        } else if (isBronsonBayOccupied()) {
            lines.push("MIKE: Bronson's tied up on Hughes'\nExplorer engine job.");
            lines.push("MIKE: " + techName + " can handle\nthis suspension RO.");
        } else {
            lines.push("MIKE: Send it to " + techName + "'s bay.");
        }
    } else if (jobType === 'engine') {
        if (tech === 'BRONSON') {
            lines.push("MIKE: Engine work — Bronson.\nVinnie won't touch it.");
        } else if (isBronsonBayOccupied()) {
            lines.push("MIKE: Bronson's buried on the Hughes\nExplorer already.");
            lines.push("MIKE: Put this one with " + techName + '.');
        } else {
            lines.push("MIKE: Heavy line — " + techName + "'s bay.");
        }
    } else if (tech === 'RIVAL') {
        lines.push("MIKE: " + techName + " gets this one.\nNo oil change — he's good.");
    } else {
        lines.push("MIKE: Send it to " + techName + "'s bay.");
    }

    lines.push('MIKE: Good. Keep the lane moving.');
    return lines;
}

function assignMikeDispatch(options) {
    options = options || {};
    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    if (!options.jobText && visit) ensureVisitComplaint(visit);

    const jobText = (options.jobText || getActiveJobText() || '').toLowerCase();
    const jobType = options.forcedType || classifyJob(jobText);
    const tech = options.forcedTech || pickTechForJob(jobType);
    const guest = options.guestName ||
        (visit && visit.customer && visit.customer.name) ||
        (maps.drive && maps.drive.npcs.find(n => n.id === 'angry_customer' && !n.hidden) || {}).name ||
        'your guest';

    questState.talkedToMike = true;
    questState.assignedTo = tech;

    if (options.dialogue) {
        activeDialogue = options.dialogue;
    } else if (options.tutorialHughes) {
        activeDialogue = [
            'MIKE: An engine knocking?\nSounds heavy.',
            "MIKE: Vinnie won't touch engine work.\nGive it to Bronson."
        ];
        questState.assignedTo = 'BRONSON';
    } else {
        activeDialogue = buildMikeDispatchDialogue(jobText, jobType, tech, guest);
    }

    return questState.assignedTo;
}

function tryMikeDailyDispatchDialogue() {
    if (questState.step < 8 || !gameEvents.pendingDispatch) return false;

    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    ensureVisitComplaint(visit);
    assignMikeDispatch({});
    gameEvents._mikeDispatchDialogueActive = true;
    dName.innerText = 'MIKE';
    return true;
}

function finishDailyDispatch(type) {
    const dispatchType = type || gameEvents.pendingDispatch;
    gameEvents.pendingDispatch = false;
    gameEvents._mikeDispatchDialogueActive = false;
    gameEvents._activeJobComplaint = null;
    questState.talkedToMike = false;
    questState.assignedTo = null;

    if (typeof hideDriveCustomerSlots === 'function') hideDriveCustomerSlots();

    if (dispatchType === 'daily') {
        gameEvents.dailyAptsCompleted = (gameEvents.dailyAptsCompleted || 0) + 1;
        if (typeof recordProbationRO === 'function') recordProbationRO();

        if (gameEvents.dailyAptsCompleted < 3) {
            if (typeof spawnCurrentDriveCustomer === 'function') spawnCurrentDriveCustomer();
            activeDialogue = [
                '[P.A. SYSTEM]\n' + playerDetails.name + ' to the service drive,\nguest is waiting.'
            ];
        } else if (gameEvents.dailyWalkIn && !gameEvents.dailyWalkInDone) {
            if (typeof spawnCurrentDriveCustomer === 'function') spawnCurrentDriveCustomer();
            activeDialogue = [
                'Another car just pulled up.\nIt\'s a walk-in!',
                '[P.A. SYSTEM]\n' + playerDetails.name + ' to the service drive,\nguest is waiting.'
            ];
        } else {
            activeDialogue = [
                'That\'s the last RO for today.',
                'End your shift at your computer.'
            ];
        }
    } else if (dispatchType === 'walkin') {
        gameEvents.dailyWalkInDone = true;
        if (typeof recordProbationRO === 'function') recordProbationRO();
        activeDialogue = [
            'Walk-in dispatched to the shop.',
            'The drive is empty.\nClock out when you\'re ready.'
        ];
    } else {
        activeDialogue = ['Dispatched.'];
    }

    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}

function completeMikeDailyDispatchIfNeeded() {
    if (!gameEvents._mikeDispatchDialogueActive || !gameEvents.pendingDispatch) return false;
    finishDailyDispatch(gameEvents.pendingDispatch);
    return true;
}

function techAssignedToSpeaker() {
    if (!questState.assignedTo) return false;
    if (questState.assignedTo === dName.innerText) return true;
    if (questState.assignedTo === 'RIVAL' && dName.innerText === (playerDetails.rivalName || 'KASEY')) return true;
    return false;
}

window.techAssignedToSpeaker = techAssignedToSpeaker;
window.finishDailyDispatch = finishDailyDispatch;
window.completeMikeDailyDispatchIfNeeded = completeMikeDailyDispatchIfNeeded;
window.assignMikeDispatch = assignMikeDispatch;
window.classifyJob = classifyJob;
window.ensureVisitComplaint = ensureVisitComplaint;
