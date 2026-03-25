const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 16;
const MAP_COLS = 20;
const MAP_ROWS = 15;

// --- JOE'S UNIQUE DATA ---
// We move Joe out of a specific map array so he can "persist" across the dealership
let coolantJoe = {
    id: 'coolant_joe',
    name: 'COOLANT JOE',
    currentMap: 'drive', 
    tx: 5, ty: 5,
    x: 5 * TILE_SIZE, y: 5 * TILE_SIZE,
    dir: 'down',
    isMoving: false,
    moveTimer: 0,
    speed: 1, 
    nextMoveDelay: 100,
    hidden: false,
    // Personality traits
    isDrinking: false,
    drinkTimer: 0,
    dialogue: ["*Gulp gulp gulp*", "Dex-Cool hits different at 2 AM.", "I'm 40% ethylene glycol now."]
};

// --- UPDATED MOVEMENT ENGINE ---

function updateJoe() {
    if (coolantJoe.hidden) return;

    if (coolantJoe.isMoving) {
        // Smooth Pixel Walking
        if (coolantJoe.dir === 'up') coolantJoe.y -= coolantJoe.speed;
        if (coolantJoe.dir === 'down') coolantJoe.y += coolantJoe.speed;
        if (coolantJoe.dir === 'left') coolantJoe.x -= coolantJoe.speed;
        if (coolantJoe.dir === 'right') coolantJoe.x += coolantJoe.speed;

        coolantJoe.moveTimer += coolantJoe.speed;

        if (coolantJoe.moveTimer >= TILE_SIZE) {
            coolantJoe.isMoving = false;
            coolantJoe.moveTimer = 0;
            coolantJoe.x = coolantJoe.tx * TILE_SIZE;
            coolantJoe.y = coolantJoe.ty * TILE_SIZE;
            
            // Random chance to "stop and drink" instead of just walking
            if (Math.random() < 0.2) {
                coolantJoe.isDrinking = true;
                coolantJoe.drinkTimer = 120; // Pause for 2 seconds
            } else {
                coolantJoe.nextMoveDelay = Math.floor(Math.random() * 100) + 50;
            }
        }
    } else if (coolantJoe.isDrinking) {
        coolantJoe.drinkTimer--;
        if (coolantJoe.drinkTimer <= 0) coolantJoe.isDrinking = false;
    } else {
        if (coolantJoe.nextMoveDelay > 0) {
            coolantJoe.nextMoveDelay--;
        } else {
            decideJoeAction();
        }
    }
}

function decideJoeAction() {
    // 5% chance to "change rooms" (teleport to a random map)
    if (Math.random() < 0.05) {
        const maps = ['drive', 'office', 'shop'];
        coolantJoe.currentMap = maps[Math.floor(Math.random() * maps.length)];
        // Spawn him at a random edge or entrance
        coolantJoe.tx = Math.floor(Math.random() * (MAP_COLS - 2)) + 1;
        coolantJoe.ty = Math.floor(Math.random() * (MAP_ROWS - 2)) + 1;
        coolantJoe.x = coolantJoe.tx * TILE_SIZE;
        coolantJoe.y = coolantJoe.ty * TILE_SIZE;
        return;
    }

    // Standard Wandering
    const directions = ['up', 'down', 'left', 'right'];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    coolantJoe.dir = dir;

    let nextTx = coolantJoe.tx;
    let nextTy = coolantJoe.ty;

    if (dir === 'up') nextTy--;
    if (dir === 'down') nextTy++;
    if (dir === 'left') nextTx--;
    if (dir === 'right') nextTx++;

    // Basic Collision (Stay in bounds)
    if (nextTx >= 0 && nextTx < MAP_COLS && nextTy >= 0 && nextTy < MAP_ROWS) {
        coolantJoe.tx = nextTx;
        coolantJoe.ty = nextTy;
        coolantJoe.isMoving = true;
    }
}

// --- VISUALS: OVERWEIGHT BLUE SHIRT JOE ---

function drawCoolantJoe() {
    // Only draw him if he's in the same room as the player
    if (coolantJoe.currentMap !== currentMapKey) return;

    const { x, y } = coolantJoe;

    // 1. Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 14, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Body (Overweight Blue Shirt)
    ctx.fillStyle = '#1e40af'; // Deep blue
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 10, 8, 6, 0, 0, Math.PI * 2); // Wider for "Overweight" look
    ctx.fill();

    // 3. Head & Face
    ctx.fillStyle = '#fcd34d'; // Skin tone
    ctx.fillRect(x + 4, y + 2, 8, 6);

    // 4. Dark Hair & Beard with Grey
    ctx.fillStyle = '#1a1a1a'; // Dark hair
    ctx.fillRect(x + 4, y + 1, 8, 2); // Top hair
    ctx.fillRect(x + 4, y + 6, 8, 3); // Beard base
    
    // Grey flecks in beard (The "Distinguished Tech" look)
    ctx.fillStyle = '#94a3b8'; 
    ctx.fillRect(x + 5, y + 8, 2, 1);
    ctx.fillRect(x + 10, y + 7, 1, 1);

    // 5. The Coolant (Drinking Animation)
    if (coolantJoe.isDrinking) {
        ctx.fillStyle = '#fb923c'; // Orange coolant
        ctx.fillRect(x + 8, y + 5, 4, 4); // Cup held to face
    } else {
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(x + 11, y + 9, 3, 4); // Cup at side
    }
}

// --- INTEGRATION INTO YOUR LOOP ---

function gameLoop() {
    updateJoe(); // Run Joe's logic
    
    // Clear & Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Your Map rendering would go here...
    
    drawCoolantJoe();
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
