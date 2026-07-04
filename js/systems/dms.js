/* Car Planet OS — live repair-order / DMS tied to game state */

const DMS_OPEN_STATUSES = ['checked_in', 'open', 'dispatched', 'in_shop', 'waiting_parts'];

let dmsView = 'home';
let dmsSelectedRo = null;

function ensureDmsState() {
    if (!gameEvents.dmsOrders) gameEvents.dmsOrders = [];
    if (gameEvents.dmsActiveRoId === undefined) gameEvents.dmsActiveRoId = null;
}

function formatDmsTime(minutes) {
    let h = Math.floor(minutes / 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const mins = minutes % 60;
    return h + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
}

function statusLabel(status) {
    const map = {
        checked_in: 'Checked In',
        open: 'Open',
        dispatched: 'Dispatched',
        in_shop: 'In Shop',
        waiting_parts: 'Waiting Parts',
        closed: 'Closed'
    };
    return map[status] || status;
}

function captureVisitSnapshot(source) {
    if (questState.step === 1 || questState.step === 2) {
        const cust = maps.drive && maps.drive.npcs.find(n => n.id === 'angry_customer');
        return {
            visitType: 'tutorial',
            customerId: 'tutorial_john',
            customerName: cust ? cust.name : 'JOHN HUGHES',
            vehicle: { year: 2020, make: 'Ford', model: 'Explorer', color: '#3a5a80' },
            concern: 'Engine knocking — sounds heavy.',
            slot: 'morning',
            attitude: null
        };
    }
    if (source === 'fred_story' || (typeof isFredAppointmentActive === 'function' && isFredAppointmentActive())) {
        const apt = gameEvents.dailySchedule && gameEvents.dailySchedule.appointments
            ? gameEvents.dailySchedule.appointments[1] : null;
        const c = apt ? apt.customer : null;
        return {
            visitType: 'fred_story',
            customerId: c ? c.id : 151,
            customerName: c ? c.name : 'FRED NANDERS',
            vehicle: c && c.vehicle ? Object.assign({}, c.vehicle) : { year: 2013, make: 'Ford', model: 'Escape', color: '#f4f4f4' },
            concern: 'Oil change',
            slot: 'mid-day',
            attitude: apt ? apt.attitude : null,
            storyId: 'fred_oil_change_day2'
        };
    }
    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    if (!visit || !visit.customer) return null;
    const complaint = visit.customer.complaintPool
        ? visit.customer.complaintPool[Math.floor(Math.random() * visit.customer.complaintPool.length)]
        : 'Customer concern not recorded.';
    return {
        visitType: visit.type === 'walkin' ? 'walkin' : 'appointment',
        customerId: visit.customer.id,
        customerName: visit.customer.name,
        vehicle: visit.customer.vehicle ? Object.assign({}, visit.customer.vehicle) : null,
        concern: complaint,
        slot: visit.slot || null,
        attitude: visit.attitude || null,
        storyId: visit.customer.storyId || null
    };
}

function findDmsOrder(id) {
    ensureDmsState();
    return gameEvents.dmsOrders.find(o => o.id === id) || null;
}

function findOpenDraft() {
    ensureDmsState();
    return gameEvents.dmsOrders.find(o =>
        o.status === 'checked_in' && o.calendarDay === gameEvents.currentDay
    ) || null;
}

function getOpenOrders() {
    ensureDmsState();
    return gameEvents.dmsOrders.filter(o => DMS_OPEN_STATUSES.indexOf(o.status) >= 0);
}

function getClosedOrders() {
    ensureDmsState();
    return gameEvents.dmsOrders.filter(o => o.status === 'closed');
}

function registerVehicleCheckIn(source) {
    ensureDmsState();
    const snap = captureVisitSnapshot(source);
    if (!snap) return null;
    const existing = findOpenDraft();
    if (existing) return existing;

    questState.roNumber = (questState.roNumber || 600000) + 1;
    const roNum = questState.roNumber;
    const order = {
        id: 'ro_' + roNum,
        roNumber: roNum,
        status: 'checked_in',
        calendarDay: gameEvents.currentDay,
        openedAtMinutes: gameEvents.timeMinutes,
        closedAtMinutes: null,
        advisor: playerDetails.name,
        tech: null,
        visitType: snap.visitType,
        customerId: snap.customerId,
        customerName: snap.customerName,
        vehicle: snap.vehicle,
        concern: snap.concern,
        slot: snap.slot,
        attitude: snap.attitude,
        storyId: snap.storyId || null,
        partsHold: false
    };
    gameEvents.dmsOrders.push(order);
    gameEvents.dmsActiveRoId = order.id;
    return order;
}

function setDmsOrderStatus(roId, status, extra) {
    const o = findDmsOrder(roId);
    if (!o) return;
    o.status = status;
    if (extra) Object.assign(o, extra);
    if (status === 'closed') o.closedAtMinutes = gameEvents.timeMinutes;
}

function syncActiveRoFromQuest() {
    ensureDmsState();
    if (!gameEvents.dmsActiveRoId) {
        const open = getOpenOrders().filter(o => o.calendarDay === gameEvents.currentDay);
        if (open.length) gameEvents.dmsActiveRoId = open[open.length - 1].id;
    }
    const o = findDmsOrder(gameEvents.dmsActiveRoId);
    if (!o) return;
    /* Story ROs (Fred / story arcs) stay open until their story completes;
       daily ROs stay open while they still need Mike's dispatch */
    const storyOpen = typeof isStoryRoStillOpen === 'function' && isStoryRoStillOpen(o);
    const holdOpen = storyOpen || !!gameEvents.pendingDispatch;
    if (questState.step >= 3 && questState.step < 5 && o.status === 'checked_in') setDmsOrderStatus(o.id, 'open');
    if (questState.talkedToMike && questState.assignedTo && o.status === 'open') {
        setDmsOrderStatus(o.id, 'dispatched', { tech: questState.assignedTo });
    }
    if (questState.step >= 5 && o.status === 'dispatched' && !holdOpen) setDmsOrderStatus(o.id, 'in_shop');
    if (questState.step >= 5 && o.status !== 'closed' && !holdOpen) setDmsOrderStatus(o.id, 'closed');
}

function onRepairOrderPrinted(source) {
    ensureDmsState();
    let order = findOpenDraft();
    if (!order) order = registerVehicleCheckIn(source);
    if (!order) return null;
    setDmsOrderStatus(order.id, 'open');
    gameEvents.dmsActiveRoId = order.id;
    questState.roNumber = order.roNumber;
    return order;
}

function getDmsDashboardStats() {
    ensureDmsState();
    syncActiveRoFromQuest();
    const open = getOpenOrders();
    const closed = getClosedOrders();
    const todayClosed = closed.filter(o => o.calendarDay === gameEvents.currentDay);
    let sched = 'No schedule loaded.';
    if (gameEvents.dailySchedule && questState.step >= 8) {
        const done = gameEvents.dailyAptsCompleted || 0;
        sched = done + '/3 appointments today';
        if (gameEvents.dailyWalkIn) sched += gameEvents.dailyWalkInDone ? ' · walk-in done' : ' · walk-in pending';
    }
    let probationLine = '';
    if (probation.active) {
        const wk = typeof getProbationWeekNumber === 'function' ? getProbationWeekNumber() : 1;
        const target = typeof getWeeklyROTarget === 'function' ? getWeeklyROTarget(wk) : 12;
        probationLine = 'CSI ' + (probation.csiScore || 100) + ' · Week ROs ' + (probation.weekRosCompleted || 0) + '/' + target;
    }
    return {
        openCount: open.length,
        closedCount: closed.length,
        closedToday: todayClosed.length,
        nextRo: (questState.roNumber || 600000) + 1,
        schedule: sched,
        probationLine: probationLine,
        carWaiting: !!gameEvents.carWaitingForRO,
        draft: findOpenDraft()
    };
}

function canDmsVehicleCheckIn() {
    if (questState.active && questState.step >= 1 && questState.step <= 4) return false;
    if (questState.step === 2 || gameEvents.carWaitingForRO) return false;
    if (questState.step >= 8 && !gameEvents.isAfterHours && typeof resolveActiveVisit === 'function') {
        return !!resolveActiveVisit();
    }
    return false;
}

function canDmsWriteRo() {
    if (questState.active && questState.step >= 1 && questState.step <= 4) {
        return questState.step === 2 || gameEvents.carWaitingForRO === 'tutorial';
    }
    return questState.step >= 8 && !!gameEvents.carWaitingForRO;
}

function canDmsClockOut() {
    return gameEvents.timeMinutes >= 1080;
}

function dmsPerformCheckIn() {
    if (!canDmsVehicleCheckIn()) {
        dmsShowMessage('Check in at the vehicle on the drive first.');
        renderDms();
        return;
    }
    const visit = typeof resolveActiveVisit === 'function' ? resolveActiveVisit() : null;
    if (visit && visit.type === 'walkin') {
        gameEvents.carWaitingForRO = 'walkin';
        registerVehicleCheckIn('walkin');
        dmsShowMessage('Walk-in checked in.\nWrite the repair order next.');
    } else if (visit && typeof isFredAppointmentActive === 'function' && isFredAppointmentActive()) {
        gameEvents.carWaitingForRO = 'fred_story';
        if (typeof setFredPhase === 'function') setFredPhase('checked_in');
        registerVehicleCheckIn('fred_story');
        dmsShowMessage('Appointment checked in.\nWrite the repair order next.');
    } else if (visit && typeof isArcAppointmentActive === 'function' && isArcAppointmentActive()) {
        gameEvents.carWaitingForRO = 'story_arc';
        if (typeof setArcPhase === 'function') setArcPhase('checked_in');
        registerVehicleCheckIn('story_arc');
        dmsShowMessage('Appointment checked in.\nWrite the repair order next.');
    } else if (visit) {
        gameEvents.carWaitingForRO = 'daily';
        registerVehicleCheckIn('daily');
        dmsShowMessage('Appointment checked in.\nWrite the repair order next.');
    }
    renderDms();
}

function dmsPerformWriteRo() {
    if (!canDmsWriteRo()) {
        dmsShowMessage('Nothing to write.\nCheck in a vehicle on the drive first.');
        renderDms();
        return;
    }
    closeDms();
    currentChoiceType = 'PC_MAIN';
    if (typeof makeChoice === 'function') {
        makeChoice('DO_CHECKIN', { stopPropagation: function () {} });
    }
}

function dmsPerformClock() {
    if (!canDmsClockOut()) {
        dmsShowMessage('Shift is not over yet.\nKeep handling the drive.');
        renderDms();
        return;
    }
    closeDms();
    activeDialogue = ['End your shift and clock out?', '[CHOICE_END_SHIFT]'];
    activeLine = 0;
    dName.innerText = 'SYSTEM';
    dText.innerText = activeDialogue[0];
    drawPortrait('NONE');
    dContainer.style.display = 'flex';
    if (typeof checkChoiceTrigger === 'function') checkChoiceTrigger();
}

let dmsBannerMessage = '';

function dmsShowMessage(msg) {
    dmsBannerMessage = msg;
}

function getDmsEl() {
    let el = document.getElementById('dms-system');
    if (!el) {
        el = document.createElement('div');
        el.id = 'dms-system';
        el.style.display = 'none';
        el.innerHTML =
            '<div id="dms-header">' +
            '<span id="dms-title">CAR PLANET OS</span>' +
            '<span id="dms-close" onclick="closeDms()">✕</span>' +
            '</div>' +
            '<div id="dms-content"></div>';
        document.getElementById('game-screen').appendChild(el);
    }
    return el;
}

function drawDmsIcon(canvas, kind) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 48, 48);
    ctx.fillStyle = '#6d8fa8';
    ctx.fillRect(0, 0, 48, 48);
    if (kind === 'dashboard') {
        ctx.fillStyle = '#2244cc';
        ctx.fillRect(8, 10, 32, 22);
        ctx.fillStyle = '#fff';
        ctx.fillRect(12, 14, 10, 6);
        ctx.fillRect(26, 14, 10, 6);
        ctx.fillRect(12, 24, 24, 4);
    } else if (kind === 'schedule') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(10, 8, 28, 32);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(12, 12, 24, 4);
        ctx.fillStyle = '#94a3b8';
        for (let i = 0; i < 4; i++) ctx.fillRect(12, 20 + i * 5, 24, 3);
    } else if (kind === 'open') {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(10, 12, 28, 26);
        ctx.fillStyle = '#111';
        ctx.fillRect(14, 18, 20, 2);
        ctx.fillRect(14, 24, 16, 2);
    } else if (kind === 'closed') {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(10, 12, 28, 26);
        ctx.fillStyle = '#fff';
        ctx.fillRect(18, 22, 12, 8);
    } else if (kind === 'checkin') {
        ctx.fillStyle = '#22aa22';
        ctx.fillRect(8, 20, 32, 16);
        ctx.fillStyle = '#fff';
        ctx.fillRect(20, 8, 8, 28);
    } else if (kind === 'write') {
        ctx.fillStyle = '#4a6b8c';
        ctx.fillRect(12, 8, 24, 32);
        ctx.fillStyle = '#fff';
        ctx.fillRect(16, 14, 16, 2);
        ctx.fillRect(16, 20, 12, 2);
    } else if (kind === 'clock') {
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(24, 24, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, 24);
        ctx.lineTo(24, 14);
        ctx.moveTo(24, 24);
        ctx.lineTo(32, 28);
        ctx.stroke();
    }
}

function renderDmsHome() {
    const stats = getDmsDashboardStats();
    let html = '';
    if (dmsBannerMessage) {
        html += '<div class="dms-banner">' + dmsBannerMessage + '</div>';
        dmsBannerMessage = '';
    }
    html += '<div class="dms-row"><span class="dms-label">Advisor</span>' + playerDetails.name + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Day</span>' + gameEvents.currentDay + ' · ' + formatDmsTime(gameEvents.timeMinutes) + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Open ROs</span>' + stats.openCount + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Closed</span>' + stats.closedCount + ' (' + stats.closedToday + ' today)</div>';
    if (stats.probationLine) html += '<div class="dms-row"><span class="dms-label">Probation</span>' + stats.probationLine + '</div>';
    html += '<div class="dms-grid">';
    const items = [
        { k: 'dashboard', label: 'Dashboard', fn: "dmsView='dashboard';renderDms()" },
        { k: 'schedule', label: 'Schedule', fn: "dmsView='schedule';renderDms()" },
        { k: 'open', label: 'Open (' + stats.openCount + ')', fn: "dmsView='open';renderDms()" },
        { k: 'closed', label: 'Closed', fn: "dmsView='closed';renderDms()" },
        { k: 'checkin', label: 'Check In', fn: 'dmsPerformCheckIn()' },
        { k: 'write', label: 'Write RO', fn: 'dmsPerformWriteRo()' },
        { k: 'clock', label: 'Time Clock', fn: 'dmsPerformClock()' }
    ];
    items.forEach((it, i) => {
        html += '<div class="dms-item" onclick="' + it.fn + '"><canvas id="dms-icon-' + i + '" width="48" height="48"></canvas><div class="dms-item-label">' + it.label + '</div></div>';
    });
    html += '</div>';
    return html;
}

function renderDmsDashboard() {
    const stats = getDmsDashboardStats();
    let html = '<button class="dms-back-btn choice-btn" onclick="dmsView=\'home\';renderDms()">◀ BACK</button>';
    html += '<div id="dms-detail-content"><h3>Service Dashboard</h3>';
    html += '<div class="dms-row"><span class="dms-label">Open ROs</span>' + stats.openCount + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Closed ROs</span>' + stats.closedCount + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Next RO #</span>' + stats.nextRo + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Schedule</span>' + stats.schedule + '</div>';
    if (stats.draft) {
        html += '<div class="dms-row"><span class="dms-label">Draft</span>#' + stats.draft.roNumber + ' ' + stats.draft.customerName + '</div>';
    }
    if (stats.carWaiting) html += '<div class="dms-row"><span class="dms-label">Drive</span>Vehicle waiting for RO</div>';
    if (probation.active) {
        html += '<div class="dms-row"><span class="dms-label">CSI</span>' + probation.csiScore + '</div>';
        html += '<div class="dms-row"><span class="dms-label">Service ROs</span>' + (probation.serviceROs || 0) + '</div>';
    }
    html += '</div>';
    return html;
}

function renderDmsSchedule() {
    let html = '<button class="dms-back-btn choice-btn" onclick="dmsView=\'home\';renderDms()">◀ BACK</button>';
    html += '<div id="dms-detail-content"><h3>Today\'s Schedule</h3>';
    if (!gameEvents.dailySchedule || questState.step < 8) {
        html += '<div class="dms-row">Tutorial / pre-schedule mode.</div>';
        if (gameEvents.carWaitingForRO) html += '<div class="dms-row">Vehicle on drive needs an RO.</div>';
    } else {
        const done = gameEvents.dailyAptsCompleted || 0;
        gameEvents.dailySchedule.appointments.forEach((apt, i) => {
            const st = i < done ? 'Done' : i === done ? 'NOW' : 'Upcoming';
            const time = apt.scheduledMinutes ? formatDmsTime(apt.scheduledMinutes) : apt.slot;
            html += '<div class="dms-row"><span class="dms-label">' + st + '</span>' + apt.customer.name + ' · ' + time + '</div>';
        });
        if (gameEvents.dailyWalkIn && gameEvents.dailySchedule.walkIn) {
            const wi = gameEvents.dailyWalkInDone ? 'Done' : 'Pending';
            html += '<div class="dms-row"><span class="dms-label">Walk-in</span>' + wi + ' — ' + gameEvents.dailySchedule.walkIn.name + '</div>';
        }
    }
    html += '</div>';
    return html;
}

function renderRoList(closed) {
    const list = closed ? getClosedOrders() : getOpenOrders();
    let html = '<button class="dms-back-btn choice-btn" onclick="dmsView=\'home\';renderDms()">◀ BACK</button>';
    html += '<div id="dms-detail-content"><h3>' + (closed ? 'Closed' : 'Open') + ' Repair Orders</h3>';
    if (!list.length) {
        html += '<div class="dms-row">No ' + (closed ? 'closed' : 'open') + ' ROs on file.</div>';
    } else {
        list.slice().reverse().forEach(o => {
            const veh = o.vehicle ? formatVehicleLabel(o.vehicle) : '—';
            html += '<div class="dms-ro-line choice-btn" onclick="dmsSelectedRo=\'' + o.id + '\';dmsView=\'detail\';renderDms()">';
            html += '#' + o.roNumber + ' · ' + o.customerName + '<br><span style="color:#555">' + statusLabel(o.status) + ' · ' + veh + '</span></div>';
        });
    }
    html += '</div>';
    return html;
}

function renderRoDetail() {
    const o = findDmsOrder(dmsSelectedRo);
    if (!o) {
        dmsView = 'open';
        return renderRoList(false);
    }
    const veh = o.vehicle ? formatVehicleLabel(o.vehicle) : '—';
    let html = '<button class="dms-back-btn choice-btn" onclick="dmsView=\'open\';renderDms()">◀ BACK</button>';
    html += '<div id="dms-detail-content"><h3>RO #' + o.roNumber + '</h3>';
    html += '<div class="dms-row"><span class="dms-label">Status</span>' + statusLabel(o.status) + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Customer</span>' + o.customerName + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Vehicle</span>' + veh + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Concern</span>' + (o.concern || '—') + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Advisor</span>' + (o.advisor || '—') + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Tech</span>' + (o.tech || 'Unassigned') + '</div>';
    html += '<div class="dms-row"><span class="dms-label">Opened</span>Day ' + o.calendarDay + ' ' + formatDmsTime(o.openedAtMinutes || 420) + '</div>';
    if (o.closedAtMinutes) html += '<div class="dms-row"><span class="dms-label">Closed</span>' + formatDmsTime(o.closedAtMinutes) + '</div>';
    if (o.slot) html += '<div class="dms-row"><span class="dms-label">Slot</span>' + o.slot + '</div>';
    if (o.attitude) html += '<div class="dms-row"><span class="dms-label">Mood</span>' + o.attitude + '</div>';
    html += '</div>';
    return html;
}

function renderDms() {
    const el = getDmsEl();
    const content = el.querySelector('#dms-content');
    const title = el.querySelector('#dms-title');
    title.textContent = 'CAR PLANET OS · DAY ' + gameEvents.currentDay;

    if (dmsView === 'dashboard') content.innerHTML = renderDmsDashboard();
    else if (dmsView === 'schedule') content.innerHTML = renderDmsSchedule();
    else if (dmsView === 'open') content.innerHTML = renderRoList(false);
    else if (dmsView === 'closed') content.innerHTML = renderRoList(true);
    else if (dmsView === 'detail') content.innerHTML = renderRoDetail();
    else content.innerHTML = renderDmsHome();

    if (dmsView === 'home') {
        const items = ['dashboard', 'schedule', 'open', 'closed', 'checkin', 'write', 'clock'];
        items.forEach((k, i) => {
            const c = document.getElementById('dms-icon-' + i);
            if (c) drawDmsIcon(c, k);
        });
    }
}

function openDms() {
    ensureDmsState();
    syncActiveRoFromQuest();
    dmsView = 'home';
    dmsSelectedRo = null;
    dmsBannerMessage = '';
    gameState = 'DMS';
    dContainer.style.display = 'none';
    activeDialogue = null;
    const el = getDmsEl();
    el.style.display = 'flex';
    renderDms();
}

function closeDms() {
    const el = document.getElementById('dms-system');
    if (el) el.style.display = 'none';
    if (gameState === 'DMS') gameState = 'PLAYING';
}

function shouldOpenDmsAtDesk() {
    if (questState.step === 5 && gameEvents.pendingMikeOfficePage) return false;
    if (questState.active && questState.step >= 1 && questState.step <= 4 && questState.step === 2) return false;
    return true;
}

function getDmsOpenRosSummary() {
    const open = getOpenOrders();
    if (!open.length) return 'No open repair orders on file.';
    return open.length + ' open RO(s):\n' + open.map(o =>
        '#' + o.roNumber + ' ' + o.customerName + ' — ' + statusLabel(o.status)
    ).join('\n');
}

function getDmsClosedRosSummary() {
    const closed = getClosedOrders();
    if (!closed.length) return 'No closed ROs yet.';
    const recent = closed.slice(-5).reverse();
    return closed.length + ' closed total. Recent:\n' + recent.map(o =>
        '#' + o.roNumber + ' ' + o.customerName
    ).join('\n');
}

window.ensureDmsState = ensureDmsState;
window.registerVehicleCheckIn = registerVehicleCheckIn;
window.onRepairOrderPrinted = onRepairOrderPrinted;
window.syncActiveRoFromQuest = syncActiveRoFromQuest;
window.setDmsOrderStatus = setDmsOrderStatus;
window.openDms = openDms;
window.closeDms = closeDms;
window.renderDms = renderDms;
window.shouldOpenDmsAtDesk = shouldOpenDmsAtDesk;
window.getDmsOpenRosSummary = getDmsOpenRosSummary;
window.getDmsClosedRosSummary = getDmsClosedRosSummary;
window.dmsPerformCheckIn = dmsPerformCheckIn;
window.dmsPerformWriteRo = dmsPerformWriteRo;
window.dmsPerformClock = dmsPerformClock;
