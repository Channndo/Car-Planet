/* Day 2 — Fred Nanders noon oil-change story chain */

const FRED_STORY_ID = 'fred_oil_change_day2';
const FRED_APPT_INDEX = 1;
const FRED_NOON_MINUTES = 720;

function isFredStoryDay() {
    return gameEvents.currentDay === 2 && !gameEvents.fredStoryComplete;
}

function isFredAppointmentActive() {
    if (!isFredStoryDay() || !gameEvents.dailySchedule) return false;
    if (gameEvents.dailyAptsCompleted !== FRED_APPT_INDEX) return false;
    const apt = gameEvents.dailySchedule.appointments[FRED_APPT_INDEX];
    return apt && apt.storyId === FRED_STORY_ID;
}

function isFredStoryInProgress() {
    return isFredAppointmentActive() && getFredPhase() !== 'idle' && getFredPhase() !== 'done';
}

function getFredPhase() {
    return gameEvents.fredStoryPhase || 'idle';
}

function setFredPhase(phase) {
    gameEvents.fredStoryPhase = phase;
}

function isPlayerAtDesk() {
    return currentMapKey === 'drive' && player.tx <= 4 && player.ty >= 10;
}

function scheduleFredTimer(minutes, nextPhase) {
    gameEvents.fredStoryTimerUntil = gameEvents.timeMinutes + minutes;
    gameEvents.fredStoryTimerPhase = nextPhase;
}

function clearFredTimer() {
    gameEvents.fredStoryTimerUntil = null;
    gameEvents.fredStoryTimerPhase = null;
}

function triggerFredPA(message) {
    if (gameEvents.fredStoryPaDoneForPhase === getFredPhase()) return;
    gameEvents.fredStoryPaDoneForPhase = getFredPhase();
    if (typeof playIntercomPing === 'function') playIntercomPing();
    activeDialogue = ['[P.A. SYSTEM]\n' + message];
    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}

function completeFredStoryHappy() {
    gameEvents.fredStoryComplete = true;
    gameEvents.fredStoryActive = false;
    setFredPhase('done');
    clearFredTimer();
    gameEvents.carWaitingForRO = false;
    gameEvents.dailyAptsCompleted++;
    recordProbationRO();
    if (typeof adjustCSI === 'function') adjustCSI(2);
    const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
    if (cust) {
        cust.dialogue = [
            'Thanks for sticking with it.',
            'Interior actually smells better.',
            "I'll be back for the next one."
        ];
    }
    activeDialogue = [
        'FRED: Appreciate you, ' + playerDetails.name + '.',
        "That oil change was quick once\nBri worked her magic.",
        "CSI survey's getting five stars\nfrom me today."
    ];
    activeLine = 0;
    dName.innerText = 'FRED NANDERS';
    dText.innerText = activeDialogue[0];
    drawPortrait('FRED_NANDERS');
    dContainer.style.display = 'flex';
    const afterFred = function () {
        hideDriveCustomerSlots(function () {
            if (gameEvents.dailyAptsCompleted < 3) {
                spawnCurrentDriveCustomer();
                if (typeof notifyDriveCustomerPresent === 'function') {
                    notifyDriveCustomerPresent('fred_afternoon');
                }
            }
        });
    };
    setTimeout(afterFred, 1200);
}

function resolveStoryNpcDialogue(npc) {
    if (!isFredAppointmentActive() && !isFredStoryInProgress()) return false;
    if (!npc) return false;

    if (npc.id === 'customer_car') {
        const ph = getFredPhase();
        if (ph === 'idle') {
            activeDialogue = [
                '2013 Ford Escape — white.\nMud caked on the rocker panels.',
                '[CHOICE_CHECKIN_DAILY]'
            ];
            dName.innerText = 'FRED\'S ESCAPE';
            return true;
        }
        activeDialogue = ['Vehicle is already checked in.\nUse your desk to finish the RO.'];
        dName.innerText = 'SYSTEM';
        return true;
    }

    if (npc.id === 'angry_customer') {
        const ph = getFredPhase();
        if (ph === 'idle' || ph === 'checked_in') {
            activeDialogue = [
                "I'm Fred. Just an oil change.",
                "Please don't judge the interior."
            ];
        } else if (ph === 'done') {
            activeDialogue = (npc.dialogue && npc.dialogue.length) ? npc.dialogue : ['Thanks again!'];
        } else {
            activeDialogue = [
                "Hang tight — we're getting\nyour Escape taken care of."
            ];
        }
        dName.innerText = 'FRED NANDERS';
        return true;
    }

    if (npc.id === 'desk' && currentMapKey === 'drive') {
        const ph = getFredPhase();
        if (ph === 'vinnie_working') {
            activeDialogue = [
                'RO in progress — Vinnie is on\nthe LOF. About ' +
                Math.max(1, (gameEvents.fredStoryTimerUntil || gameEvents.timeMinutes) - gameEvents.timeMinutes) +
                ' min left.'
            ];
            dName.innerText = 'SYSTEM';
            return true;
        }
        if (ph === 'bri_cleaning') {
            activeDialogue = ['Bri is detailing the Escape.\nAlmost done.'];
            dName.innerText = 'SYSTEM';
            return true;
        }
    }

    if (npc.id === 'mike' && currentMapKey === 'drive') {
        if (getFredPhase() === 'waiting_player') {
            activeDialogue = [
                "MIKE: Vinnie sent it back?\nGo see what he said."
            ];
            dName.innerText = 'MIKE';
            return true;
        }
        if (getFredPhase() === 'need_mike') {
            activeDialogue = [
                "MIKE: Fred Nanders? Oil change on\nthe white Escape?",
                "MIKE: Give it to Vinnie.\nShould be a quick LOF."
            ];
            questState.talkedToMike = true;
            questState.assignedTo = 'VINNIE';
            setFredPhase('at_vinnie');
            dName.innerText = 'MIKE';
            return true;
        }
        if (getFredPhase() === 'need_mike_help') {
            activeDialogue = [
                "MIKE: Figure it out, " + playerDetails.name + ".",
                "MIKE: We gotta keep these\nCSI scores up.",
                "MIKE: Talk to Bri in the shop.\nShe can detail the interior."
            ];
            setFredPhase('need_bri');
            dName.innerText = 'MIKE';
            return true;
        }
    }

    if (npc.id === 'vinnie' && currentMapKey === 'shop') {
        if (getFredPhase() === 'at_vinnie' && questState.talkedToMike) {
            activeDialogue = [
                "VINNIE: Whoa. No way.",
                "VINNIE: I'm not climbing in that.\nIt's too nasty.",
                "VINNIE: Come back when somebody\ncleans it."
            ];
            setFredPhase('waiting_player');
            scheduleFredTimer(10, 'vinnie_refused');
            gameEvents.fredStoryPaDoneForPhase = null;
            dName.innerText = 'VINNIE';
            return true;
        }
        if (getFredPhase() === 'vinnie_ready') {
            activeDialogue = [
                "VINNIE: Alright, it's gross but\nI can do the LOF.",
                "VINNIE: Give me about fifteen\nminutes."
            ];
            setFredPhase('vinnie_working');
            scheduleFredTimer(15, 'service_done');
            dName.innerText = 'VINNIE';
            return true;
        }
        if (getFredPhase() === 'vinnie_working') {
            activeDialogue = [
                "VINNIE: Still working.\nBack off, I'm busy."
            ];
            dName.innerText = 'VINNIE';
            return true;
        }
    }

    if (npc.id === 'bri' && currentMapKey === 'shop') {
        if (getFredPhase() === 'need_bri') {
            activeDialogue = [
                "BRI: Ugh, that interior?\nI saw it through the glass.",
                "BRI: Fine. I'll vacuum and wipe it down.",
                "BRI: Give me ten minutes."
            ];
            setFredPhase('bri_cleaning');
            scheduleFredTimer(10, 'bri_done');
            dName.innerText = 'BRI';
            return true;
        }
        if (getFredPhase() === 'bri_cleaning') {
            activeDialogue = [
                "BRI: Still cleaning.\nThere was a dead french fry\nfrom 2014 in there."
            ];
            dName.innerText = 'BRI';
            return true;
        }
        if (getFredPhase() === 'bri_done') {
            activeDialogue = [
                "BRI: Done. It still ain't pretty\nbut Vinnie can survive now.",
                "BRI: Go tell Vinnie."
            ];
            setFredPhase('vinnie_ready');
            dName.innerText = 'BRI';
            return true;
        }
    }

    return false;
}

function tickFredStory() {
    if (!gameEvents.fredStoryActive && !isFredStoryDay()) return;

    if (isFredAppointmentActive() && gameEvents.timeMinutes >= FRED_NOON_MINUTES && !gameEvents.fredNoonPing) {
        gameEvents.fredNoonPing = true;
        const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
        if (cust && cust.hidden) {
            spawnCurrentDriveCustomer();
            if (typeof notifyDriveCustomerPresent === 'function') {
                notifyDriveCustomerPresent('fred_noon');
            }
        }
    }

    if (questState.step >= 8 && !gameEvents.isAfterHours && gameEvents.dailySchedule) {
        const visit = resolveActiveVisit();
        const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
        if (visit && cust && cust.hidden) spawnCurrentDriveCustomer();
    }

    if (!gameEvents.fredStoryTimerUntil) return;
    if (gameEvents.timeMinutes < gameEvents.fredStoryTimerUntil) return;

    const phase = gameEvents.fredStoryTimerPhase;
    clearFredTimer();

    if (phase === 'vinnie_refused') {
        setFredPhase('need_mike_help');
        if (!isPlayerAtDesk()) {
            triggerFredPA(playerDetails.name + ' to the service drive.');
        }
        return;
    }
    if (phase === 'bri_done') {
        setFredPhase('bri_done');
        const car = maps.drive.npcs.find(n => n.id === 'customer_car');
        if (car) car._vehicleDirty = false;
        if (!activeDialogue) {
            activeDialogue = [
                "SYSTEM: Bri finished cleaning\nFred's Escape.",
                'Go tell Vinnie in the shop.'
            ];
            activeLine = 0;
            dName.innerText = 'SYSTEM';
            dText.innerText = activeDialogue[0];
            drawPortrait('NONE');
            dContainer.style.display = 'flex';
        }
        return;
    }
    if (phase === 'service_done') {
        completeFredStoryHappy();
    }
}

function onFredCheckInConfirmed() {
    gameEvents.carWaitingForRO = 'fred_story';
    setFredPhase('checked_in');
    activeDialogue = ['Vehicle checked in.\nGo to your computer to write the RO.'];
    activeLine = 0;
    dText.innerText = activeDialogue[0];
    dName.innerText = 'SYSTEM';
    drawPortrait('NONE');
}

window.isFredAppointmentActive = isFredAppointmentActive;
window.isFredStoryDay = isFredStoryDay;
window.resolveStoryNpcDialogue = resolveStoryNpcDialogue;
window.tickFredStory = tickFredStory;
window.onFredCheckInConfirmed = onFredCheckInConfirmed;
window.getFredPhase = getFredPhase;
window.clearFredTimer = clearFredTimer;
