/* Hardcoded unique portrait art for every named customer — never the John Hughes template. */

function cpBg() { pCtx.clearRect(0, 0, 64, 64); pR(0, 0, 64, 64, '#6d8fa8'); }

function cpEyes(y) {
    y = y || 32;
    pR(26, y, 2, 2, '#111');
    pR(36, y, 2, 2, '#111');
}

function cpFace(skin, y) {
    y = y || 22;
    pR(22, y, 20, 24, skin);
    cpEyes(y + 10);
}

function cpGirlHair(h) {
    pR(18, 16, 28, 10, h);
    pR(18, 26, 6, 18, h);
    pR(40, 26, 6, 18, h);
}

function cpGuyHair(h, short) {
    pR(20, 16, 24, short ? 6 : 8, h);
    pR(18, 20, 4, 10, h);
    pR(42, 20, 4, 10, h);
}

function cpGlasses() {
    pCtx.strokeStyle = '#222';
    pCtx.lineWidth = 1;
    pCtx.strokeRect(24, 30, 6, 5);
    pCtx.strokeRect(34, 30, 6, 5);
    pCtx.beginPath();
    pCtx.moveTo(30, 32);
    pCtx.lineTo(34, 32);
    pCtx.stroke();
}

function cpBeard(c) { pR(22, 38, 20, 6, c); }

function cpMustache() { pR(26, 38, 12, 2, '#4a3121'); }

function cpMouth() { pR(28, 42, 8, 1, '#222'); }

function cpAngryBrows() {
    pCtx.strokeStyle = '#222';
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.moveTo(24, 28);
    pCtx.lineTo(30, 30);
    pCtx.stroke();
    pCtx.beginPath();
    pCtx.moveTo(40, 28);
    pCtx.lineTo(34, 30);
    pCtx.stroke();
    pR(29, 42, 6, 4, '#222');
}

function cpFlatBrows() {
    pR(24, 28, 6, 1, '#222');
    pR(34, 28, 6, 1, '#222');
}

function drawJohnHughesPortrait() {
    cpBg();
    pR(18, 48, 28, 16, '#cc2222');
    cpFace('#ffccaa');
    cpGuyHair('#222');
    cpAngryBrows();
}

function drawFredNandersPortrait() {
    cpBg();
    pR(12, 48, 40, 16, '#3d3d3d');
    cpFace('#a67c52');
    cpGuyHair('#3d2817');
    pR(18, 20, 4, 8, 'rgba(60,45,30,0.55)');
    pR(42, 20, 4, 8, 'rgba(60,45,30,0.55)');
    pR(20, 26, 10, 6, 'rgba(80,55,30,0.45)');
    pR(34, 38, 8, 4, 'rgba(70,50,25,0.5)');
    cpBeard('rgba(50,35,20,0.65)');
    pR(14, 50, 8, 4, 'rgba(90,60,30,0.4)');
    pR(42, 52, 6, 3, 'rgba(90,60,30,0.35)');
}

function drawDebbieMartinez() {
    cpBg(); pR(18, 48, 28, 16, '#cc2222'); cpFace('#c68642'); cpGirlHair('#222');
    pR(44, 44, 4, 8, '#8b4513'); cpMouth();
}

function drawGaryHenderson() {
    cpBg(); pR(16, 48, 32, 16, '#444'); cpFace('#ffdbac'); cpGuyHair('#888', true);
    cpGlasses(); cpMustache(); pR(46, 50, 6, 8, '#ddd');
}

function drawTiffanyBrooks() {
    cpBg(); pR(18, 48, 28, 16, '#ff69b4'); cpFace('#ffe0bd'); cpGirlHair('#f6c944');
    pR(44, 38, 4, 10, '#111'); pR(46, 36, 3, 3, '#88ccff'); cpMouth();
}

function drawMarcusWebb() {
    cpBg(); pR(18, 48, 28, 16, '#111'); cpFace('#8d5524'); cpGuyHair('#111', true);
    pR(20, 14, 24, 4, '#111'); cpMouth();
}

function drawLindaChoi() {
    cpBg(); pR(16, 48, 32, 16, '#2c5a8c'); cpFace('#f1c27d'); cpGirlHair('#111');
    pR(28, 42, 8, 2, '#fff'); cpMouth();
}

function drawBuckOdom() {
    cpBg(); pR(16, 48, 32, 16, '#228822'); cpFace('#dcb'); cpGuyHair('#4a3121');
    pR(18, 14, 28, 4, '#5c4033'); cpBeard('#4a3121'); cpMouth();
}

function drawPamelaRoss() {
    cpBg(); pR(16, 48, 32, 16, '#663399'); cpFace('#ffccaa'); cpGirlHair('#a06540');
    pR(46, 46, 8, 10, '#fff'); pR(47, 48, 6, 1, '#cc2222'); cpMouth();
}

function drawDerekFinch() {
    cpBg(); pR(18, 48, 28, 16, '#111'); cpFace('#ffccaa');
    pR(20, 18, 24, 4, '#333'); cpFlatBrows(); cpMouth();
}

function drawHelenPrice() {
    cpBg(); pR(16, 48, 32, 16, '#fff'); cpFace('#e8b898'); cpGirlHair('#ccc');
    pR(24, 14, 16, 6, '#ccc'); cpMouth();
}

function drawJoeyPitts() {
    cpBg(); pR(18, 48, 28, 16, '#cc5500'); cpFace('#ffdbac'); cpGuyHair('#cc3300');
    pR(24, 40, 4, 4, '#333'); pR(36, 42, 4, 3, '#333'); cpMouth();
}

function drawSandraKim() {
    cpBg(); pR(18, 48, 28, 16, '#115e59'); cpFace('#f1c27d'); cpGirlHair('#111');
    pR(24, 28, 2, 1, '#888'); pR(38, 28, 2, 1, '#888'); cpMouth();
}

function drawClintBarber() {
    cpBg(); pR(16, 48, 32, 16, '#5c2e0b'); cpFace('#dcb'); cpGuyHair('#4a3121');
    pR(16, 12, 32, 4, '#5c4033'); cpBeard('#4a3121'); cpMouth();
}

function drawMonicaVega() {
    cpBg(); pR(16, 48, 32, 16, '#1e3a8a'); cpFace('#c68642'); cpGirlHair('#222');
    cpGlasses(); pR(26, 14, 12, 4, '#222'); cpMouth();
}

function drawRayDonovan() {
    cpBg(); pR(18, 48, 28, 16, '#222'); cpFace('#ffccaa'); cpGuyHair('#888');
    pR(42, 30, 6, 4, '#111'); pR(46, 28, 2, 6, '#333'); cpMouth();
}

function drawBettyLouJenkins() {
    cpBg(); pR(16, 48, 32, 16, '#88cc88'); cpFace('#ffe0bd'); cpGirlHair('#ddd');
    pR(28, 42, 8, 2, '#fff'); cpMouth();
}

function drawAnthonyCruz() {
    cpBg(); pR(18, 48, 28, 16, '#fff'); cpFace('#8d5524'); cpGuyHair('#111', true);
    cpBeard('#4a3121'); pR(16, 50, 4, 3, '#888'); cpMouth();
}

function drawWendyHolt() {
    cpBg(); pR(16, 48, 32, 16, '#9333ea'); cpFace('#ffdbac'); cpGirlHair('#d4a017');
    pR(42, 28, 3, 5, '#2563eb'); cpMouth();
}

function drawStanleyCooper() {
    cpBg(); pR(16, 48, 32, 16, '#2c5a8c'); cpFace('#e8b898'); cpGuyHair('#888', true);
    cpMustache(); cpMouth();
}

function drawKeishaNolan() {
    cpBg(); pR(18, 48, 28, 16, '#111'); cpFace('#8d5524'); cpGirlHair('#111');
    pR(42, 26, 3, 6, '#2563eb'); cpMouth();
}

function drawPeteMalone() {
    cpBg(); pR(16, 48, 32, 16, '#1e40af'); cpFace('#dcb'); cpGuyHair('#cc5500');
    pR(16, 12, 32, 5, '#8b7355'); cpBeard('#cc5500'); cpMouth();
}

function drawDianaFrost() {
    cpBg(); pR(18, 48, 28, 16, '#a7f3d0'); cpFace('#ffccaa'); cpGirlHair('#f6c944');
    pR(20, 14, 8, 4, '#a7f3d0'); cpMouth();
}

function drawHaroldGrimes() {
    cpBg(); pR(16, 48, 32, 16, '#cc2222'); cpFace('#ffdbac'); cpGuyHair('#888', true);
    cpFlatBrows(); pR(28, 42, 8, 1, '#666'); cpMouth();
}

function drawJasmineOrtega() {
    cpBg(); pR(18, 48, 28, 16, '#f472b6'); cpFace('#c68642'); cpGirlHair('#222');
    pR(44, 40, 4, 6, '#ffd700'); cpMouth();
}

function drawVincePalermo() {
    cpBg(); pR(16, 48, 32, 16, '#78716c'); cpFace('#ffccaa'); cpGuyHair('#111', true);
    pR(18, 12, 28, 4, '#fbbf24'); cpBeard('#4a3121'); cpMouth();
}

function drawGloriaSwan() {
    cpBg(); pR(16, 48, 32, 16, '#4c1d95'); cpFace('#ffe0bd'); cpGirlHair('#888');
    cpGlasses(); cpMouth();
}

function drawTomTurboReed() {
    cpBg(); pR(18, 48, 28, 16, '#111'); cpFace('#ffdbac');
    pR(26, 12, 12, 10, '#cc3300'); pR(22, 16, 20, 4, '#cc3300'); cpMouth();
}

function drawIreneWalsh() {
    cpBg(); pR(16, 48, 32, 16, '#6b7280'); cpFace('#e8b898'); cpGirlHair('#ccc');
    pR(26, 30, 2, 1, '#888'); pR(36, 30, 2, 1, '#888'); cpMouth();
}

function drawCurtisBain() {
    cpBg(); pR(16, 48, 32, 16, '#111'); cpFace('#8d5524');
    pR(20, 18, 24, 4, '#333'); pR(24, 28, 2, 1, '#444'); pR(38, 28, 2, 1, '#444');
    pR(46, 44, 4, 8, '#fff'); cpMouth();
}

function drawNicoleBrandt() {
    cpBg(); pR(18, 48, 28, 16, '#2563eb'); cpFace('#ffccaa'); cpGirlHair('#d4a017');
    pR(14, 46, 4, 4, '#fbbf24'); cpMouth();
}

function drawEarlDunn() {
    cpBg(); pR(16, 48, 32, 16, '#b45309'); cpFace('#dcb'); cpGuyHair('#888', true);
    cpFlatBrows(); cpBeard('#888'); cpMouth();
}

/* Procedural walk-in pool — distinct faces, not John Hughes */
function drawWalkInPortrait(variant) {
    cpBg();
    if (variant === 1) {
        pR(18, 48, 28, 16, '#2c5a8c'); cpFace('#ffdbac'); cpGirlHair('#d4a017'); cpMouth();
    } else if (variant === 2) {
        pR(16, 48, 32, 16, '#444'); cpFace('#e8b898'); cpGuyHair('#888', true); cpGlasses(); cpMouth();
    } else if (variant === 3) {
        pR(18, 48, 28, 16, '#228822'); cpFace('#c68642'); cpGuyHair('#222'); cpBeard('#222'); cpMouth();
    } else if (variant === 4) {
        pR(18, 48, 28, 16, '#663399'); cpFace('#f1c27d'); cpGirlHair('#111'); cpMouth();
    } else if (variant === 5) {
        pR(16, 48, 32, 16, '#111'); cpFace('#8d5524'); cpGuyHair('#4a3121', true); cpMouth();
    } else {
        pR(16, 48, 32, 16, '#6b7280'); cpFace('#ffe0bd'); cpGirlHair('#ccc'); cpGlasses(); cpMouth();
    }
}

function walkInVariantFromId(id) {
    if (!id) return 1;
    let h = 0;
    const s = String(id);
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return (Math.abs(h) % 6) + 1;
}

const CUSTOMER_PORTRAIT_DRAW = {
    1: drawDebbieMartinez,
    2: drawGaryHenderson,
    3: drawTiffanyBrooks,
    4: drawMarcusWebb,
    5: drawLindaChoi,
    6: drawBuckOdom,
    7: drawPamelaRoss,
    8: drawDerekFinch,
    9: drawHelenPrice,
    10: drawJoeyPitts,
    11: drawSandraKim,
    12: drawClintBarber,
    13: drawMonicaVega,
    14: drawRayDonovan,
    15: drawBettyLouJenkins,
    16: drawAnthonyCruz,
    17: drawWendyHolt,
    18: drawStanleyCooper,
    19: drawKeishaNolan,
    20: drawPeteMalone,
    21: drawDianaFrost,
    22: drawHaroldGrimes,
    23: drawJasmineOrtega,
    24: drawVincePalermo,
    25: drawGloriaSwan,
    26: drawTomTurboReed,
    27: drawIreneWalsh,
    28: drawCurtisBain,
    29: drawNicoleBrandt,
    30: drawEarlDunn,
    151: drawFredNandersPortrait
};

function resolveCustomerPortraitId(npc) {
    if (!npc) return null;
    if (npc._visitCustomerId != null) return npc._visitCustomerId;
    if (npc.name === 'JOHN HUGHES') return 'john_hughes';
    if (npc._portraitCode === 'FRED_NANDERS') return 151;
    if (typeof getCoreCustomerById === 'function') {
        const byName = CORE_CUSTOMERS.find(c => c.name === npc.name);
        if (byName) return byName.id;
    }
    return null;
}

function drawCustomerPortraitById(id) {
    if (id === 'john_hughes') {
        drawJohnHughesPortrait();
        return;
    }
    if (typeof id === 'string' && id.indexOf('proc_') === 0) {
        drawWalkInPortrait(walkInVariantFromId(id));
        return;
    }
    const draw = CUSTOMER_PORTRAIT_DRAW[id];
    if (draw) {
        draw();
        return;
    }
    drawWalkInPortrait(1);
}

function drawCustomerPortraitForNpc(npc) {
    const id = resolveCustomerPortraitId(npc);
    if (id === 'john_hughes' || (!id && npc && npc.name === 'JOHN HUGHES')) {
        drawJohnHughesPortrait();
        return;
    }
    if (id == null && npc && (npc.charCode === 'CUSTOMER' || !npc._visitCustomerId) && typeof questState !== 'undefined' && questState.step < 8) {
        drawJohnHughesPortrait();
        return;
    }
    drawCustomerPortraitById(id);
}

window.drawCustomerPortraitForNpc = drawCustomerPortraitForNpc;
window.drawCustomerPortraitById = drawCustomerPortraitById;
window.drawJohnHughesPortrait = drawJohnHughesPortrait;
window.drawFredNandersPortrait = drawFredNandersPortrait;
window.CUSTOMER_PORTRAIT_DRAW = CUSTOMER_PORTRAIT_DRAW;
window.walkInVariantFromId = walkInVariantFromId;
