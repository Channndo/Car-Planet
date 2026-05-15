/* Intraday walk-in roll (after first appointment) */

const WALKIN_ROLL_INTERVAL = 30;
const WALKIN_ROLL_CHANCE = 0.12;

function tickIntradayWalkIn() {
    if (questState.step < 8 || gameState !== 'PLAYING') return;
    if (gameEvents.isAfterHours || activeDialogue) return;
    if (!probation.active) return;
    if (gameEvents.dailyWalkIn || gameEvents.intradayWalkInRolled) return;
    if (gameEvents.dailyAptsCompleted < 1) return;
    if (gameEvents.timeMinutes % WALKIN_ROLL_INTERVAL !== 0) return;

    if (Math.random() > WALKIN_ROLL_CHANCE) return;

    gameEvents.intradayWalkInRolled = true;
    gameEvents.dailyWalkIn = true;

    if (!gameEvents.dailySchedule) generateDailyCustomerSchedule();

    const aptIds = (gameEvents.dailySchedule.appointments || []).map(a => a.customerId);
    gameEvents.dailySchedule.walkIn = pickWalkInCustomer(aptIds);
    gameEvents.dailySchedule.walkInAttitude = rollAttitude();

    activeDialogue = [
        '[P.A. SYSTEM]\nUnexpected guest on the service drive.',
        playerDetails.name + ', you have a walk-in waiting.'
    ];
    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
}
