function triggerWarp(w){
    if (w.to === 'womens_locker_room' || w.to === 'showroom_womens') {
        if (playerDetails.gender === 'Boy') {
            activeDialogue=["That's the women's room.\nI shouldn't go in there."]; activeLine=0; dName.innerText="SYSTEM"; dText.innerText=activeDialogue[0]; drawPortrait('NONE'); dContainer.style.display='flex';
            if(player.dir==='up')player.ty++;else if(player.dir==='down')player.ty--;else if(player.dir==='left')player.tx++;else if(player.dir==='right')player.tx--;
            player.x = player.tx*TILE_SIZE; player.y = player.ty*TILE_SIZE; return;
        }
    }
    if (w.to === 'mens_locker_room' || w.to === 'showroom_mens') {
        if (playerDetails.gender === 'Girl') {
            activeDialogue=["That's the men's room.\nI shouldn't go in there."]; activeLine=0; dName.innerText="SYSTEM"; dText.innerText=activeDialogue[0]; drawPortrait('NONE'); dContainer.style.display='flex';
            if(player.dir==='up')player.ty++;else if(player.dir==='down')player.ty--;else if(player.dir==='left')player.tx++;else if(player.dir==='right')player.tx--;
            player.x = player.tx*TILE_SIZE; player.y = player.ty*TILE_SIZE; return;
        }
    }
    gameState='TRANSITION';transition.active=true;transition.alpha=0;transition.state='fade_out';transition.dest=w;
}
function isSolid(tx,ty){if(tx<0||tx>=MAP_COLS||ty<0||ty>=MAP_ROWS)return true;const tile=maps[currentMapKey].layout[ty][tx];if([1,2,3,4,5,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,50,51,52,53,54,55,56].includes(tile))return true;if(maps[currentMapKey].npcs.some(n=>{if(n.hidden)return false;if(n.charCode==='CAR'||n.charCode==='SUV_BLACK'||n.charCode==='WRECK_CAR')return(tx>=n.tx&&tx<=n.tx+2&&ty>=n.ty&&ty<=n.ty+1);if(n.charCode==='BIG_BOX')return(tx===n.tx&&(ty===n.ty||ty===n.ty+1));return!n.isObject&&n.tx===tx&&n.ty===ty;}))return true;return false;}
function updateWanderer(npc) {
    if(npc.isMoving) {
        if(npc.dir === 'up') npc.y -= npc.speed;
        if(npc.dir === 'down') npc.y += npc.speed;
        if(npc.dir === 'left') npc.x -= npc.speed;
        if(npc.dir === 'right') npc.x += npc.speed;
        npc.moveTimer += npc.speed;
        if(npc.moveTimer >= TILE_SIZE) {
            npc.isMoving = false; npc.moveTimer = 0;
            npc.x = npc.tx * TILE_SIZE; npc.y = npc.ty * TILE_SIZE;
            if(npc.id === 'coolant_joe' && Math.random() < 0.2) { npc.isDrinking = true; npc.drinkTimer = 120; } 
            else { npc.nextMoveDelay = Math.floor(Math.random() * 100) + (npc.id === 'bri' ? 100 : 50); }
        }
    } else if(npc.isDrinking) {
        npc.drinkTimer--; if(npc.drinkTimer <= 0) npc.isDrinking = false;
    } else {
        if(npc.nextMoveDelay > 0) { npc.nextMoveDelay--; } 
        else {
            const dirs = ['up', 'down', 'left', 'right'];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            npc.dir = dir;
            let nTx = npc.tx; let nTy = npc.ty;
            if(dir === 'up') nTy--; if(dir === 'down') nTy++; if(dir === 'left') nTx--; if(dir === 'right') nTx++;
            
            let allowed = !isSolid(nTx, nTy) && !(nTx === player.tx && nTy === player.ty);
            if(npc.id === 'bri') allowed = false; 
            if(npc.id === 'coolant_joe' && currentMapKey === 'parts' && nTx > 4) allowed = false; 
            
            if(allowed) {
                npc.tx = nTx; npc.ty = nTy; npc.isMoving = true;
            } else { npc.nextMoveDelay = 40; }
        }
    }
}

window.triggerWarp = triggerWarp;
window.isSolid = isSolid;
window.updateWanderer = updateWanderer;