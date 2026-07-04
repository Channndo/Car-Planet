/* Daily-loop RO dispatch through Mike (step 8+) */

function pickDailyTechAssignment() {
    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    const pool = visit && visit.customer && visit.customer.complaintPool
        ? visit.customer.complaintPool.join(' ').toLowerCase()
        : '';
    if (/engine|transmission|knock|misfire|head gasket/.test(pool)) return 'BRONSON';
    if (/oil|rotation|lof|30k|maintenance|filter|brake pad/.test(pool)) return 'VINNIE';
    return Math.random() < 0.55 ? 'VINNIE' : 'BRONSON';
}

function techDisplayName(code) {
    if (code === 'BRONSON') return 'Bronson';
    if (code === 'VINNIE') return 'Vinnie';
    return code;
}

function tryMikeDailyDispatchDialogue() {
    if (questState.step < 8 || !gameEvents.pendingDispatch) return false;

    const cust = maps.drive && maps.drive.npcs
        ? maps.drive.npcs.find(n => n.id === 'angry_customer')
        : null;
    const guest = cust && cust.name ? cust.name : 'your guest';
    const tech = pickDailyTechAssignment();

    questState.talkedToMike = true;
    questState.assignedTo = tech;
    gameEvents._mikeDispatchDialogueActive = true;

    activeDialogue = [
        'MIKE: RO #' + questState.roNumber + ' for\n' + guest + '?',
        'MIKE: Send it to ' + techDisplayName(tech) + "'s bay.",
        'MIKE: Good. Keep the lane moving.'
    ];
    dName.innerText = 'MIKE';
    return true;
}

function finishDailyDispatch(type) {
    const dispatchType = type || gameEvents.pendingDispatch;
    if (typeof setDmsOrderStatus === 'function' && gameEvents.dmsActiveRoId && questState.assignedTo) {
        setDmsOrderStatus(gameEvents.dmsActiveRoId, 'dispatched', { tech: questState.assignedTo });
    }
    gameEvents.pendingDispatch = false;
    gameEvents._mikeDispatchDialogueActive = false;
    questState.talkedToMike = false;
    questState.assignedTo = null;

    if (typeof hideDriveCustomerSlots === 'function') hideDriveCustomerSlots();

    if (dispatchType === 'daily') {
        gameEvents.dailyAptsCompleted = (gameEvents.dailyAptsCompleted || 0) + 1;
        if (typeof recordProbationRO === 'function') recordProbationRO();

        if (gameEvents.dailyAptsCompleted < 3) {
            if (typeof spawnCurrentDriveCustomer === 'function') spawnCurrentDriveCustomer();
            const nextCust = maps.drive && maps.drive.npcs
                ? maps.drive.npcs.find(n => n.id === 'angry_customer')
                : null;
            if (nextCust && !nextCust.hidden) {
                activeDialogue = [
                    '[P.A. SYSTEM]\n' + playerDetails.name + ' to the service drive,\nguest is waiting.'
                ];
            } else {
                activeDialogue = [
                    'RO dispatched to the shop.',
                    'Your next appointment arrives\nlater. Keep yourself busy.'
                ];
            }
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

window.tryMikeDailyDispatchDialogue = tryMikeDailyDispatchDialogue;
window.finishDailyDispatch = finishDailyDispatch;
window.completeMikeDailyDispatchIfNeeded = completeMikeDailyDispatchIfNeeded;
