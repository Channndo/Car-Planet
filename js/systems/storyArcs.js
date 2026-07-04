/* Unique story-arc engine — generalizes the Fred Nanders phase machine.
   Data lives in js/data/story-arcs.js (STORY_ARCS, PROBATION_MILESTONES).
   Arc state is saved on gameEvents.storyArc:
     { arcId, day, stepIndex, phase: 'idle'|'checked_in'|'steps'|'done', timerUntil } */

const ARC_APPT_INDEX = 1; /* arcs always take the noon slot */

function arcFormat(text) {
    if (!text) return text;
    return text
        .replace(/\[PLAYER_NAME\]/g, playerDetails.name)
        .replace(/\[RIVAL_NAME\]/g, playerDetails.rivalName)
        .replace(/\[CSI\]/g, String(probation.csiScore || 100))
        .replace(/\[ROS\]/g, String(probation.serviceROs || 0))
        .replace(/\[ROS_LEFT\]/g, String(Math.max(0, PROBATION_MIN_ROS_PASS - (probation.serviceROs || 0))));
}

function ensureArcSaveState() {
    if (!probation.storyArcsDone) probation.storyArcsDone = [];
}

function getArcById(id) {
    for (let i = 0; i < STORY_ARCS.length; i++) {
        if (STORY_ARCS[i].id === id) return STORY_ARCS[i];
    }
    return null;
}

/** Next unfinished arc whose scheduled probation day has arrived (missed arcs roll forward). */
function getStoryArcForToday() {
    if (!probation.active || probation.outcome) return null;
    if (typeof getProbationDayNumber !== 'function') return null;
    const pd = getProbationDayNumber();
    if (pd < 1) return null;
    ensureArcSaveState();
    for (let i = 0; i < STORY_ARCS.length; i++) {
        const a = STORY_ARCS[i];
        if (a.probationDay <= pd && probation.storyArcsDone.indexOf(a.id) === -1) return a;
    }
    return null;
}

function getActiveArcState() {
    const s = gameEvents.storyArc;
    if (!s || s.day !== gameEvents.currentDay) return null;
    return s;
}

function getActiveArc() {
    const s = getActiveArcState();
    return s ? getArcById(s.arcId) : null;
}

function getArcPhase() {
    const s = getActiveArcState();
    return s ? s.phase : null;
}

function setArcPhase(phase) {
    const s = getActiveArcState();
    if (s) s.phase = phase;
}

function isArcAppointmentActive() {
    const s = getActiveArcState();
    if (!s || s.phase === 'done') return false;
    return gameEvents.dailyAptsCompleted === ARC_APPT_INDEX;
}

function isArcInProgress() {
    const s = getActiveArcState();
    return !!s && isArcAppointmentActive() && s.phase !== 'idle' && s.phase !== 'done';
}

/** Build the arc guest from the core roster with the arc's concern locked in. */
function buildArcCustomer(arc) {
    const base = getCoreCustomerById(arc.customerId);
    const c = JSON.parse(JSON.stringify(base));
    c.storyId = arc.id;
    c.complaintPool = [arc.concern];
    return c;
}

/** Void any stale open story-arc RO left over from an interrupted day. */
function voidStaleArcOrders() {
    if (!gameEvents.dmsOrders) return;
    gameEvents.dmsOrders.forEach(function (o) {
        if (o.storyId && o.storyId !== 'fred_oil_change_day2' &&
            o.status !== 'closed' && o.calendarDay < gameEvents.currentDay) {
            o.status = 'closed';
            o.closedAtMinutes = 1080;
        }
    });
}

function initArcStateForToday(arc) {
    voidStaleArcOrders();
    gameEvents.storyArc = {
        arcId: arc.id,
        day: gameEvents.currentDay,
        stepIndex: -1,
        phase: 'idle',
        timerUntil: null
    };
}

function getArcOrder(arc) {
    if (!gameEvents.dmsOrders) return null;
    for (let i = gameEvents.dmsOrders.length - 1; i >= 0; i--) {
        const o = gameEvents.dmsOrders[i];
        if (o.storyId === arc.id && o.calendarDay === gameEvents.currentDay) return o;
    }
    return null;
}

/** Keeps DMS from auto-closing a story RO that is still being worked. */
function isStoryRoStillOpen(order) {
    if (!order || !order.storyId) return false;
    if (order.storyId === 'fred_oil_change_day2') {
        return gameEvents.currentDay === 2 && !gameEvents.fredStoryComplete;
    }
    const s = getActiveArcState();
    return !!s && s.arcId === order.storyId && s.phase !== 'done';
}

/* ——— check-in / RO hooks (called from dialogue.js + dms.js) ——— */

function onArcCheckInConfirmed() {
    gameEvents.carWaitingForRO = 'story_arc';
    setArcPhase('checked_in');
    if (typeof registerVehicleCheckIn === 'function') registerVehicleCheckIn('story_arc');
    activeDialogue = ['Vehicle checked in.\nGo to your computer to write the RO.'];
    activeLine = 0;
    dText.innerText = activeDialogue[0];
    dName.innerText = 'SYSTEM';
    drawPortrait('NONE');
}

function onArcRoPrinted() {
    const s = getActiveArcState();
    if (!s) return;
    s.phase = 'steps';
    s.stepIndex = 0;
}

/* ——— dialogue resolution ——— */

function arcGuestNpc() {
    return maps.drive.npcs.find(function (n) { return n.id === 'angry_customer'; }) || null;
}

function showArcStepAdvanceSideEffects(arc, step) {
    if (step.assignTech) {
        questState.talkedToMike = true;
        questState.assignedTo = step.assignTech;
        const o = getArcOrder(arc);
        if (o && typeof setDmsOrderStatus === 'function') {
            setDmsOrderStatus(o.id, 'dispatched', { tech: step.assignTech });
        }
    }
}

function enterArcStep(arc, state) {
    const step = arc.steps[state.stepIndex];
    if (!step) return;
    if (step.type === 'timer') {
        state.timerUntil = gameEvents.timeMinutes + (step.minutes || 15);
        const o = getArcOrder(arc);
        if (o && o.status !== 'closed' && typeof setDmsOrderStatus === 'function') {
            setDmsOrderStatus(o.id, 'in_shop');
        }
    }
}

function resolveArcNpcDialogue(npc) {
    const state = getActiveArcState();
    if (!state || !npc) return false;
    const arc = getArcById(state.arcId);
    if (!arc) return false;
    if (!isArcAppointmentActive()) return false;

    const apt = gameEvents.dailySchedule && gameEvents.dailySchedule.appointments
        ? gameEvents.dailySchedule.appointments[ARC_APPT_INDEX] : null;
    const guestName = apt ? apt.customer.name : 'GUEST';

    /* The guest on the drive */
    if (npc.id === 'angry_customer' && currentMapKey === 'drive') {
        if (state.phase === 'idle') {
            activeDialogue = arc.guestIntro.map(arcFormat);
        } else if (state.phase === 'checked_in') {
            activeDialogue = ["You've got my keys.\nGo write it up!"];
        } else {
            activeDialogue = (arc.guestWaiting || ['Just waiting on my car.']).map(arcFormat);
        }
        dName.innerText = guestName;
        return true;
    }

    /* The guest's vehicle */
    if (npc.id === 'customer_car' && currentMapKey === 'drive') {
        if (state.phase === 'idle') {
            const veh = apt && apt.customer.vehicle ? formatVehicleLabel(apt.customer.vehicle) : 'The vehicle';
            activeDialogue = [veh + '.\n' + arcFormat(arc.concern), '[CHOICE_CHECKIN_DAILY]'];
            dName.innerText = veh.toUpperCase();
            return true;
        }
        activeDialogue = ['Already checked in.\nFinish the RO at your desk.'];
        dName.innerText = 'SYSTEM';
        return true;
    }

    if (state.phase !== 'steps') return false;
    const step = arc.steps[state.stepIndex];
    if (!step) return false;

    if (step.type === 'talk') {
        const okMap = !step.maps || step.maps.indexOf(currentMapKey) !== -1;
        if (npc.id === step.npc && okMap) {
            activeDialogue = step.lines.map(arcFormat);
            dName.innerText = step.name === 'RIVAL' ? playerDetails.rivalName : step.name;
            showArcStepAdvanceSideEffects(arc, step);
            state.stepIndex++;
            enterArcStep(arc, state);
            return true;
        }
        return false;
    }

    if (step.type === 'timer') {
        if (step.busy && npc.id === step.busy.npc &&
            (!step.busy.maps || step.busy.maps.indexOf(currentMapKey) !== -1)) {
            activeDialogue = step.busy.lines.map(arcFormat);
            dName.innerText = step.busy.name === 'RIVAL' ? playerDetails.rivalName : (step.busy.name || npc.name);
            return true;
        }
        if (npc.id === 'desk' && currentMapKey === 'drive') {
            const left = Math.max(1, (state.timerUntil || gameEvents.timeMinutes) - gameEvents.timeMinutes);
            activeDialogue = [arcFormat(step.deskLine || 'RO in progress.') + '\nAbout ' + left + ' min left.'];
            dName.innerText = 'SYSTEM';
            return true;
        }
    }

    return false;
}

/* ——— per-frame tick ——— */

function completeActiveArc(arc, state) {
    state.phase = 'done';
    state.timerUntil = null;
    ensureArcSaveState();
    if (probation.storyArcsDone.indexOf(arc.id) === -1) probation.storyArcsDone.push(arc.id);

    gameEvents.carWaitingForRO = false;
    gameEvents.dailyAptsCompleted++;

    const o = getArcOrder(arc);
    if (o && o.status !== 'closed' && typeof setDmsOrderStatus === 'function') {
        setDmsOrderStatus(o.id, 'closed');
    }
    if (typeof recordProbationRO === 'function') recordProbationRO();
    if (arc.completion && arc.completion.csi && typeof adjustCSI === 'function') {
        adjustCSI(arc.completion.csi);
    }

    const apt = gameEvents.dailySchedule && gameEvents.dailySchedule.appointments
        ? gameEvents.dailySchedule.appointments[ARC_APPT_INDEX] : null;
    const guestName = apt ? apt.customer.name : 'GUEST';

    hideDriveCustomerSlots();
    const cust = arcGuestNpc();
    if (cust) {
        cust.hidden = false;
        cust.dialogue = (arc.completion.guestAfter || ['Thanks for the help!']).map(arcFormat);
    }

    const lastStep = arc.steps[arc.steps.length - 1];
    let lines = [];
    if (lastStep && lastStep.pa) lines.push('[P.A. SYSTEM]\n' + arcFormat(lastStep.pa));
    lines = lines.concat((arc.completion.lines || []).map(arcFormat));

    if (typeof playMusicJingle === 'function') playMusicJingle('fanfare');
    else if (typeof playStoryChime === 'function') playStoryChime();

    activeDialogue = lines;
    activeLine = 0;
    dName.innerText = guestName;
    dText.innerText = activeDialogue[0];
    if (typeof setPortraitSubject === 'function') setPortraitSubject(cust);
    if (typeof drawGuestPortrait === 'function') drawGuestPortrait(cust);
    dContainer.style.display = 'flex';
}

function announceArcPa(message) {
    if (typeof playIntercomPing === 'function') playIntercomPing();
    activeDialogue = ['[P.A. SYSTEM]\n' + arcFormat(message)];
    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}

function tickStoryArcs() {
    const state = getActiveArcState();
    if (!state || state.phase !== 'steps') return;
    const arc = getArcById(state.arcId);
    if (!arc) return;
    const step = arc.steps[state.stepIndex];
    if (!step || step.type !== 'timer' || !state.timerUntil) return;
    if (gameEvents.timeMinutes < state.timerUntil) return;

    if (state.stepIndex >= arc.steps.length - 1) {
        completeActiveArc(arc, state);
        return;
    }
    const finishedPa = step.pa;
    state.timerUntil = null;
    state.stepIndex++;
    enterArcStep(arc, state);
    if (finishedPa) announceArcPa(finishedPa);
}

/** Spawn scheduled guests (morning 7:30, noon, 3 PM) as their time arrives — any day. */
function tickScheduledAppointments() {
    if (questState.step < 8 || gameEvents.isAfterHours || !gameEvents.dailySchedule) return;
    if (gameEvents.carWaitingForRO || gameEvents.pendingDispatch) return;
    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    if (!visit || !visit.customer) return;
    const cust = maps.drive.npcs.find(function (n) { return n.id === 'angry_customer'; });
    if (!cust) return;
    if (cust.hidden || cust._visitCustomerId !== visit.customer.id) {
        spawnCurrentDriveCustomer();
    }
}

/* ——— Ryan mentor hints ——— */

function getActiveArcHint() {
    const state = getActiveArcState();
    if (!state || !isArcAppointmentActive()) return null;
    const arc = getArcById(state.arcId);
    if (!arc) return null;
    if (state.phase === 'idle') {
        return arcFormat('Your noon guest is a big one.\nCheck them in at the car when\nthey arrive.');
    }
    if (state.phase === 'checked_in') {
        return 'Write the RO at your desk,\nthen start the dispatch.';
    }
    if (state.phase === 'steps') {
        const step = arc.steps[state.stepIndex];
        if (step && step.hint) return arcFormat(step.hint);
    }
    return null;
}

/* ——— day-start wrapper: milestones + arc teasers ——— */

const _arcBaseBuildDayStart = window.buildDayStartLinesWithStory;

window.buildDayStartLinesWithStory = function () {
    const extra = [];
    let skipRandomEvent = false;

    if (probation.active && !probation.outcome && typeof getProbationDayNumber === 'function') {
        const pd = getProbationDayNumber();
        if (typeof PROBATION_MILESTONES !== 'undefined' && PROBATION_MILESTONES[pd]) {
            PROBATION_MILESTONES[pd].forEach(function (l) { extra.push(arcFormat(l)); });
            skipRandomEvent = true;
        }
    }

    const state = getActiveArcState();
    if (state && state.phase === 'idle') {
        const arc = getArcById(state.arcId);
        if (arc && arc.teaser) extra.push('RYAN: ' + arcFormat(arc.teaser));
        skipRandomEvent = true;
    }

    if (skipRandomEvent && typeof markStoryEventDaySkipped === 'function') {
        markStoryEventDaySkipped();
    }

    const base = _arcBaseBuildDayStart ? _arcBaseBuildDayStart() : [];
    return extra.concat(base);
};

/* ——— story dialogue wrapper: Fred first, then arcs ——— */

const _fredResolveStoryNpcDialogue = window.resolveStoryNpcDialogue;

window.resolveStoryNpcDialogue = function (npc) {
    if (_fredResolveStoryNpcDialogue && _fredResolveStoryNpcDialogue(npc)) return true;
    return resolveArcNpcDialogue(npc);
};

/* ——— graduation epilogue (day 90 pass) ——— */

function buildGraduationEpilogueLines() {
    const n = playerDetails.name;
    const rival = playerDetails.rivalName;
    return [
        'MIKE: Ninety days. You actually\ndid it, kid.',
        'MIKE: Badge, business cards, and a\ndesk that\'s officially yours.\nWelcome to Car Planet. For real.',
        'WHITNEY: Congrats, rookie. You\'re not\n"the new advisor" anymore.\nDon\'t get slow on me.',
        'RYAN: Told you those shoes were\nlucky. Proud of you, ' + n + '.',
        'ZACK: Party in the breakroom.\nDrinks are on Bronson.\nHe doesn\'t know yet.',
        'JOE: You write clean tickets.\nHighest compliment I got.',
        rival + ': ...Good job. Whatever.\nDon\'t make it weird.',
        'MIKE: Alright, alright. The drive\nopens in five, ADVISOR ' + n + '.\nLet\'s go to work.'
    ];
}

window.getStoryArcForToday = getStoryArcForToday;
window.initArcStateForToday = initArcStateForToday;
window.buildArcCustomer = buildArcCustomer;
window.isArcAppointmentActive = isArcAppointmentActive;
window.isArcInProgress = isArcInProgress;
window.getArcPhase = getArcPhase;
window.setArcPhase = setArcPhase;
window.onArcCheckInConfirmed = onArcCheckInConfirmed;
window.onArcRoPrinted = onArcRoPrinted;
window.tickStoryArcs = tickStoryArcs;
window.tickScheduledAppointments = tickScheduledAppointments;
window.getActiveArcHint = getActiveArcHint;
window.isStoryRoStillOpen = isStoryRoStillOpen;
window.buildGraduationEpilogueLines = buildGraduationEpilogueLines;
