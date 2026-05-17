/* Ryan — intro chat (no tour) + ongoing mentor hints */

function completeRyanIntro() {
    gameEvents._ryanIntroPlaying = false;
    gameEvents.pendingRyanTour = false;
    gameEvents.ryanTourComplete = true;
    gameEvents.ryanMentorActive = true;
    if (gameEvents.timeMinutes > 660) gameEvents.timeMinutes = 540;
}

function beginRyanIntroDialogue() {
    gameEvents.pendingRyanTour = false;
    gameEvents._ryanIntroPlaying = true;
    activeDialogue = [
        "RYAN: Hey — you must be " + playerDetails.name + ".",
        "RYAN: I'm Ryan. I normally wouldn't\nhave time for this...",
        "RYAN: ...but we are a little slower\nthis week.",
        "RYAN: If you haven't yet, I'd get familiar\nwith the place and everyone here",
        "RYAN: before your next appointment.",
        "RYAN: You've got plenty of time.",
        "RYAN: If you have any specific questions,\ndon't hesitate to ask.",
        "RYAN: I'll be around — think of me as\nyour mentor on the drive."
    ];
    activeLine = 0;
    dName.innerText = 'RYAN';
    dText.innerText = activeDialogue[0];
    drawPortrait('RYAN');
    dContainer.style.display = 'flex';
}

function getRyanMentorHint() {
    const s = questState.step;

    if (s < 8) {
        if (s <= 1) return "Walk up to the customer's vehicle and check them in.";
        if (s === 2) return "Use your desk — CHECK IN — to write the RO.";
        if (s === 3) return "Take the RO to Mike on the drive for dispatch.";
        if (s === 4) return "Find the tech Mike assigned in the shop.";
        if (s === 5) return "Check your desk email. Mike wants you in his office.";
        if (s === 6) return "Mike's office is upstairs when you're ready.";
        if (s === 7) return "Look around the shop, parts, and drive before noon.";
    }

    if (gameEvents.currentDay === 2 && typeof isFredAppointmentActive === 'function' && isFredAppointmentActive()) {
        const ph = typeof getFredPhase === 'function' ? getFredPhase() : 'idle';
        if (ph === 'idle' || ph === 'checked_in') return "Fred's noon oil change — check in his Escape first.";
        if (ph === 'need_mike' || ph === 'at_vinnie') return "Fred's RO goes to Mike, then Vinnie in the shop.";
        if (ph === 'need_mike_help' || ph === 'need_bri') return "Vinnie won't touch it yet — Mike said get Bri to clean it.";
        if (ph === 'bri_cleaning' || ph === 'bri_done' || ph === 'vinnie_ready') return "Bri's on the detail — then send it back to Vinnie.";
        if (ph === 'vinnie_working') return "Vinnie's on the LOF. Fred should be happy soon.";
    }

    if (s >= 8) {
        if (gameEvents.isAfterHours) return "End your shift at the desk when you're done.";
        if (gameEvents.carWaitingForRO) return "Finish the RO at your desk, then see Mike.";
        if (gameEvents.dailyAptsCompleted < 3) {
            return "Next appointment — check in at the car, RO at desk, Mike dispatches.";
        }
        if (gameEvents.dailyWalkIn && !gameEvents.dailyWalkInDone) {
            return "Walk-in on the drive — same check-in flow as a regular guest.";
        }
        if (probation.active) {
            const day = typeof getProbationDayNumber === 'function' ? getProbationDayNumber() : '?';
            return "Probation day " + day + " — keep CSI up. Don't skip check-ins.";
        }
    }

    return "Check in at the car, write the RO at your desk, dispatch through Mike.";
}

function getRyanMentorDialogue() {
    const tips = [
        "Hold B while moving if you've got the running shoes.",
        "The neighborhood out back has gas, food, and a liquor store if you need a break.",
        "Whitney cares about CSI — prompt check-ins help everybody.",
        "If a tech refuses a car, talk to Mike. There's usually a workaround.",
        "AUTOWORLD is the rival store east on Main Street — don't confuse the drives."
    ];
    const idx = (gameEvents.ryanHintIndex || 0) % tips.length;
    gameEvents.ryanHintIndex = idx + 1;
    return [
        "RYAN: " + getRyanMentorHint(),
        "RYAN: " + tips[idx]
    ];
}

function showRyanMentorHints() {
    activeDialogue = getRyanMentorDialogue();
    activeLine = 0;
    dName.innerText = 'RYAN';
    dText.innerText = activeDialogue[0];
    drawPortrait('RYAN');
    dContainer.style.display = 'flex';
}

function handleRyanInteract(npc) {
    if (!npc || npc.id !== 'ryan' || currentMapKey !== 'drive') return false;

    if (questState.step < 7) {
        activeDialogue = npc.dialogue && npc.dialogue.length
            ? npc.dialogue
            : ["I've been on hold with\nextended warranty for an hour."];
        activeLine = 0;
        dName.innerText = 'RYAN';
        dText.innerText = activeDialogue[0];
        drawPortrait('RYAN');
        dContainer.style.display = 'flex';
        return true;
    }

    if (gameEvents.pendingRyanTour && !gameEvents.ryanTourComplete) {
        beginRyanIntroDialogue();
        return true;
    }

    if (gameEvents.ryanTourComplete || gameEvents.ryanMentorActive || questState.step >= 7) {
        showRyanMentorHints();
        return true;
    }

    return false;
}

function onRyanDialogueFinished() {
    if (gameEvents._ryanIntroPlaying) {
        completeRyanIntro();
        return true;
    }
    return false;
}

window.handleRyanInteract = handleRyanInteract;
window.onRyanDialogueFinished = onRyanDialogueFinished;
window.beginRyanIntroDialogue = beginRyanIntroDialogue;
