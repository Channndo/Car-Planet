/* Spawn core / procedural customers on the service drive */

const PROC_SKINS = ['#ffccaa', '#ffdbac', '#f1c27d', '#c68642', '#e8b898', '#8d5524', '#dcb'];
const PROC_SHIRTS = ['#111', '#222', '#444', '#2c5a8c', '#cc2222', '#228822', '#663399'];

function ensureRosterState() {
    if (!probation.metCustomerIds) probation.metCustomerIds = [];
    if (!gameEvents.dailySchedule) gameEvents.dailySchedule = null;
}

function markCustomerMet(customer) {
    ensureRosterState();
    if (customer.isProcedural) return;
    if (!probation.metCustomerIds.includes(customer.id)) {
        probation.metCustomerIds.push(customer.id);
    }
}

function cloneCustomer(c) {
    return JSON.parse(JSON.stringify(c));
}

function generateProceduralCustomer(excludeIds) {
    const vehicle = buildVehicle();
    return {
        id: 'proc_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
        isProcedural: true,
        name: randomProceduralName(),
        dexEntry: 'Walk-in guest. Not on the roster yet.',
        personalityLine: 'I just need someone to look at it.',
        complaintPool: [
            'Something sounds wrong when I accelerate.',
            'Fluid spot under the car.',
            'Steering feels loose.',
            'Warning light on the dash.'
        ],
        portrait: {
            skin: PROC_SKINS[Math.floor(Math.random() * PROC_SKINS.length)],
            shirt: PROC_SHIRTS[Math.floor(Math.random() * PROC_SHIRTS.length)],
            sleeves: Math.random() < 0.5 ? 'short' : 'long',
            hair: Math.random() < 0.7 ? '#222' : '#4a3121'
        },
        vehicle: vehicle,
        carNote: 'Unfamiliar vehicle on the drive.'
    };
}

function pickWalkInCustomer(appointmentIds) {
    if (Math.random() < 0.3) {
        const core = getRandomCoreCustomers(1, appointmentIds);
        if (core.length) return cloneCustomer(core[0]);
    }
    return generateProceduralCustomer(appointmentIds);
}

function getAppointmentSlotName(index) {
    return index === 0 ? 'morning' : index === 1 ? 'mid-day' : 'afternoon';
}

function generateDailyCustomerSchedule() {
    if (questState.step < 8) return;
    ensureRosterState();

    let appointments;
    let appointmentIds;

    if (gameEvents.currentDay === 2 && typeof buildFredNandersCustomer === 'function') {
        const morning = getRandomCoreCustomers(1, [151])[0];
        const afternoon = getRandomCoreCustomers(1, [151, morning.id])[0];
        const fred = buildFredNandersCustomer();
        appointments = [
            {
                customerId: morning.id,
                customer: cloneCustomer(morning),
                slot: 'morning',
                attitude: rollAttitude(),
                scheduledMinutes: 450
            },
            {
                customerId: fred.id,
                customer: fred,
                slot: 'mid-day',
                attitude: rollAttitude(),
                scheduledMinutes: 720,
                storyId: 'fred_oil_change_day2'
            },
            {
                customerId: afternoon.id,
                customer: cloneCustomer(afternoon),
                slot: 'afternoon',
                attitude: rollAttitude(),
                scheduledMinutes: 900
            }
        ];
        appointmentIds = appointments.map(a => a.customerId);
        gameEvents.fredStoryActive = true;
        gameEvents.fredStoryPhase = 'idle';
        gameEvents.fredStoryComplete = false;
        gameEvents.fredNoonPing = false;
        gameEvents.fredStoryPaDoneForPhase = null;
        if (typeof clearFredTimer === 'function') clearFredTimer();
    } else {
        const arc = typeof getStoryArcForToday === 'function' ? getStoryArcForToday() : null;
        if (arc) {
            const others = getRandomCoreCustomers(2, [arc.customerId]);
            const arcCustomer = buildArcCustomer(arc);
            appointments = [
                {
                    customerId: others[0].id,
                    customer: cloneCustomer(others[0]),
                    slot: 'morning',
                    attitude: rollAttitude(),
                    scheduledMinutes: 450
                },
                {
                    customerId: arcCustomer.id,
                    customer: arcCustomer,
                    slot: 'mid-day',
                    attitude: rollAttitude(),
                    scheduledMinutes: 720,
                    storyId: arc.id
                },
                {
                    customerId: others[1].id,
                    customer: cloneCustomer(others[1]),
                    slot: 'afternoon',
                    attitude: rollAttitude(),
                    scheduledMinutes: 900
                }
            ];
            appointmentIds = appointments.map(a => a.customerId);
            initArcStateForToday(arc);
        } else {
            if (gameEvents.storyArc && gameEvents.storyArc.day !== gameEvents.currentDay) gameEvents.storyArc = null;
            const three = getRandomCoreCustomers(3, []);
            appointmentIds = three.map(c => c.id);
            appointments = three.map((c, i) => ({
                customerId: c.id,
                customer: cloneCustomer(c),
                slot: getAppointmentSlotName(i),
                attitude: rollAttitude()
            }));
        }
    }

    gameEvents.dailySchedule = {
        appointments: appointments,
        walkIn: null,
        walkInAttitude: null
    };

    gameEvents.dailyWalkIn = Math.random() < 0.3;
    if (gameEvents.dailyWalkIn) {
        const walkCustomer = pickWalkInCustomer(appointmentIds);
        gameEvents.dailySchedule.walkIn = walkCustomer;
        gameEvents.dailySchedule.walkInAttitude = rollAttitude();
    }

    gameEvents.intradayWalkInRolled = false;
    if (probation.active) reserveStoryEventSlot(gameEvents.currentDay);
    spawnCurrentDriveCustomer();
}

function resolveActiveVisit() {
    if (!gameEvents.dailySchedule || questState.step < 8) return null;
    const sched = gameEvents.dailySchedule;

    if (gameEvents.dailyAptsCompleted < 3) {
        const apt = sched.appointments[gameEvents.dailyAptsCompleted];
        if (!apt) return null;
        if (apt.scheduledMinutes != null && gameEvents.timeMinutes < apt.scheduledMinutes) return null;
        return {
            type: 'appointment',
            customer: apt.customer,
            attitude: apt.attitude,
            slot: apt.slot
        };
    }
    if (gameEvents.dailyWalkIn && !gameEvents.dailyWalkInDone && sched.walkIn) {
        return {
            type: 'walkin',
            customer: sched.walkIn,
            attitude: sched.walkInAttitude,
            slot: null
        };
    }
    return null;
}

function applyCustomerToDriveNpc(npc, customer, visit) {
    if (!npc || !customer) return;
    npc.hidden = false;
    npc.name = customer.name;
    npc.color = customer.portrait.skin;
    npc.shirt = customer.portrait.shirt;
    npc.sleeves = customer.portrait.sleeves;
    npc.hair = customer.portrait.hair;
    npc.acc = customer.portrait.acc || undefined;
    npc.charCode = visit.type === 'walkin' ? 'WALK-IN' : 'APPOINTMENT';
    if (customer.storyId === 'fred_oil_change_day2' || customer.id === 151) {
        npc._portraitCode = 'FRED_NANDERS';
    } else {
        npc._portraitCode = null;
    }
    npc.dialogue = buildCustomerDialogue(customer, visit.attitude, visit.type === 'walkin' ? 'walkin' : 'appointment');
    npc._visitCustomerId = customer.id;
    markCustomerMet(customer);
}

function applyVehicleToDriveCar(carNpc, customer) {
    if (!carNpc || !customer || !customer.vehicle) return;
    carNpc.hidden = false;
    carNpc.name = formatVehicleLabel(customer.vehicle);
    carNpc.dialogue = buildCarDialogue(customer);
    carNpc._vehicleColor = customer.vehicle.color;
    carNpc._vehicleDirty = !!(customer.portrait && customer.portrait.acc && customer.portrait.acc.dirty);
}

const DRIVE_CUSTOMER_HOME = {
    angry_customer: { tx: 8, ty: 3, dir: 'up' },
    customer_car: { tx: 4, ty: 3 }
};

/** Park John / daily customer at fixed tiles — no pixel drift or drive-in motion. */
function resetDriveCustomerSlots() {
    if (!maps.drive) return;
    const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
    const car = maps.drive.npcs.find(n => n.id === 'customer_car');
    if (cust) {
        cust.tx = DRIVE_CUSTOMER_HOME.angry_customer.tx;
        cust.ty = DRIVE_CUSTOMER_HOME.angry_customer.ty;
        cust.dir = DRIVE_CUSTOMER_HOME.angry_customer.dir;
        delete cust.x;
        delete cust.y;
        delete cust.isMoving;
        delete cust.moveTimer;
        delete cust.speed;
        delete cust._homeTx;
        delete cust._homeTy;
        delete cust._homeDir;
    }
    if (car) {
        car.tx = DRIVE_CUSTOMER_HOME.customer_car.tx;
        car.ty = DRIVE_CUSTOMER_HOME.customer_car.ty;
        delete car.x;
        delete car.y;
        delete car.isMoving;
        delete car.moveTimer;
        delete car.speed;
        delete car._homeTx;
        delete car._homeTy;
    }
}

function hideDriveCustomerSlots() {
    const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
    const car = maps.drive.npcs.find(n => n.id === 'customer_car');
    resetDriveCustomerSlots();
    if (cust) cust.hidden = true;
    if (car) car.hidden = true;
}

function spawnCurrentDriveCustomer() {
    if (questState.step < 8) return;

    const visit = resolveActiveVisit();
    const cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
    const car = maps.drive.npcs.find(n => n.id === 'customer_car');
    const sc = maps.shop.npcs.find(n => n.id === 'shop_car');
    if (sc) sc.hidden = false;

    if (!visit || gameEvents.isAfterHours) {
        hideDriveCustomerSlots();
        return;
    }

    resetDriveCustomerSlots();
    applyCustomerToDriveNpc(cust, visit.customer, visit);
    applyVehicleToDriveCar(car, visit.customer);
    if (typeof notifyDriveCustomerPresent === 'function') notifyDriveCustomerPresent('spawn');
}

window.resetDriveCustomerSlots = resetDriveCustomerSlots;

function syncDriveDailyCustomers() {
    if (questState.step >= 8 && !gameEvents.isAfterHours) {
        if (!gameEvents.dailySchedule) generateDailyCustomerSchedule();
        else spawnCurrentDriveCustomer();
    }
}

function getRosterSummaryText() {
    const met = (probation.metCustomerIds || []).length;
    return 'ROSTER: ' + met + ' / ' + CORE_CUSTOMERS.length + ' customers met.\n(Procedural walk-ins are not cataloged.)';
}

function showRosterMenu() {
    toggleStartMenu();
    let lines = getRosterSummaryText() + '\n\n';
    const met = probation.metCustomerIds || [];
    CORE_CUSTOMERS.forEach(c => {
        const seen = met.includes(c.id);
        lines += (seen ? '#' + String(c.id).padStart(2, '0') + ' ' + c.name : '???') + '\n';
        if (seen && c.dexEntry) lines += '  "' + c.dexEntry + '"\n';
    });
    alert(lines);
}

window.showRosterMenu = showRosterMenu;
