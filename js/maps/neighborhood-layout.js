/* Phase E layouts disabled — dealership parking lot only */

const DISABLED_OUTDOOR_MAPS = ['liquor_store', 'street', 'gas_station', 'fast_food', 'autoworld'];

function syncAutoworldRivalName() {}

function applyNeighborhoodLayouts() {
    if (!maps.parkinglot || !maps.parkinglot.layout) return;
    const pl = maps.parkinglot.layout;
    /* Remove old Last Call annex walls/doors on the east edge of the lot */
    for (let y = 3; y <= 12; y++) {
        for (let x = 16; x <= 18; x++) {
            if (pl[y] && pl[y][x] !== undefined) pl[y][x] = 0;
        }
    }
}

function stripDisabledOutdoorWarps() {
    const blocked = DISABLED_OUTDOOR_MAPS;
    Object.keys(maps).forEach(function (key) {
        const m = maps[key];
        if (!m || !m.warps) return;
        m.warps = m.warps.filter(function (w) { return blocked.indexOf(w.to) === -1; });
    });
}

function applyParkingStreetWarps() {
    stripDisabledOutdoorWarps();
}

window.syncAutoworldRivalName = syncAutoworldRivalName;
window.applyNeighborhoodLayouts = applyNeighborhoodLayouts;
window.applyParkingStreetWarps = applyParkingStreetWarps;
window.stripDisabledOutdoorWarps = stripDisabledOutdoorWarps;
