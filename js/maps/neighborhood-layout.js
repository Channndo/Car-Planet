/* Phase E — neighborhood tile layouts (does not modify dealership-layout.js) */
function applyNeighborhoodLayouts() {
    const street = maps.street.layout;
    const gas = maps.gas_station.layout;
    const liquor = maps.liquor_store.layout;
    const food = maps.fast_food.layout;
    const pl = maps.parkinglot.layout;

    /* Parking lot — south exit to Main Street (tiles only; dealership warps in neighborhood hook) */
    pl[13][9] = 9;
    pl[13][10] = 9;

    /* ── Main Street (outdoor) ── */
    for (let y = 1; y <= 12; y++) {
        for (let x = 1; x <= 18; x++) {
            street[y][x] = (y >= 6 && y <= 10 && x >= 5 && x <= 14) ? 47 : 46;
        }
    }
    for (let x = 5; x <= 14; x++) street[8][x] = 48;
    for (let y = 11; y <= 12; y++) {
        for (let x = 8; x <= 11; x++) street[y][x] = 46;
    }
    street[13][9] = 9;
    street[13][10] = 9;

    for (let x = 1; x <= 5; x++) for (let y = 1; y <= 4; y++) street[y][x] = 2;
    for (let x = 14; x <= 18; x++) for (let y = 1; y <= 4; y++) street[y][x] = 2;
    for (let x = 7; x <= 12; x++) for (let y = 1; y <= 4; y++) street[y][x] = 2;

    street[3][2] = 50;
    street[3][3] = 8;
    street[4][3] = 9;
    street[4][4] = 9;
    street[3][9] = 50;
    street[3][10] = 8;
    street[4][9] = 9;
    street[4][10] = 9;
    street[3][15] = 50;
    street[3][16] = 8;
    street[4][15] = 9;
    street[4][16] = 9;

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
    for (let y = 2; y <= 6; y++) {
        liquor[y][2] = 52;
        liquor[y][4] = 52;
        liquor[y][6] = 52;
    }
    liquor[5][16] = 54;
    liquor[6][16] = 54;
    liquor[8][9] = 12;
    liquor[8][10] = 12;

  /* ── Clutch Burger ── */
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
}

function applyParkingStreetWarps() {
    const warps = maps.parkinglot.warps;
    const exits = [
        { tx: 9, ty: 13, to: 'street', px: 9, py: 12 },
        { tx: 10, ty: 13, to: 'street', px: 10, py: 12 }
    ];
    exits.forEach((w) => {
        if (!warps.some((e) => e.to === w.to && e.tx === w.tx && e.ty === w.ty)) {
            warps.push(w);
        }
    });
}
