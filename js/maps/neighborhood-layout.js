/* Phase E — neighborhood tile layouts (does not modify dealership-layout.js) */

function syncAutoworldRivalName() {
    if (!maps.autoworld || !playerDetails) return;
    const rival = maps.autoworld.npcs.find(n => n.id === 'aw_rival_tech');
    if (rival) {
        rival.name = playerDetails.rivalName || 'KASEY';
        rival.dialogue = [
            `Whatever, ${playerDetails.name}.\nThis is MY lane.`,
            "Mike wouldn't even let me\nwork at Car Planet.",
            "AUTOWORLD pays time, not\nflat-rate tears."
        ];
    }
}

function applyNeighborhoodLayouts() {
    const street = maps.street.layout;
    const gas = maps.gas_station.layout;
    const liquor = maps.liquor_store.layout;
    const food = maps.fast_food.layout;
    const aw = maps.autoworld.layout;
    const pl = maps.parkinglot.layout;

    syncAutoworldRivalName();

    /* Parking lot — south exit to Main Street */
    pl[13][9] = 9;
    pl[13][10] = 9;

    /* Liquor annex — east wing, next door to Car Planet (right) */
    for (let y = 4; y <= 8; y++) {
        for (let x = 16; x <= 18; x++) {
            pl[y][x] = 2;
        }
    }
    pl[4][16] = 8;
    pl[5][16] = 9;
    pl[6][16] = 9;
    pl[4][17] = 8;
    pl[5][17] = 9;

    /* ── Main Street (outdoor) ── */
    for (let y = 1; y <= 12; y++) {
        for (let x = 1; x <= 18; x++) {
            street[y][x] = (y >= 6 && y <= 10 && x >= 4 && x <= 15) ? 47 : 46;
        }
    }
    for (let x = 4; x <= 15; x++) street[8][x] = 48;
    for (let y = 11; y <= 12; y++) {
        for (let x = 8; x <= 11; x++) street[y][x] = 46;
    }
    street[13][9] = 9;
    street[13][10] = 9;

    /* Crosswalk — lot to Clutch Burger across the street */
    for (let x = 8; x <= 11; x++) {
        street[11][x] = 48;
        street[12][x] = 46;
    }

    /* North-side storefronts (across from parking) */
    for (let x = 1; x <= 5; x++) for (let y = 1; y <= 4; y++) street[y][x] = 2;
    for (let x = 7; x <= 12; x++) for (let y = 1; y <= 4; y++) street[y][x] = 2;
    for (let x = 13; x <= 16; x++) for (let y = 1; y <= 4; y++) street[y][x] = 2;
    for (let x = 17; x <= 18; x++) for (let y = 1; y <= 4; y++) street[y][x] = 57;

    street[3][2] = 50;
    street[3][3] = 8;
    street[4][3] = 9;
    street[4][4] = 9;

    street[3][9] = 50;
    street[3][10] = 8;
    street[4][9] = 9;
    street[4][10] = 9;

    street[3][13] = 50;
    street[3][14] = 8;
    street[4][13] = 9;
    street[4][14] = 9;

    street[3][17] = 57;
    street[3][18] = 8;
    street[4][17] = 9;
    street[4][18] = 9;

    /* ── Quick Fill Gas ── */
    for (let y = 1; y <= 12; y++) {
        for (let x = 1; x <= 18; x++) gas[y][x] = 21;
    }
    gas[13][9] = 9;
    gas[13][10] = 9;
    for (let x = 1; x <= 18; x++) gas[1][x] = 7;
    gas[4][3] = 51;
    gas[4][4] = 51;
    gas[4][7] = 51;
    gas[4][8] = 51;
    gas[10][2] = 52;
    gas[10][3] = 52;
    gas[8][14] = 12;
    gas[8][15] = 12;

    /* ── Last Call Liquors ── */
    for (let y = 1; y <= 12; y++) {
        for (let x = 1; x <= 18; x++) liquor[y][x] = 21;
    }
    liquor[13][9] = 9;
    liquor[13][10] = 9;
    for (let x = 1; x <= 18; x++) liquor[1][x] = 7;
    liquor[8][1] = 9;
    liquor[9][1] = 9;
    for (let y = 7; y <= 10; y++) liquor[y][2] = 21;
    for (let y = 2; y <= 6; y++) {
        liquor[y][2] = 52;
        liquor[y][4] = 52;
        liquor[y][6] = 52;
    }
    liquor[5][16] = 54;
    liquor[6][16] = 54;
    liquor[8][9] = 12;
    liquor[8][10] = 12;

    /* ── Clutch Burger (across the street) ── */
    for (let y = 1; y <= 12; y++) {
        for (let x = 1; x <= 18; x++) food[y][x] = 21;
    }
    food[13][9] = 9;
    food[13][10] = 9;
    for (let x = 1; x <= 18; x++) food[1][x] = 7;
    food[3][3] = 55;
    food[3][4] = 55;
    food[7][9] = 53;
    food[7][10] = 53;
    food[7][11] = 53;
    food[10][14] = 56;
    food[10][15] = 56;
    food[11][5] = 56;

    /* ── AUTOWORLD rival lot ── */
    for (let y = 1; y <= 12; y++) {
        for (let x = 1; x <= 18; x++) aw[y][x] = 0;
    }
    for (let y = 3; y <= 11; y++) {
        for (let x = 3; x <= 16; x++) aw[y][x] = 2;
    }
    aw[13][9] = 9;
    aw[13][10] = 9;
    aw[3][9] = 8;
    aw[3][10] = 8;
    aw[4][9] = 9;
    aw[4][10] = 9;
    aw[1][9] = 57;
    aw[1][10] = 57;
    aw[6][5] = 47;
    aw[6][6] = 47;
    aw[6][7] = 47;
    aw[6][8] = 47;
    aw[6][9] = 47;
    aw[6][10] = 47;
    aw[6][11] = 47;
    aw[6][12] = 47;
    aw[7][5] = 48;
    aw[7][6] = 48;
    aw[7][7] = 48;
    aw[7][8] = 48;
    aw[7][9] = 48;
    aw[7][10] = 48;
    aw[7][11] = 48;
    aw[7][12] = 48;
}

function applyParkingStreetWarps() {
    const warps = maps.parkinglot.warps;
    const exits = [
        { tx: 9, ty: 13, to: 'street', px: 9, py: 12 },
        { tx: 10, ty: 13, to: 'street', px: 10, py: 12 },
        { tx: 16, ty: 4, to: 'liquor_store', px: 2, py: 8 },
        { tx: 16, ty: 5, to: 'liquor_store', px: 2, py: 9 }
    ];
    exits.forEach((w) => {
        if (!warps.some((e) => e.to === w.to && e.tx === w.tx && e.ty === w.ty)) {
            warps.push(w);
        }
    });
}

window.syncAutoworldRivalName = syncAutoworldRivalName;
