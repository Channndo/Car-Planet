/* Drive-in / drive-out on the service drive. Shop dispatch still uses triggerFlash(). */

const customerAnim = {
    active: false,
    mode: null,
    phase: 'idle',
    waitFrames: 0,
    onComplete: null
};

const DRIVE_PARK = { carTx: 4, carTy: 3, custTx: 7, custTy: 4, doorTx: 5, doorTy: 4 };
const DRIVE_ENTRY = { carTx: 0, carTy: 10 };
const DRIVE_EXIT = { carTx: 0, carTy: 12 };

const TILE_SOLID = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45, 50, 51, 52, 53, 54, 55, 56, 57];

function getDriveCustomerNpcs() {
    if (!maps.drive) return { cust: null, car: null };
    return {
        cust: maps.drive.npcs.find(n => n.id === 'angry_customer'),
        car: maps.drive.npcs.find(n => n.id === 'customer_car')
    };
}

function saveDriveCustomerHome() {
    const { cust, car } = getDriveCustomerNpcs();
    if (cust && cust._homeTx === undefined) {
        cust._homeTx = cust.tx;
        cust._homeTy = cust.ty;
        cust._homeDir = cust.dir || 'up';
    }
    if (car && car._homeTx === undefined) {
        car._homeTx = car.tx;
        car._homeTy = car.ty;
    }
}

function ensureNpcMotion(npc) {
    if (!npc) return;
    if (npc.x === undefined) npc.x = npc.tx * TILE_SIZE;
    if (npc.y === undefined) npc.y = npc.ty * TILE_SIZE;
    if (npc.isMoving === undefined) npc.isMoving = false;
    if (npc.moveTimer === undefined) npc.moveTimer = 0;
    if (npc.speed === undefined) npc.speed = 2;
}

function snapNpc(npc) {
    if (!npc) return;
    npc.x = npc.tx * TILE_SIZE;
    npc.y = npc.ty * TILE_SIZE;
    npc.isMoving = false;
    npc.moveTimer = 0;
}

function isTileBlockedForCar(tx, ty, skipNpcIds) {
    if (tx < 0 || ty < 0 || ty >= MAP_ROWS || tx + 2 >= MAP_COLS) return true;
    for (let dx = 0; dx < 3; dx++) {
        const t = maps.drive.layout[ty][tx + dx];
        if (TILE_SOLID.includes(t)) return true;
    }
    skipNpcIds = skipNpcIds || [];
    return maps.drive.npcs.some(n => {
        if (n.hidden || skipNpcIds.includes(n.id)) return false;
        if (n.charCode === 'CAR' || n.charCode === 'SUV_BLACK' || n.charCode === 'WRECK_CAR') {
            return tx <= n.tx + 2 && tx + 2 >= n.tx && ty >= n.ty && ty <= n.ty + 1;
        }
        if (!n.isObject) return n.tx >= tx && n.tx <= tx + 2 && n.ty === ty;
        return false;
    });
}

function carStepToward(car, targetTx, targetTy, speed, skipIds) {
    if (!car || car.isMoving) return false;
    if (car.tx === targetTx && car.ty === targetTy) return false;

    let nx = car.tx;
    let ny = car.ty;
    const dx = targetTx - car.tx;
    const dy = targetTy - car.ty;
    if (Math.abs(dx) >= Math.abs(dy)) nx += dx > 0 ? 1 : -1;
    else ny += dy > 0 ? 1 : -1;

    const tries = [
        { tx: nx, ty: ny },
        { tx: car.tx + (dx !== 0 ? (dx > 0 ? 1 : -1) : 0), ty: car.ty },
        { tx: car.tx, ty: car.ty + (dy !== 0 ? (dy > 0 ? 1 : -1) : 0) }
    ];

    for (let i = 0; i < tries.length; i++) {
        const t = tries[i];
        if (!isTileBlockedForCar(t.tx, t.ty, skipIds)) {
            if (t.tx > car.tx) car.dir = 'right';
            else if (t.tx < car.tx) car.dir = 'left';
            else if (t.ty > car.ty) car.dir = 'down';
            else car.dir = 'up';
            car.tx = t.tx;
            car.ty = t.ty;
            car.isMoving = true;
            car.moveTimer = 0;
            car.speed = speed || 2;
            return true;
        }
    }
    return false;
}

function advanceCarMotion(car) {
    if (!car || !car.isMoving) return;
    const dir = car.dir || 'right';
    if (dir === 'up') car.y -= car.speed;
    if (dir === 'down') car.y += car.speed;
    if (dir === 'left') car.x -= car.speed;
    if (dir === 'right') car.x += car.speed;
    car.moveTimer += car.speed;
    if (car.moveTimer >= TILE_SIZE) {
        car.isMoving = false;
        car.moveTimer = 0;
        car.x = car.tx * TILE_SIZE;
        car.y = car.ty * TILE_SIZE;
    }
}

function npcStepTowardSimple(npc, targetTx, targetTy, speed) {
    if (!npc || npc.isMoving) return false;
    if (npc.tx === targetTx && npc.ty === targetTy) return false;
    let nx = npc.tx;
    let ny = npc.ty;
    const dx = targetTx - npc.tx;
    const dy = targetTy - npc.ty;
    if (Math.abs(dx) >= Math.abs(dy)) nx += dx > 0 ? 1 : -1;
    else ny += dy > 0 ? 1 : -1;

    if (!isSolid(nx, ny) && !(nx === player.tx && ny === player.ty)) {
        if (nx > npc.tx) npc.dir = 'right';
        else if (nx < npc.tx) npc.dir = 'left';
        else if (ny > npc.ty) npc.dir = 'down';
        else npc.dir = 'up';
        npc.tx = nx;
        npc.ty = ny;
        npc.isMoving = true;
        npc.moveTimer = 0;
        npc.speed = speed || 2;
        return true;
    }
    return false;
}

function advanceNpcMotionSimple(npc) {
    if (!npc || !npc.isMoving) return;
    if (npc.dir === 'up') npc.y -= npc.speed;
    if (npc.dir === 'down') npc.y += npc.speed;
    if (npc.dir === 'left') npc.x -= npc.speed;
    if (npc.dir === 'right') npc.x += npc.speed;
    npc.moveTimer += npc.speed;
    if (npc.moveTimer >= TILE_SIZE) {
        npc.isMoving = false;
        npc.moveTimer = 0;
        npc.x = npc.tx * TILE_SIZE;
        npc.y = npc.ty * TILE_SIZE;
    }
}

function isCustomerAnimActive() {
    return customerAnim.active;
}

function beginCustomerScene(mode, onComplete) {
    if (customerAnim.active) return false;
    const { cust, car } = getDriveCustomerNpcs();
    if (!cust || !car) {
        if (onComplete) onComplete();
        return false;
    }

    saveDriveCustomerHome();
    customerAnim.active = true;
    customerAnim.mode = mode;
    customerAnim.onComplete = onComplete || null;
    customerAnim.waitFrames = 0;
    gameState = 'CUSTOMER_SCENE';
    gameEvents.storyTimeFrozen = true;

    if (mode === 'arrive') {
        cust.hidden = true;
        car.hidden = false;
        car.tx = DRIVE_ENTRY.carTx;
        car.ty = DRIVE_ENTRY.carTy;
        snapNpc(car);
        car.dir = 'up';
        customerAnim.phase = 'car_in';
    } else {
        cust.hidden = false;
        car.hidden = false;
        snapNpc(cust);
        snapNpc(car);
        customerAnim.phase = 'walk_to_car';
    }
    return true;
}

function finishCustomerScene() {
    customerAnim.active = false;
    customerAnim.mode = null;
    customerAnim.phase = 'idle';
    gameEvents.storyTimeFrozen = false;
    gameState = 'PLAYING';
    const done = customerAnim.onComplete;
    customerAnim.onComplete = null;
    if (done) done();
}

function updateCustomerArrival() {
    if (!customerAnim.active || currentMapKey !== 'drive') return;

    const { cust, car } = getDriveCustomerNpcs();
    if (!cust || !car) {
        finishCustomerScene();
        return;
    }

    ensureNpcMotion(cust);
    advanceCarMotion(car);
    advanceNpcMotionSimple(cust);

    if (customerAnim.mode === 'arrive') {
        if (customerAnim.phase === 'car_in') {
            if (!car.isMoving && car.tx === DRIVE_PARK.carTx && car.ty === DRIVE_PARK.carTy) {
                customerAnim.phase = 'pause_door';
                customerAnim.waitFrames = 24;
                return;
            }
            if (!car.isMoving) carStepToward(car, DRIVE_PARK.carTx, DRIVE_PARK.carTy, 2, ['customer_car', 'angry_customer']);
            return;
        }
        if (customerAnim.phase === 'pause_door') {
            customerAnim.waitFrames--;
            if (customerAnim.waitFrames <= 0) {
                cust.hidden = false;
                cust.tx = DRIVE_PARK.doorTx;
                cust.ty = DRIVE_PARK.doorTy;
                cust.dir = 'left';
                snapNpc(cust);
                customerAnim.phase = 'walk_to_spot';
            }
            return;
        }
        if (customerAnim.phase === 'walk_to_spot') {
            if (!cust.isMoving && cust.tx === DRIVE_PARK.custTx && cust.ty === DRIVE_PARK.custTy) {
                cust.dir = 'up';
                finishCustomerScene();
                return;
            }
            if (!cust.isMoving) npcStepTowardSimple(cust, DRIVE_PARK.custTx, DRIVE_PARK.custTy, 2);
            return;
        }
    }

    if (customerAnim.mode === 'depart') {
        if (customerAnim.phase === 'walk_to_car') {
            if (!cust.isMoving && cust.tx === DRIVE_PARK.doorTx && cust.ty === DRIVE_PARK.doorTy) {
                cust.hidden = true;
                customerAnim.phase = 'car_out';
                car.dir = 'down';
                return;
            }
            if (!cust.isMoving) npcStepTowardSimple(cust, DRIVE_PARK.doorTx, DRIVE_PARK.doorTy, 2);
            return;
        }
        if (customerAnim.phase === 'car_out') {
            if (!car.isMoving && car.tx === DRIVE_EXIT.carTx && car.ty === DRIVE_EXIT.carTy) {
                car.hidden = true;
                cust.hidden = true;
                finishCustomerScene();
                return;
            }
            if (!car.isMoving) carStepToward(car, DRIVE_EXIT.carTx, DRIVE_EXIT.carTy, 2, ['customer_car', 'angry_customer']);
        }
    }
}

function presentDriveCustomer(onReady) {
    if (currentMapKey !== 'drive') {
        if (onReady) onReady();
        return;
    }
    if (beginCustomerScene('arrive', function () {
        if (typeof notifyDriveCustomerPresent === 'function') notifyDriveCustomerPresent('arrive');
        if (onReady) onReady();
    })) return;
    const { cust, car } = getDriveCustomerNpcs();
    if (cust) cust.hidden = false;
    if (car) car.hidden = false;
    if (typeof notifyDriveCustomerPresent === 'function') notifyDriveCustomerPresent('spawn');
    if (onReady) onReady();
}

function dismissDriveCustomer(onDone) {
    const { cust, car } = getDriveCustomerNpcs();
    if (!cust || !car || (cust.hidden && car.hidden)) {
        hideDriveCustomerSlotsInstant();
        if (onDone) onDone();
        return;
    }
    if (currentMapKey !== 'drive') {
        hideDriveCustomerSlotsInstant();
        if (onDone) onDone();
        return;
    }
    if (!beginCustomerScene('depart', function () {
        hideDriveCustomerSlotsInstant();
        if (onDone) onDone();
    })) {
        hideDriveCustomerSlotsInstant();
        if (onDone) onDone();
    }
}

function hideDriveCustomerSlotsInstant() {
    const { cust, car } = getDriveCustomerNpcs();
    if (cust) cust.hidden = true;
    if (car) car.hidden = true;
}

/** Shop dispatch — flash wipe, car on drive vanishes and shop_car appears (unchanged). */
function dispatchVehicleToShopWithFlash() {
    triggerFlash();
}

window.isCustomerAnimActive = isCustomerAnimActive;
window.updateCustomerArrival = updateCustomerArrival;
window.presentDriveCustomer = presentDriveCustomer;
window.dismissDriveCustomer = dismissDriveCustomer;
window.hideDriveCustomerSlotsInstant = hideDriveCustomerSlotsInstant;
window.dispatchVehicleToShopWithFlash = dispatchVehicleToShopWithFlash;
