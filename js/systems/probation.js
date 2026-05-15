/* 90-day probation campaign — metrics, grading, pass/fail */

function getProbationDayNumber() {
    if (!probation.active) return 0;
    return Math.max(1, gameEvents.currentDay - probation.startCalendarDay + 1);
}

function getProbationWeekNumber(probationDay) {
    const d = probationDay || getProbationDayNumber();
    return Math.ceil(d / 7);
}

function getWeeklyROTarget(weekNum) {
    return 12 + (weekNum - 1) * 2;
}

function shouldRunDay2Meeting() {
    return gameEvents.currentDay === 2 && !probation.day2MeetingComplete;
}

function activateProbation() {
    probation.active = true;
    probation.startCalendarDay = gameEvents.currentDay;
    probation.day = 1;
    probation.day2MeetingComplete = true;
    probation.day2MeetingPending = false;
    probation.weekRosCompleted = 0;
    probation.currentWeek = 1;
    if (!probation.storyEventDays) probation.storyEventDays = [];
}

function adjustCSI(delta) {
    if (!probation.active) return;
    probation.csiScore = Math.max(0, Math.min(100, (probation.csiScore || 100) + delta));
    if (probation.csiScore <= PROBATION_INSTANT_FAIL_CSI && probation.outcome !== 'passed') {
        probation.outcome = 'fired';
        probation.firedReason = 'CSI fell below minimum standards.';
    }
}

function addWarning(reason) {
    if (!probation.active) return;
    probation.warnings = (probation.warnings || 0) + 1;
    probation.lastWarningReason = reason;
    adjustCSI(-3);
    if (probation.warnings >= 3 && (probation.strikes || 0) < PROBATION_MAX_STRIKES) {
        addStrike('Three warnings on your record.');
    }
}

function addStrike(reason) {
    if (!probation.active) return;
    probation.strikes = (probation.strikes || 0) + 1;
    probation.lastStrikeReason = reason;
    adjustCSI(-8);
    if (probation.strikes >= PROBATION_MAX_STRIKES) {
        probation.outcome = 'fired';
        probation.firedReason = reason || 'Too many strikes.';
    }
}

function captureShiftSnapshot() {
    return {
        calendarDay: gameEvents.currentDay,
        probationDay: getProbationDayNumber(),
        aptsCompleted: gameEvents.dailyAptsCompleted || 0,
        walkInScheduled: !!gameEvents.dailyWalkIn,
        walkInDone: !!gameEvents.dailyWalkInDone,
        weekNum: getProbationWeekNumber(getProbationDayNumber())
    };
}

function gradeShift(snapshot) {
    const notes = [];
    let grade = 'good';

    if (snapshot.aptsCompleted >= 3) {
        notes.push('All 3 appointments handled.');
    } else if (snapshot.aptsCompleted >= 2) {
        grade = 'fair';
        notes.push('Only ' + snapshot.aptsCompleted + '/3 appointments completed.');
    } else {
        grade = 'poor';
        notes.push('Missed most appointments (' + snapshot.aptsCompleted + '/3).');
    }

    if (snapshot.walkInScheduled && !snapshot.walkInDone) {
        if (grade === 'good') grade = 'fair';
        else if (grade === 'fair') grade = 'poor';
        notes.push('Walk-in was not completed.');
    } else if (snapshot.walkInScheduled && snapshot.walkInDone) {
        notes.push('Walk-in guest was handled.');
    }

    const weekTarget = getWeeklyROTarget(snapshot.weekNum);
    const weekRos = (probation.weekRosCompleted || 0);
    if (weekRos >= weekTarget) {
        notes.push('Weekly RO goal met (' + weekRos + '/' + weekTarget + ').');
    } else {
        notes.push('Weekly ROs: ' + weekRos + '/' + weekTarget + ' so far.');
    }

    return { grade, notes };
}

function applyGradeEffects(grade, snapshot) {
    if (grade === 'good') {
        probation.daysSucceeded = (probation.daysSucceeded || 0) + 1;
        adjustCSI(2);
        if (snapshot.aptsCompleted >= 3) adjustCSI(2);
        if (snapshot.walkInDone) adjustCSI(1);
    } else if (grade === 'fair') {
        probation.daysFailed = (probation.daysFailed || 0) + 1;
        adjustCSI(-4);
        addWarning('Subpar shift performance.');
    } else {
        probation.daysFailed = (probation.daysFailed || 0) + 1;
        adjustCSI(-8);
        if (snapshot.aptsCompleted < 2) {
            addStrike('Failed to complete scheduled appointments.');
        } else {
            addWarning('Poor shift — Mike is watching.');
        }
    }
    probation.lastDayGrade = grade;
}

function buildShiftDebriefDialogue(snapshot, gradeResult) {
    const pname = playerDetails.name;
    const lines = [];
    lines.push('SHIFT REPORT — PROBATION DAY ' + snapshot.probationDay);
    gradeResult.notes.forEach(n => lines.push(n));
    lines.push('CSI: ' + probation.csiScore + ' | Strikes: ' + (probation.strikes || 0) + '/' + PROBATION_MAX_STRIKES);

    if (probation.outcome === 'fired') {
        lines.push('[CHOICE_PROBATION_FIRED]');
        return lines;
    }

    if (snapshot.probationDay >= PROBATION_DAYS) {
        lines.push('Mike wants you in his office.\nFinal probation review.');
        lines.push('[ACTION_FINAL_PROBATION_REVIEW]');
        return lines;
    }

    if (gradeResult.grade === 'good') {
        lines.push('MIKE: "Good work today, ' + pname + '.\nKeep it up."');
    } else if (gradeResult.grade === 'fair') {
        lines.push('MIKE: "' + pname + ', you can do better.\nTomorrow counts."');
    } else {
        lines.push('MIKE: "We need to talk about\nyour effort, ' + pname + '."');
    }
    return lines;
}

function evaluateFinalProbation() {
    const passed =
        (probation.strikes || 0) < PROBATION_MAX_STRIKES &&
        (probation.csiScore || 0) >= PROBATION_MIN_CSI_PASS &&
        (probation.serviceROs || 0) >= PROBATION_MIN_ROS_PASS &&
        (probation.daysSucceeded || 0) >= PROBATION_MIN_GOOD_DAYS;

    probation.outcome = passed ? 'passed' : 'fired';
    probation.finalReviewComplete = true;
    if (!passed && !probation.firedReason) {
        probation.firedReason = 'Did not meet probation requirements.';
    }
    return passed;
}

function buildFinalReviewDialogue(passed) {
    const pname = playerDetails.name;
    if (passed) {
        return [
            'FINAL PROBATION REVIEW',
            'MIKE: "' + pname + ', you made it.\n90 days. You\'re hired."',
            'CSI: ' + probation.csiScore + ' | ROs: ' + probation.serviceROs,
            'Good days: ' + probation.daysSucceeded + ' / 90',
            'Welcome to the team — for real this time.'
        ];
    }
    return [
        'FINAL PROBATION REVIEW',
        'MIKE: "' + pname + '... we gave it a shot."',
        'CSI: ' + probation.csiScore + ' | ROs: ' + probation.serviceROs,
        'Good days: ' + probation.daysSucceeded + ' / 90',
        'You\'re being let go.\nBetter luck somewhere else.',
        '[CHOICE_PROBATION_FIRED]'
    ];
}

function processProbationEndOfShift() {
    if (!probation.active || probation.outcome === 'fired') return null;

    const snapshot = captureShiftSnapshot();
    if (snapshot.probationDay < 1) return null;

    const gradeResult = gradeShift(snapshot);
    applyGradeEffects(gradeResult.grade, snapshot);

    if (snapshot.probationDay >= PROBATION_DAYS && probation.outcome !== 'fired') {
        const passed = evaluateFinalProbation();
        return buildFinalReviewDialogue(passed);
    }

    return buildShiftDebriefDialogue(snapshot, gradeResult);
}

function onProbationWeekRollover() {
    const newWeek = getProbationWeekNumber();
    if (newWeek !== probation.currentWeek) {
        probation.currentWeek = newWeek;
        probation.weekRosCompleted = 0;
    }
}

function recordProbationRO() {
    if (!probation.active) return;
    probation.serviceROs = (probation.serviceROs || 0) + 1;
    probation.weekRosCompleted = (probation.weekRosCompleted || 0) + 1;
    adjustCSI(1);
}

function reserveStoryEventSlot(calendarDay) {
    if (!probation.storyEventDays) probation.storyEventDays = [];
    if (!probation.storyEventDays.includes(calendarDay)) {
        probation.storyEventDays.push(calendarDay);
    }
}

function needsStoryEventToday() {
    if (!probation.active || probation.outcome) return false;
    reserveStoryEventSlot(gameEvents.currentDay);
    return !probation.storyEventDaysUsed || !probation.storyEventDaysUsed.includes(gameEvents.currentDay);
}

function getMenuHeaderLines() {
    const m = gameEvents.timeMinutes;
    let h = Math.floor(m / 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const mins = m % 60;
    const timeStr = h + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
    let header = 'DAY ' + gameEvents.currentDay + '\n' + timeStr;
    if (probation.active) {
        header += '\nPROBATION ' + getProbationDayNumber() + '/' + PROBATION_DAYS;
        header += '\nCSI ' + probation.csiScore;
        const wk = getProbationWeekNumber();
        header += '\nWK RO ' + (probation.weekRosCompleted || 0) + '/' + getWeeklyROTarget(wk);
    }
    return header;
}

function getProbationStatusText() {
    const wk = getProbationWeekNumber();
    let msg = 'ADVISOR: ' + playerDetails.name + '\n';
    msg += 'CALENDAR DAY ' + gameEvents.currentDay + '\n';
    if (!probation.active) {
        msg += '(Tutorial — probation not started)\n';
        return msg;
    }
    msg += 'PROBATION DAY ' + getProbationDayNumber() + ' / ' + PROBATION_DAYS + '\n';
    msg += 'CSI: ' + probation.csiScore + '\n';
    msg += 'ROs COMPLETED: ' + (probation.serviceROs || 0) + ' (need ' + PROBATION_MIN_ROS_PASS + '+ to pass)\n';
    msg += 'GOOD DAYS: ' + (probation.daysSucceeded || 0) + ' (need ' + PROBATION_MIN_GOOD_DAYS + '+)\n';
    msg += 'WARNINGS: ' + (probation.warnings || 0) + '\n';
    msg += 'STRIKES: ' + (probation.strikes || 0) + '/' + PROBATION_MAX_STRIKES + '\n';
    msg += 'WEEK ' + wk + ' ROs: ' + (probation.weekRosCompleted || 0) + '/' + getWeeklyROTarget(wk) + '\n';
    if (probation.lastDayGrade) msg += 'LAST SHIFT: ' + probation.lastDayGrade.toUpperCase() + '\n';
    if (probation.outcome === 'passed') msg += '\nSTATUS: HIRED';
    if (probation.outcome === 'fired') msg += '\nSTATUS: TERMINATED';
    return msg;
}

function showStatusMenu() {
    toggleStartMenu();
    alert(getProbationStatusText());
}

window.showStatusMenu = showStatusMenu;
