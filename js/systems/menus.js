/* In-game menu screens — STATUS / ROSTER / TOOLS / INFO as dialogue panels
   (replaces the old alert() popups; loads after probation.js + customerSpawn.js
   so these overrides win). */

const GAME_VERSION_LABEL = 'v1.1.0 — Full Dealership Simulation';

function openMenuDialogue(title, lines) {
    const menu = document.getElementById('start-menu');
    if (menu) menu.style.display = 'none';
    if (typeof showMenuPanel === 'function') showMenuPanel('menu-panel-main');
    gameState = 'PLAYING';
    activeDialogue = lines;
    activeLine = 0;
    dName.innerText = title;
    dText.innerText = lines[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}

function menuFormatTime(minutes) {
    let h = Math.floor(minutes / 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const mins = minutes % 60;
    return h + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
}

/* ——— STATUS ——— */

function buildStatusLines() {
    const lines = [];
    lines.push('ADVISOR ' + playerDetails.name + '\nDay ' + gameEvents.currentDay + ' — ' + menuFormatTime(gameEvents.timeMinutes));

    if (!probation.active && !probation.graduationShown) {
        lines.push('Status: TRAINEE\nProbation has not started yet.');
        return lines;
    }
    if (probation.graduationShown || probation.outcome === 'passed') {
        lines.push('Status: FULL-TIME ADVISOR\nYou passed the 90-day probation.');
        lines.push('Career CSI: ' + probation.csiScore + '\nCareer ROs: ' + (probation.serviceROs || 0));
        return lines;
    }

    const pd = typeof getProbationDayNumber === 'function' ? getProbationDayNumber() : 1;
    const wk = typeof getProbationWeekNumber === 'function' ? getProbationWeekNumber() : 1;
    const target = typeof getWeeklyROTarget === 'function' ? getWeeklyROTarget(wk) : 12;
    lines.push('PROBATION DAY ' + pd + ' / ' + PROBATION_DAYS + '\nCSI: ' + probation.csiScore + ' (need ' + PROBATION_MIN_CSI_PASS + '+ to pass)');
    lines.push('ROs written: ' + (probation.serviceROs || 0) + ' / ' + PROBATION_MIN_ROS_PASS + '\nGood days: ' + (probation.daysSucceeded || 0) + ' / ' + PROBATION_MIN_GOOD_DAYS);
    lines.push('Warnings: ' + (probation.warnings || 0) + '\nStrikes: ' + (probation.strikes || 0) + ' / ' + PROBATION_MAX_STRIKES);
    lines.push('Week ' + wk + ' ROs: ' + (probation.weekRosCompleted || 0) + ' / ' + target +
        (probation.lastDayGrade ? '\nLast shift: ' + probation.lastDayGrade.toUpperCase() : ''));

    const arcsDone = (probation.storyArcsDone || []).length;
    const arcsTotal = typeof STORY_ARCS !== 'undefined' ? STORY_ARCS.length : 0;
    if (arcsTotal) lines.push('Special guests handled:\n' + arcsDone + ' / ' + arcsTotal + ' story visits complete.');
    return lines;
}

function showStatusMenuScreen() {
    openMenuDialogue('STATUS', buildStatusLines());
}

/* ——— ROSTER ——— */

const ROSTER_PER_PAGE = 4;

function buildRosterLines() {
    const met = probation.metCustomerIds || [];
    const lines = [];
    lines.push('CUSTOMER ROSTER\n' + met.length + ' / ' + CORE_CUSTOMERS.length + ' guests met.');

    let page = [];
    CORE_CUSTOMERS.forEach(function (c) {
        const seen = met.includes(c.id);
        page.push(seen ? '#' + String(c.id).padStart(2, '0') + ' ' + c.name : '#' + String(c.id).padStart(2, '0') + ' ???');
        if (page.length === ROSTER_PER_PAGE) {
            lines.push(page.join('\n'));
            page = [];
        }
    });
    if (page.length) lines.push(page.join('\n'));

    /* dex entries for met guests, two per page */
    let dexPage = [];
    CORE_CUSTOMERS.forEach(function (c) {
        if (!met.includes(c.id) || !c.dexEntry) return;
        dexPage.push(c.name + ':\n"' + c.dexEntry + '"');
        if (dexPage.length === 2) {
            lines.push(dexPage.join('\n'));
            dexPage = [];
        }
    });
    if (dexPage.length) lines.push(dexPage.join('\n'));

    lines.push('(Walk-ins without appointments\nare not cataloged.)');
    return lines;
}

function showRosterMenuScreen() {
    openMenuDialogue('ROSTER', buildRosterLines());
}

/* ——— TOOLS ——— */

function buildToolsLines() {
    const lines = [];
    lines.push('ADVISOR TOOLS');
    lines.push(playerDetails.inUniform
        ? 'ADVISOR UNIFORM — equipped.\nBlack. Professional. Slightly\nsmells like the service drive.'
        : 'ADVISOR UNIFORM — not equipped.\nGet to the locker room!');
    lines.push(playerDetails.hasRunningShoes
        ? "NON-SLIP RUNNING SHOES — equipped.\nHold 'B' (or Shift) while\nmoving to run."
        : 'RUNNING SHOES — not acquired.\nMike may have a pair for you.');
    lines.push('CAR PLANET OS — your desk\nterminal. Check-ins, ROs,\nschedule, and the time clock.');
    if (probation.active) {
        lines.push('SURVIVAL TIP: check in fast,\nwrite clean ROs, dispatch\nthrough Mike. CSI is life.');
    }
    return lines;
}

function showToolsMenu() {
    openMenuDialogue('TOOLS', buildToolsLines());
}

/* ——— INFO ——— */

function buildInfoLines() {
    return [
        'CAR PLANET\n' + GAME_VERSION_LABEL,
        'A dealership-life story:\n90 days of probation, unique\nguests, and a whole lot of ROs.',
        'Controls: WASD / arrows to move.\nEnter or Space (A) to interact.\nHold Shift (B) to run.',
        "P or START opens this menu.\nSave often at SAVE GAME.\nDon't turn off the power."
    ];
}

function showInfoMenu() {
    openMenuDialogue('INFO', buildInfoLines());
}

/* Override the alert() versions defined earlier in the load order. */
window.showStatusMenu = showStatusMenuScreen;
window.showRosterMenu = showRosterMenuScreen;
window.showToolsMenu = showToolsMenu;
window.showInfoMenu = showInfoMenu;
