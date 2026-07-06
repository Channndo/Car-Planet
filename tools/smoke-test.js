/* Headless smoke test — loads every game script in index.html order with a
   stubbed DOM, then simulates: boot, a story-arc day end to end, probation
   milestones, and the day-90 graduation. Run: node tools/smoke-test.js */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

/* ——— DOM stubs ——— */
function makeCtxStub() {
    return new Proxy({}, {
        get(t, k) {
            if (k === 'canvas') return {};
            if (!(k in t)) t[k] = function () {};
            return t[k];
        },
        set(t, k, v) { t[k] = v; return true; }
    });
}

function makeEl(id) {
    return {
        id: id || '',
        style: {},
        innerHTML: '',
        innerText: '',
        textContent: '',
        children: [],
        classList: { add() {}, remove() {}, contains() { return false; } },
        addEventListener() {},
        appendChild(c) { this.children.push(c); },
        querySelector() { return makeEl('q'); },
        querySelectorAll() { return []; },
        getContext() { return makeCtxStub(); },
        focus() {},
        value: '',
        width: 320,
        height: 240
    };
}

const elements = {};
function getEl(id) {
    if (!elements[id]) elements[id] = makeEl(id);
    return elements[id];
}

const storage = {};
let failures = 0;

const sandbox = {
    console,
    setTimeout: (fn) => { fn(); return 0; }, /* run deferred work immediately */
    clearTimeout() {},
    requestAnimationFrame() { /* run loop only once */ },
    addEventListener() {},
    removeEventListener() {},
    alert(msg) { sandbox.__lastAlert = msg; },
    __lastAlert: null,
    localStorage: {
        getItem: (k) => (k in storage ? storage[k] : null),
        setItem: (k, v) => { storage[k] = String(v); },
        removeItem: (k) => { delete storage[k]; }
    },
    location: { reload() {} },
    document: {
        getElementById: getEl,
        createElement: (tag) => makeEl(tag),
        querySelectorAll: () => [],
        activeElement: { tagName: 'BODY' },
        addEventListener() {}
    },
    navigator: { userAgent: 'node' },
    performance: { now: () => Date.now() },
    check(label, cond, detail) {
        if (cond) { console.log('PASS  ' + label); }
        else { failures++; console.log('FAIL  ' + label + (detail ? ' — ' + detail : '')); }
    }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* ——— load scripts in index.html order ——— */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"?]+)/g)].map(m => m[1]);
if (!srcs.length) { console.error('No scripts found in index.html'); process.exit(1); }

for (const src of srcs) {
    const code = fs.readFileSync(path.join(ROOT, src), 'utf8');
    try {
        vm.runInContext(code, sandbox, { filename: src });
    } catch (e) {
        failures++;
        console.log('FAIL  script load ' + src + ' — ' + e.message);
    }
}

/* ——— tests run INSIDE the vm so they can see let/const globals ——— */
function testMain() {
    check('all scripts loaded + boot() ran', typeof update === 'function' && typeof maps === 'object');

    function setupWorkDay(calendarDay) {
        resetGameStateForNewGame();
        initPlayer(false);
        initWorldAfterLoad();
        gameState = 'PLAYING';
        playerDetails.inUniform = true;
        playerDetails.hasRunningShoes = true;
        questState.step = 8;
        questState.active = true;
        probation.active = true;
        probation.startCalendarDay = 2;
        probation.day2MeetingComplete = true;
        gameEvents.currentDay = calendarDay;
        gameEvents.timeMinutes = 450;
        gameEvents.dailyAptsCompleted = 0;
        gameEvents.dailySchedule = null;
        gameEvents.storyArc = null;
        gameEvents.ryanTourComplete = true;
        gameEvents.ryanMentorActive = true;
        gameEvents.whitneyCheckInTutorialDone = true;
        gameEvents.firstCustomerTriggered = true;
    }

    /* ——— TEST 1: arc day schedule generation (probation day 3 → buck_diesel_day) ——— */
    setupWorkDay(4); /* calendar 4 = probation day 3 */
    generateDailyCustomerSchedule();
    const apts = gameEvents.dailySchedule.appointments;
    check('arc day: 3 appointments', apts.length === 3);
    check('arc day: noon slot is Buck Odom story', apts[1].storyId === 'buck_diesel_day' && apts[1].customer.name === 'BUCK ODOM');
    check('arc day: arc state initialized', gameEvents.storyArc && gameEvents.storyArc.arcId === 'buck_diesel_day' && gameEvents.storyArc.phase === 'idle');
    check('arc day: morning slot scheduled 7:30', apts[0].scheduledMinutes === 450);

    /* ——— TEST 2: full arc walkthrough ——— */
    gameEvents.dailyAptsCompleted = 1; /* morning done */
    gameEvents.timeMinutes = 720;
    tickScheduledAppointments();
    const guest = maps.drive.npcs.find(n => n.id === 'angry_customer');
    const car = maps.drive.npcs.find(n => n.id === 'customer_car');
    check('noon: Buck spawned on drive', !guest.hidden && guest.name === 'BUCK ODOM');

    currentMapKey = 'drive';
    let handled = resolveStoryNpcDialogue(car);
    check('car interact handled by arc', handled === true && activeDialogue[1] === '[CHOICE_CHECKIN_DAILY]');

    currentChoiceType = 'CHECKIN_DAILY';
    makeChoice('YES', { stopPropagation() {} });
    check('check-in: carWaitingForRO = story_arc', gameEvents.carWaitingForRO === 'story_arc');
    check('check-in: phase = checked_in', gameEvents.storyArc.phase === 'checked_in');
    const arcOrder = gameEvents.dmsOrders[gameEvents.dmsOrders.length - 1];
    check('check-in: DMS RO created for Buck', arcOrder && arcOrder.customerName === 'BUCK ODOM' && arcOrder.storyId === 'buck_diesel_day');

    currentChoiceType = 'PC_MAIN';
    makeChoice('DO_CHECKIN', { stopPropagation() {} });
    check('write RO: phase = steps', gameEvents.storyArc.phase === 'steps' && gameEvents.storyArc.stepIndex === 0);
    check('write RO: dialogue visible', dContainer.style.display === 'flex' && /printed/.test(activeDialogue[1]));
    check('write RO: order now open', arcOrder.status === 'open');

    /* step 1: Mike (office works too since drive Mike is hidden on day 2+) */
    currentMapKey = 'office';
    const officeMike = maps.office.npcs.find(n => n.id === 'mike');
    handled = resolveStoryNpcDialogue(officeMike);
    check('step: Mike dispatches to Joe', handled && questState.assignedTo === 'JOE' && gameEvents.storyArc.stepIndex === 1);
    check('step: RO dispatched in DMS', arcOrder.status === 'dispatched' && arcOrder.tech === 'JOE');

    /* step 2-4: Joe → Jerry → Joe */
    currentMapKey = 'shop';
    const joe = maps.shop.npcs.find(n => n.id === 'joe');
    handled = resolveStoryNpcDialogue(joe);
    check('step: Joe wants history', handled && gameEvents.storyArc.stepIndex === 2);
    currentMapKey = 'parts';
    const jerry = maps.parts.npcs.find(n => n.id === 'jerry');
    handled = resolveStoryNpcDialogue(jerry);
    check('step: Jerry gives printout', handled && gameEvents.storyArc.stepIndex === 3);
    currentMapKey = 'shop';
    handled = resolveStoryNpcDialogue(joe);
    check('step: Joe takes the job, timer armed', handled && gameEvents.storyArc.stepIndex === 4 && gameEvents.storyArc.timerUntil > gameEvents.timeMinutes);
    check('step: RO in shop', arcOrder.status === 'in_shop');

    /* busy line + desk progress during timer */
    handled = resolveStoryNpcDialogue(joe);
    check('timer: Joe busy line', handled && /hovering/.test(activeDialogue[0]));
    currentMapKey = 'drive';
    const desk = maps.drive.npcs.find(n => n.id === 'desk');
    handled = resolveStoryNpcDialogue(desk);
    check('timer: desk progress line', handled && /Joe/.test(activeDialogue[0]));

    /* timer expiry → completion */
    activeDialogue = null;
    const csiBefore = probation.csiScore;
    const rosBefore = probation.serviceROs || 0;
    gameEvents.timeMinutes = gameEvents.storyArc.timerUntil + 1;
    tickStoryArcs();
    check('complete: phase done', gameEvents.storyArc.phase === 'done');
    check('complete: appointment counted', gameEvents.dailyAptsCompleted === 2);
    check('complete: arc recorded as done', probation.storyArcsDone.includes('buck_diesel_day'));
    check('complete: RO closed', arcOrder.status === 'closed');
    check('complete: CSI +3 +1(RO)', probation.csiScore === Math.min(100, csiBefore + 4), 'csi=' + probation.csiScore);
    check('complete: probation RO counted', (probation.serviceROs || 0) === rosBefore + 1);
    check('complete: Buck thanks you', /purrs/.test(activeDialogue[0]) || /BUCK/.test(dName.innerText));

    /* afternoon guest arrives at 3 PM */
    activeDialogue = null;
    gameEvents.carWaitingForRO = false;
    gameEvents.timeMinutes = 900;
    tickScheduledAppointments();
    check('3 PM: afternoon guest spawned', !guest.hidden && guest.name === apts[2].customer.name);

    /* ——— TEST 3: Ryan hint during arc ——— */
    setupWorkDay(4);
    generateDailyCustomerSchedule();
    gameEvents.dailyAptsCompleted = 1;
    const hint = getRyanMentorHint();
    check('Ryan hints at the arc guest', /noon guest/.test(hint), hint);

    /* ——— TEST 4: milestone briefing on probation day 7 ——— */
    setupWorkDay(7); /* end shift on cal 7 → rollover to cal 8 = probation day 7 */
    gameEvents.timeMinutes = 1080;
    gameEvents.dailyAptsCompleted = 3;
    probation.storyArcsDone = ['buck_diesel_day', 'tiffany_influencer'];
    currentChoiceType = 'END_SHIFT';
    makeChoice('YES', { stopPropagation() {} });
    check('rollover: new day is 8', gameEvents.currentDay === 8);
    const dayLines = activeDialogue.join('|');
    check('milestone: Mike week-one briefing shown', /One week down/.test(dayLines), dayLines.slice(0, 120));
    check('rollover: schedule regenerated', !!gameEvents.dailySchedule);

    /* ——— TEST 5: day-1-only events do not refire later ——— */
    check('no Zack comeback on day 8', !gameEvents.zackComeback);

    /* ——— TEST 6: duplicate Ryans stay hidden after rollover ——— */
    const shopRyan = maps.shop.npcs.find(n => n.id === 'ryan');
    const partsRyan = maps.parts.npcs.find(n => n.id === 'ryan');
    const driveRyan = maps.drive.npcs.find(n => n.id === 'ryan');
    check('placeholder Ryans hidden, drive Ryan visible',
        shopRyan.hidden && partsRyan.hidden && !driveRyan.hidden);

    /* ——— TEST 7: graduation on day 90 ——— */
    setupWorkDay(91); /* probation day 90 */
    generateDailyCustomerSchedule();
    gameEvents.timeMinutes = 1080;
    gameEvents.dailyAptsCompleted = 3;
    probation.csiScore = 92;
    probation.serviceROs = 210;
    probation.daysSucceeded = 80;
    probation.strikes = 0;
    currentChoiceType = 'END_SHIFT';
    makeChoice('YES', { stopPropagation() {} });
    check('day 90: outcome passed', probation.outcome === 'passed');
    check('day 90: graduation epilogue shown', /Ninety days/.test(activeDialogue.join('|')));
    check('day 90: probation now inactive', probation.active === false);
    activeDialogue = null;
    gameEvents.timeMinutes = 1080;
    currentChoiceType = 'END_SHIFT';
    makeChoice('YES', { stopPropagation() {} });
    check('day after graduation: normal free-play rollover (no loop)',
        gameEvents.currentDay === 93 && /Day 93 begins/.test(activeDialogue[0]),
        'day=' + gameEvents.currentDay + ' line=' + (activeDialogue && activeDialogue[0]));

    /* ——— TEST 8: firing path ——— */
    setupWorkDay(91);
    generateDailyCustomerSchedule();
    gameEvents.timeMinutes = 1080;
    gameEvents.dailyAptsCompleted = 3;
    probation.csiScore = 40;
    probation.serviceROs = 10;
    probation.daysSucceeded = 5;
    currentChoiceType = 'END_SHIFT';
    makeChoice('YES', { stopPropagation() {} });
    check('fail: outcome fired', probation.outcome === 'fired');
    check('fail: fired choice offered', activeDialogue.includes('[CHOICE_PROBATION_FIRED]'));

    /* ——— TEST 9: every arc's data is playable ——— */
    let arcDataOk = true;
    let arcDataMsg = '';
    for (const arc of STORY_ARCS) {
        if (!getCoreCustomerById(arc.customerId)) { arcDataOk = false; arcDataMsg = arc.id + ': bad customerId'; break; }
        const last = arc.steps[arc.steps.length - 1];
        if (last.type !== 'timer') { arcDataOk = false; arcDataMsg = arc.id + ': must end with timer'; break; }
        for (const st of arc.steps) {
            if (st.type !== 'talk') continue;
            const found = (st.maps || []).some(mk => maps[mk] && maps[mk].npcs.some(n => n.id === st.npc));
            if (!found) { arcDataOk = false; arcDataMsg = arc.id + ': npc ' + st.npc + ' not on ' + (st.maps || []).join(','); break; }
        }
        if (!arcDataOk) break;
    }
    check('all ' + STORY_ARCS.length + ' arcs have valid customers/NPCs/steps', arcDataOk, arcDataMsg);

    /* ——— TEST 10: menus are dialogue-based, no alerts ——— */
    setupWorkDay(10);
    generateDailyCustomerSchedule();
    gameState = 'MENU';
    window.__lastAlert = null;
    showStatusMenu();
    check('STATUS uses dialogue (no alert)', window.__lastAlert === null && dName.innerText === 'STATUS' && /PROBATION DAY/.test(activeDialogue.join('|')));
    activeDialogue = null; gameState = 'MENU';
    showRosterMenu();
    check('ROSTER uses dialogue', window.__lastAlert === null && /CUSTOMER ROSTER/.test(activeDialogue[0]));
    activeDialogue = null; gameState = 'MENU';
    showToolsMenu();
    check('TOOLS uses dialogue', window.__lastAlert === null && /RUNNING SHOES/.test(activeDialogue.join('|')));
    activeDialogue = null; gameState = 'MENU';
    showInfoMenu();
    check('INFO uses dialogue', window.__lastAlert === null && /CAR PLANET/.test(activeDialogue[0]));

    /* ——— TEST 11: Fred day 2 unaffected + Mike office fix ——— */
    setupWorkDay(2);
    probation.day2MeetingComplete = true;
    generateDailyCustomerSchedule();
    const fredApt = gameEvents.dailySchedule.appointments[1];
    check('day 2: Fred still books noon', fredApt.storyId === 'fred_oil_change_day2');
    gameEvents.dailyAptsCompleted = 1;
    gameEvents.fredStoryPhase = 'need_mike';
    currentMapKey = 'office';
    handled = resolveStoryNpcDialogue(maps.office.npcs.find(n => n.id === 'mike'));
    check('day 2: Fred dispatch works via office Mike', handled && gameEvents.fredStoryPhase === 'at_vinnie');

    /* ——— TEST 12: daily loop with Mike dispatch ——— */
    setupWorkDay(20);
    probation.storyArcsDone = STORY_ARCS.map(a => a.id); /* all arcs done → plain daily loop */
    generateDailyCustomerSchedule();
    check('daily: no arc on day 20', !gameEvents.storyArc || gameEvents.storyArc.day !== 20);
    gameEvents.timeMinutes = 460;
    tickScheduledAppointments();
    const dGuest = maps.drive.npcs.find(n => n.id === 'angry_customer');
    check('daily: morning guest spawned', !dGuest.hidden);
    const dGuestName = dGuest.name;
    currentChoiceType = 'CHECKIN_DAILY';
    makeChoice('YES', { stopPropagation() {} });
    check('daily: checked in', gameEvents.carWaitingForRO === 'daily');
    currentChoiceType = 'PC_MAIN';
    makeChoice('DO_CHECKIN', { stopPropagation() {} });
    check('daily: RO printed, dispatch pending', gameEvents.pendingDispatch === 'daily' && /Mike/.test(activeDialogue.join('|')));
    const dailyOrder = gameEvents.dmsOrders[gameEvents.dmsOrders.length - 1];
    syncActiveRoFromQuest();
    check('daily: RO stays open while pending dispatch', dailyOrder.status === 'open', dailyOrder.status);
    tickScheduledAppointments();
    check('daily: guest waits during pending dispatch', !dGuest.hidden && dGuest.name === dGuestName);
    check('daily: Mike offers dispatch dialogue', tryMikeDailyDispatchDialogue() === true && /Send it to/.test(activeDialogue[1]));
    const dTech = questState.assignedTo;
    check('daily: tech assigned', dTech === 'VINNIE' || dTech === 'BRONSON', dTech);
    check('daily: dispatch completes after dialogue', completeMikeDailyDispatchIfNeeded() === true);
    check('daily: appointment counted after dispatch', gameEvents.dailyAptsCompleted === 1);
    check('daily: RO records tech', dailyOrder.tech === dTech, dailyOrder.tech);
    syncActiveRoFromQuest();
    check('daily: RO closes after dispatch', dailyOrder.status === 'closed', dailyOrder.status);
    check('daily: pendingDispatch cleared', gameEvents.pendingDispatch === false);

    /* ——— TEST 13: per-guest portraits (not generic John Hughes) ——— */
    setupWorkDay(20);
    generateDailyCustomerSchedule();
    const guestNpc = maps.drive.npcs.find(n => n.id === 'angry_customer');
    const tiffany = getCoreCustomerById(3);
    applyCustomerToDriveNpc(guestNpc, tiffany, { type: 'appointment', attitude: 'neutral', customer: tiffany });
    check('portrait: guest skin from customer data', guestNpc.color === tiffany.portrait.skin, guestNpc.color);
    check('portrait: guest shirt from customer data', guestNpc.shirt === '#ff69b4', guestNpc.shirt);
    drawPortrait('APPOINTMENT');
    triggerCutscene(guestNpc);
    check('cutscene: uses guest name in dialogue box', dName.innerText === 'TIFFANY BROOKS');
    activeDialogue = null;
    gameState = 'PLAYING';

    /* ——— TEST 14: staff portraits are not overwritten by guest ——— */
    applyCustomerToDriveNpc(guestNpc, tiffany, { type: 'appointment', attitude: 'neutral', customer: tiffany });
    applyDialogueSpeakerPortrait('MIKE: Send it to Bronson\'s bay.');
    check('Mike dispatch: name stays MIKE', dName.innerText === 'MIKE');
    check('Mike code is not a guest code', !isGuestPortraitCode('MIKE'));
    const mikeNpc = maps.drive.npcs.find(n => n.id === 'mike');
    drawPortrait(portraitCodeForNpc(mikeNpc));
    check('Mike interact: staff code resolves to MIKE', portraitCodeForNpc(mikeNpc) === 'MIKE');
    check('EJ parts portrait uses staff code', portraitCodeForNpc(maps.parts.npcs.find(n => n.id === 'ej')) === 'EJ');
    check('Guest code draws from customer data not staff', isGuestPortraitCode('APPOINTMENT'));
    check('Mike is staff portrait code', isStaffPortraitCode('MIKE'));
    check('Whitney is staff portrait code', isStaffPortraitCode('WHITNEY'));
    check('Only John Hughes gets angry guest brows', isAngryJohnHughesGuest({ name: 'JOHN HUGHES' }) && !isAngryJohnHughesGuest({ name: 'TIFFANY BROOKS', acc: {} }));

    /* ——— TEST 15: save/load round-trip with new fields ——— */
    setupWorkDay(4);
    generateDailyCustomerSchedule();
    persistGame();
    gameEvents.storyArc = null;
    probation.storyArcsDone = ['x'];
    loadGameFromSave();
    check('save/load: arc state restored', gameEvents.storyArc && gameEvents.storyArc.arcId === 'buck_diesel_day');
    check('save/load: probation fields migrated', Array.isArray(probation.storyArcsDone) && probation.graduationShown === false);
}

try {
    vm.runInContext('(' + testMain.toString() + ')()', sandbox, { filename: 'testMain' });
} catch (e) {
    failures++;
    console.log('FAIL  test crashed — ' + e.stack);
}

console.log('\n' + (failures === 0 ? 'ALL TESTS PASSED' : failures + ' FAILURE(S)'));
process.exit(failures === 0 ? 0 : 1);
