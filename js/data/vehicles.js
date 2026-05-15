/* Ford / Lincoln vehicle pool for customers */
const FORD_MODELS = ['F-150', 'Explorer', 'Escape', 'Bronco', 'Edge', 'Mustang', 'Fusion', 'Ranger', 'Expedition', 'Maverick', 'Focus', 'Taurus'];
const LINCOLN_MODELS = ['Navigator', 'Aviator', 'Corsair', 'Nautilus', 'MKZ'];
const VEHICLE_COLORS = ['#3a5a80', '#2244cc', '#cc2222', '#228822', '#222222', '#888888', '#151515', '#8b4513'];

function pickVehicleMake() {
    return Math.random() < 0.8 ? 'Ford' : 'Lincoln';
}

function pickVehicleModel(make) {
    const pool = make === 'Lincoln' ? LINCOLN_MODELS : FORD_MODELS;
    return pool[Math.floor(Math.random() * pool.length)];
}

function pickVehicleYear() {
    return 2016 + Math.floor(Math.random() * 10);
}

function pickVehicleColor() {
    return VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];
}

function buildVehicle(make) {
    const m = make || pickVehicleMake();
    return {
        make: m,
        model: pickVehicleModel(m),
        year: pickVehicleYear(),
        color: pickVehicleColor()
    };
}

function formatVehicleLabel(vehicle) {
    return vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model;
}
