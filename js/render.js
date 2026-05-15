function dR(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}

function drawTile(tx,ty,t){
    const px=tx*TILE_SIZE;const py=ty*TILE_SIZE;
    
    // Draw base background except where toolboxes exist
    if(t !== 20) {
        if(currentMapKey === 'showroom' || currentMapKey === 'lux_restroom' || currentMapKey === 'showroom_mens' || currentMapKey === 'showroom_womens') {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#fdfdfd'); 
        } else if(['drive', 'womens_locker_room', 'mens_locker_room'].includes(currentMapKey)) {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#cccccc'); let seed = (tx * 7 + ty * 13) % 10;
            if(seed === 1) dR(px+2, py+4, 1, 1, '#ffffff'); if(seed === 2) dR(px+10, py+8, 1, 1, '#3b82f6'); if(seed === 3) dR(px+6, py+2, 1, 1, '#ffffff');
        } else if (currentMapKey === 'breakroom') {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#dddddd'); // Clean breakroom floor
        } else if(currentMapKey === 'parkinglot') {
            // Keep transparent, background filled by canvas global clear
        } else if(currentMapKey === 'street') {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#5a6b4a');
        } else if(currentMapKey === 'gas_station') {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#e8e4dc');
        } else if(currentMapKey === 'liquor_store') {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#2a1f1a');
        } else if(currentMapKey === 'fast_food') {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#fff7ed');
        } else {
            dR(px,py,TILE_SIZE,TILE_SIZE,'#5a5a5a'); if((tx+ty)%4 === 0) dR(px+4, py+4, 8, 8, '#636363'); 
        }
    }
    switch(t){
        case 1: dR(px,py,TILE_SIZE,TILE_SIZE,'#333'); break;
        case 2:
            if(currentMapKey==='parkinglot'){
                // Building Roof for parking lot
                dR(px,py,TILE_SIZE,TILE_SIZE,'#e0e4e8');dR(px,py,TILE_SIZE,1,'#f0f4f8');dR(px,py+TILE_SIZE-1,TILE_SIZE,1,'#c0c4c8');
            }else{dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c');}
            break;
        case 3: dR(px+2,py,4,TILE_SIZE,'#ddcc22'); dR(px+10,py,4,TILE_SIZE,'#ddcc22'); break;
        case 11: dR(px-4,py-8,24,48+16,'#1a5936'); dR(px-2,py-6,20,4,'#111'); for(let i=1;i<=6;i++) dR(px-2,py+(i*8)-2,20,1,'#113322'); break;
        case 26: dR(px-4,py-8,24,32+16,'#111'); dR(px-2,py-6,20,4,'#222'); for(let i=1;i<=4;i++) dR(px-2,py+(i*8)-2,20,1,'#0a0a0a'); break;
        case 27: dR(px-4,py-8,24,32+16,'#cc2222'); dR(px-2,py-6,20,4,'#111'); for(let i=1;i<=4;i++) dR(px-2,py+(i*8)-2,20,1,'#881111'); break;
        case 28: dR(px-4,py-8,24,32+16,'#2244cc'); dR(px-2,py-6,20,4,'#111'); for(let i=1;i<=4;i++) dR(px-2,py+(i*8)-2,20,1,'#112288'); break;
        case 20: break; 
        case 21: dR(px,py,TILE_SIZE,TILE_SIZE,'#ddd'); dR(px+2,py+2,TILE_SIZE-4,TILE_SIZE-2,'#eee'); dR(px,py+TILE_SIZE-2,TILE_SIZE,2,'#aaa'); break;
        case 22: dR(px+4,py+2,8,12,'#fff'); dR(px+6,py+8,4,4,'#ccc'); break;
        case 23: dR(px,py+2,TILE_SIZE,12,'#ddd'); dR(px+2,py+4,12,8,'#fff'); dR(px+6,py+6,4,4,'#888'); break;
        case 24: dR(px,py+4,TILE_SIZE,8,'#8b4513'); dR(px+2,py+6,TILE_SIZE-4,4,'#5c2e0b'); break;
        case 25: dR(px,py,TILE_SIZE,TILE_SIZE,'#555'); dR(px,py+TILE_SIZE-2,TILE_SIZE,2,'#333'); break;
        case 29: dR(px+2, py-8, 12, TILE_SIZE+8, '#1e3a8a'); dR(px+2, py-4, 12, 2, '#3b82f6'); dR(px+2, py+4, 12, 2, '#3b82f6'); dR(px+2, py+12, 12, 2, '#3b82f6'); dR(px+4, py-8, 8, 4, '#a1a1aa'); break;
        case 30: dR(px+1, py+11, 14, 4, '#d2b48c'); dR(px+1, py+12, 14, 2, '#8b4513'); dR(px+4, py+7, 8, 5, '#4b5563'); dR(px+3, py+3, 10, 4, '#9ca3af'); dR(px+2, py+5, 3, 3, '#1f2937'); dR(px+2, py+2, 2, 2, '#1f2937'); dR(px+3, py+4, 1, 3, '#111'); break;
        case 31: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c'); dR(px,py+TILE_SIZE-2,TILE_SIZE,2,'#2a4b6c'); dR(px+4,py+4,8,3,'#555'); dR(px+2,py+2,12,6,'#222'); dR(px+6,py+4,4,2,'#888'); break;
        case 32: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c'); dR(px+TILE_SIZE-2,py,2,TILE_SIZE,'#2a4b6c'); dR(px+4,py+4,3,8,'#555'); dR(px+2,py+2,6,12,'#222'); break;
        case 33: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c'); dR(px+TILE_SIZE-2,py,2,TILE_SIZE,'#2a4b6c'); break;
        case 34: dR(px,py,TILE_SIZE,TILE_SIZE,'#8b7355'); dR(px+4,py+4,8,3,'#555'); dR(px+2,py+2,12,6,'#222'); break;
        case 35: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c'); dR(px,py+TILE_SIZE-2,TILE_SIZE,2,'#2a4b6c'); dR(px+TILE_SIZE-2,py,2,TILE_SIZE,'#2a4b6c'); break;
        case 36: dR(px,py,TILE_SIZE,TILE_SIZE,'#3b2f2f'); dR(px+2,py+2,TILE_SIZE-4,TILE_SIZE-4,'#87cefa'); dR(px+2,py+8,TILE_SIZE-4,2,'#fff'); dR(px+4,py+4,3,4,'#ffd700'); dR(px+10,py+4,2,4,'#c0c0c0'); dR(px+6,py+10,4,5,'#ffd700'); break;
        case 37: dR(px+2,py-8,12,24,'#d1d5db'); dR(px+3,py-6,10,10,'#f3f4f6'); dR(px+3,py+6,10,8,'#f3f4f6'); dR(px+10,py-2,2,4,'#9ca3af'); dR(px+10,py+8,2,4,'#9ca3af'); break;
        case 38: dR(px,py+8,TILE_SIZE,8,'#4b5563'); dR(px,py+6,TILE_SIZE,2,'#1f2937'); dR(px+2,py-2,12,8,'#111'); dR(px+4,py,6,4,'#e5e7eb'); break;
        case 39: dR(px+2,py+2,12,12,'#8b4513'); dR(px+4,py+4,8,8,'#d2b48c'); dR(px+6,py-2,4,4,'#1f2937'); dR(px+6,py+14,4,4,'#1f2937'); dR(px-2,py+6,4,4,'#1f2937'); dR(px+14,py+6,4,4,'#1f2937'); break;
        case 40: dR(px+1,py-8,14,24,'#111'); dR(px+3,py-6,10,14,'#cce6ff'); dR(px+4,py-4,2,2,'#f00'); dR(px+8,py-4,2,2,'#0f0'); dR(px+4,py,2,2,'#00f'); dR(px+8,py,2,2,'#ff0'); dR(px+4,py+4,2,2,'#f0f'); dR(px+8,py+4,2,2,'#0ff'); dR(px+3,py+10,10,4,'#222'); break;
        case 41: dR(px+4,py+2,8,12,'#fdfdfd'); dR(px+5,py+4,6,8,'#e0e4e8'); dR(px+6,py+8,4,4,'#cce6ff'); break;
        case 42: dR(px+2,py+2,12,12,'#222'); break;
        case 43: dR(px,py,TILE_SIZE,TILE_SIZE,'#5c2e0b'); dR(px+2,py+2,12,12,'#3e1a04'); dR(px+2,py+6,12,2,'#5c2e0b'); dR(px+2,py+10,12,2,'#5c2e0b'); dR(px+4,py+2,2,4,'#cc0000'); dR(px+8,py+2,2,3,'#00cc00'); dR(px+3,py+7,3,3,'#0000cc'); dR(px+9,py+7,2,3,'#cccc00'); break;
        case 45: dR(px-4,py-8,24,32+16,'#f97316'); dR(px-2,py-6,20,4,'#111'); for(let i=1;i<=4;i++) dR(px-2,py+(i*8)-2,20,1,'#c2410c'); break;
        case 46: dR(px,py,TILE_SIZE,TILE_SIZE,'#c4b5a0'); dR(px+2,py+14,TILE_SIZE-4,2,'#a89888'); break;
        case 47: dR(px,py,TILE_SIZE,TILE_SIZE,'#3a3a3a'); break;
        case 48: dR(px,py+7,TILE_SIZE,2,'#f5f5f5'); break;
        case 49: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a7c3f'); if((tx+ty)%3===0) dR(px+4,py+4,4,4,'#3d6b35'); break;
        case 50: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c'); dR(px+2,py+2,TILE_SIZE-4,6,'#f8fafc'); dR(px+3,py+4,TILE_SIZE-6,2,'#dc2626'); break;
        case 51: dR(px+4,py+2,8,12,'#374151'); dR(px+5,py+4,6,4,'#22c55e'); dR(px+6,py+10,4,4,'#111'); dR(px+3,py,2,14,'#9ca3af'); break;
        case 52: dR(px,py+2,TILE_SIZE,12,'#5c2e0b'); dR(px+2,py+4,12,8,'#3e1a04'); dR(px+4,py+6,3,4,'#cc0000'); dR(px+9,py+6,3,4,'#00cc00'); break;
        case 53: dR(px,py+4,TILE_SIZE,8,'#ea580c'); dR(px+2,py+6,TILE_SIZE-4,4,'#fdba74'); break;
        case 54: dR(px+2,py+2,12,12,'#1e3a8a'); dR(px+4,py+4,8,8,'#cce6ff'); dR(px+6,py+6,4,4,'#fff'); break;
        case 55: dR(px+1,py+1,TILE_SIZE-2,TILE_SIZE-2,'#ea580c'); dR(px+3,py+3,TILE_SIZE-6,4,'#fff'); dR(px+3,py+8,TILE_SIZE-6,2,'#111'); dR(px+3,py+11,TILE_SIZE-6,2,'#111'); break;
        case 56: dR(px+2,py+4,12,8,'#dc2626'); dR(px+4,py+2,8,4,'#991b1b'); dR(px+6,py+6,4,4,'#fbbf24'); break;
        case 6: dR(px+3,py+2,10,12,'#33aa33'); dR(px+3,py+2,10,3,'#111'); break;
        case 7: dR(px+2,py,12,TILE_SIZE,'#888'); dR(px+4,py+2,2,8,'#555'); break;
        case 8: dR(px,py,TILE_SIZE,TILE_SIZE,'#ddd'); if(currentMapKey!=='parkinglot'){ dR(px,py+4,TILE_SIZE,2,'#aaa'); dR(px,py+10,TILE_SIZE,2,'#aaa'); } break;
        case 9: dR(px+2,py+2,12,12,'#222'); break;
        case 12: dR(px+4,py+4,8,8,'#222'); dR(px+4,py+12,2,2,'#777'); dR(px+10,py+12,2,2,'#777'); break;
        case 13: dR(px,py,TILE_SIZE,TILE_SIZE,'#4a6b8c'); dR(px+3,py+4,10,6,'#ddd'); dR(px+4,py+5,8,4,'#222'); dR(px+4,py+12,8,2,'#aaa'); break;
        case 14: dR(px+1,py+4,14,10,'#8b4513'); dR(px+1,py+2,14,4,'#5c2e0b'); break;
        case 15: dR(px+2,py+2,12,8,'#111'); dR(px+3,py+3,10,6,'#33aaee'); dR(px+7,py+10,2,6,'#222'); break;
        case 16: dR(px,py,TILE_SIZE,TILE_SIZE,'#e0e4e8'); dR(px+1,py+1,TILE_SIZE-2,TILE_SIZE-2,'#cce6ff'); dR(px+4,py+2,4,10,'rgba(255,255,255,0.5)'); break;
        case 17: dR(px+3,py+2,10,12,'#8b4513'); dR(px,py+4,3,8,'#222'); dR(px+13,py+4,3,8,'#222'); break;
        case 18: dR(px+2,py+2,TILE_SIZE,12,'#111'); dR(px+3,py+3,TILE_SIZE-1,10,'#33aaee'); break;
        case 19: dR(px,py+2,TILE_SIZE-2,12,'#111'); dR(px,py+3,TILE_SIZE-3,10,'#33aaee'); dR(px-2,py+14,4,4,'#222'); break;
    }
}
function drawSprite(x,y,skinColor,shirtColor,sleeves,hairColor,dir,isShort,acc){
    let hMod=isShort?2:0;acc=acc||{};
    if(acc.tinyBox) { dR(x, y+8, 8, 8, '#2244cc'); return; }
    
    if(acc.isBigBox) {
        dR(x-4, y-8, 24, 48, skinColor); 
        dR(x-2, y-6, 20, 4, '#111');
        let shadow = (skinColor === '#cc2222') ? '#881111' : '#c2410c';
        for(let i=1;i<=4;i++) dR(x-2, y+(i*8)-2, 20, 1, shadow);
        return;
    }
    
    // Logic for Stan's full paint suit figure
    if(acc.isPaintSuit){
        let suitColor = '#e5e7eb'; // Light gray suit
        dR(x+4,y+2+hMod,8,8,suitColor); // Head/hood
        dR(x+3,y+10+hMod,10,6-hMod,suitColor); // Body
        dR(x+1,y+10+hMod,2,5-hMod,suitColor); // Left arm
        dR(x+13,y+10+hMod,2,5-hMod,suitColor); // Right arm
        if(dir==='left'){dR(x+4,y+4+hMod,2,2,'#111');}else if(dir==='right'){dR(x+10,y+4+hMod,2,2,'#111');}else if(dir==='up'){}else{dR(x+6,y+5+hMod,2,2,'#111');dR(x+10,y+5+hMod,2,2,'#111');}
        let yOff=(player.isMoving&&player.moveTimer%8<4&&(x===player.x&&y===player.y))?-1:0;dR(x+4,y+16+yOff,3,4,suitColor);dR(x+9,y+16-yOff,3,4,suitColor); // Legs
        return;
    }
    
    dR(x+4,y+2+hMod,8,8,skinColor);
    if(hairColor){
        dR(x+4,y+2+hMod,8,3,hairColor);
        if(acc.isGirl){
            if(dir==='down'){dR(x+3,y+3+hMod,2,7,hairColor);dR(x+11,y+3+hMod,2,7,hairColor);}
            else if(dir==='up'){dR(x+3,y+2+hMod,10,8,hairColor);}
            else if(dir==='left'){dR(x+8,y+2+hMod,4,8,hairColor);}
            else if(dir==='right'){dR(x+4,y+2+hMod,4,8,hairColor);}
        }
    }
    dR(x+3,y+10+hMod,10,6-hMod,shirtColor);
    if(acc.fat){dR(x+2,y+10+hMod,12,6-hMod,shirtColor);} 
    if(acc.vest){dR(x+4,y+10+hMod,8,6-hMod,acc.vest);}
    let armColor=(sleeves==='long')?shirtColor:skinColor;
    let xMod = acc.fat ? 1 : 0; 
    dR(x+1-xMod,y+10+hMod,2,5-hMod,armColor);
    dR(x+13+xMod,y+10+hMod,2,5-hMod,armColor);
    if(dir==='left'){dR(x+4,y+4+hMod,2,2,'#111');}else if(dir==='right'){dR(x+10,y+4+hMod,2,2,'#111');}else if(dir==='up'){}else{dR(x+6,y+5+hMod,2,2,'#111');dR(x+10,y+5+hMod,2,2,'#111');if(acc.glasses){dR(x+4,y+4+hMod,4,3,'rgba(255,255,255,0.4)');dR(x+8,y+4+hMod,4,3,'rgba(255,255,255,0.4)');dR(x+4,y+4+hMod,8,1,'#111');}if(acc.beard){dR(x+4,y+8+hMod,8,2,acc.beard);}if(acc.chain){dR(x+6,y+11+hMod,4,1,'#ffd700');}}let yOff=(player.isMoving&&player.moveTimer%8<4&&(x===player.x&&y===player.y))?-1:0;let txOff=0;if(skinColor==='#dcb'&&hairColor==='#cc5500'&&Math.random()<0.02){txOff=1;}let pantsColor=acc.pants||'#111';dR(x+4+txOff,y+16+yOff,3,4,pantsColor);dR(x+9+txOff,y+16-yOff,3,4,pantsColor);
}

function drawJoe(joe) {
    const x = joe.x; const y = joe.y;
    dR(x+4, y+14, 8, 3, "rgba(0,0,0,0.2)"); dR(x+2, y+10, 12, 6, '#1e40af'); dR(x+4, y+2, 8, 8, '#ffdbac'); dR(x+4, y+1, 8, 3, '#1a1a1a'); dR(x+4, y+7, 8, 3, '#1a1a1a'); dR(x+5, y+8, 2, 1, '#94a3b8'); dR(x+9, y+7, 2, 1, '#94a3b8'); if(joe.dir !== 'up') { let ex = joe.dir === 'left' ? 4 : joe.dir === 'right' ? 10 : 6; dR(x+ex, y+5, 2, 2, '#111'); if(joe.dir === 'down') dR(x+10, y+5, 2, 2, '#111'); } if(joe.isDrinking) dR(x+6, y+5, 4, 5, '#fb923c'); else dR(x+12, y+10, 3, 4, '#fb923c'); let yOff = (joe.isMoving && joe.moveTimer%8<4) ? -1 : 0; dR(x+4, y+16+yOff, 3, 4, '#111'); dR(x+9, y+16-yOff, 3, 4, '#111');
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    if(currentMapKey==='parkinglot'){
        ctx.fillStyle = '#111111';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    } else if(currentMapKey==='street'){
        ctx.fillStyle = '#5a6b4a';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    
    for(let y=0;y<MAP_ROWS;y++){for(let x=0;x<MAP_COLS;x++){drawTile(x,y,maps[currentMapKey].layout[y][x]);}}
    
    if(currentMapKey==='parkinglot'){
        ctx.fillStyle='#fff';
        for(let i=0;i<6;i++){ctx.fillRect(16,32+(i*24),32,2);ctx.fillRect(canvas.width-48,32+(i*24),32,2);ctx.fillRect(64+(i*32),canvas.height-32,2,32);}
        const drawCar=(cx,cy,col,a=0)=>{ctx.save();ctx.translate(cx+7,cy+11);ctx.rotate(a*Math.PI/180);dR(-7,-11,14,22,col);dR(-5,-7,10,5,'#111');dR(-5,4,10,4,'#111');dR(-6,-10,3,2,'#fff');dR(3,-10,3,2,'#fff');dR(-6,8,3,2,'#f00');dR(3,8,3,2,'#f00');ctx.restore();};
        drawCar(25,33,'#cc2222',90);drawCar(25,81,'#2244cc',90);drawCar(canvas.width-39,57,'#aaaaaa',-90);drawCar(canvas.width-39,105,'#222222',-90);drawCar(73,canvas.height-28,'#228822',0);drawCar(137,canvas.height-28,'#2222cc',0);
        let fx=7*TILE_SIZE;let fy=11*TILE_SIZE-12;let fw=6*TILE_SIZE;
        dR(fx,fy,fw,24,'#f8f9fa');dR(fx,fy,fw,2,'#0055a4');dR(fx,fy+22,fw,2,'#0055a4');
        ctx.fillStyle='#0055a4';ctx.font='10px "Press Start 2P"';ctx.textAlign="center";ctx.fillText("CAR PLANET",fx+(fw/2),fy+16);ctx.textAlign="left";
    }
    
    // Draw NPCs and Objects
    maps[currentMapKey].npcs.forEach(n=>{
        if(n.hidden)return;
        
        if(n.id === 'coolant_joe') { drawJoe(n); } 
        else if(n.charCode === 'TINY_BLUE_BOX') {
            dR(n.tx*TILE_SIZE+4, n.ty*TILE_SIZE+8, 8, 8, '#2244cc'); dR(n.tx*TILE_SIZE+4, n.ty*TILE_SIZE+8, 8, 1, '#111');
        }
        else if(n.charCode === 'BIG_BOX') {
            drawSprite(n.tx*TILE_SIZE, n.ty*TILE_SIZE, n.color, null, null, null, null, false, n.acc);
        }
        else if(n.charCode === 'STALL_GUY') { 
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px+4, py+8, 8, 8, n.color); dR(px+4, py+2, 8, 8, n.color); 
        }
        else if(n.charCode === 'STREET_SIGN') {
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px+4, py+2, 8, 12, '#374151'); dR(px+2, py, 12, 6, '#f8fafc');
            dR(px+4, py+1, 8, 2, '#0055a4');
        }
        else if(n.charCode === 'GAS_PUMP') {
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px+4, py+2, 8, 12, '#374151'); dR(px+5, py+4, 6, 4, '#22c55e'); dR(px+6, py+10, 4, 4, '#111');
        }
        else if(n.charCode === 'SNACK_RACK' || n.charCode === 'SHELF') {
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px, py+2, TILE_SIZE, 12, '#5c2e0b'); dR(px+2, py+4, 12, 8, '#3e1a04');
        }
        else if(n.charCode === 'COOLER') {
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px+2, py+2, 12, 12, '#1e3a8a'); dR(px+4, py+4, 8, 8, '#cce6ff');
        }
        else if(n.charCode === 'MENU_BOARD') {
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px+1, py+1, TILE_SIZE-2, TILE_SIZE-2, '#ea580c'); dR(px+3, py+3, TILE_SIZE-6, 4, '#fff');
        }
        else if(n.charCode === 'BOOTH') {
            let px = n.tx * TILE_SIZE; let py = n.ty * TILE_SIZE;
            dR(px+2, py+4, 12, 8, '#dc2626'); dR(px+4, py+2, 8, 4, '#991b1b');
        }
        else if(!n.isObject){
            let txOff=0;if(n.id==='bronson'&&Math.random()<0.02){txOff=2;}
            drawSprite((n.tx*TILE_SIZE)+txOff,n.ty*TILE_SIZE,n.color,n.shirt,n.sleeves,n.hair,n.dir||'down',n.isShort,n.acc);
        } 
        else if(n.charCode==='CAR'){
            let cx=n.tx*TILE_SIZE;let cy=n.ty*TILE_SIZE;dR(cx,cy,48,24,'#3a5a80');dR(cx+8,cy+4,24,16,'#111');dR(cx+10,cy+6,20,12,'#6699cc');dR(cx+6,cy-4,8,4,'#111');dR(cx+34,cy-4,8,4,'#111');dR(cx+6,cy+24,8,4,'#111');dR(cx+34,cy+24,8,4,'#111');
        } 
        else if(n.charCode==='SUV_BLACK'){
            let cx=n.tx*TILE_SIZE;let cy=n.ty*TILE_SIZE;dR(cx,cy-4,52,28,'#151515');dR(cx+8,cy,26,18,'#050505');dR(cx+10,cy+2,22,14,'#222');dR(cx+6,cy-8,10,4,'#050505');dR(cx+36,cy-8,10,4,'#050505');dR(cx+6,cy+24,10,4,'#050505');dR(cx+36,cy+24,10,4,'#050505');
        } 
        else if(n.charCode==='WRECK_CAR'){
            let cx=n.tx*TILE_SIZE;let cy=n.ty*TILE_SIZE;
            // Wreck Body (Dynamic Color)
            dR(cx,cy,48,24,n.color || '#8b4513'); 
            // Hollow Interior (bg color)
            dR(cx+8,cy+4,24,16,maps[currentMapKey].bg);
            // Missing door hole visual
            dR(cx+10, cy+6, 12, 12, maps[currentMapKey].bg);
            // Scrap block where fender was
            dR(cx+40, cy, 8, 8, '#555');
            // Crumpled hood
            dR(cx, cy, 10, 24, '#666');
            // No tires, just rustic wheel hubs
            dR(cx+8,cy-2,4,4,'#333'); dR(cx+36,cy-2,4,4,'#333');
            dR(cx+8,cy+22,4,4,'#333'); dR(cx+36,cy+22,4,4,'#333');
        }
    });
    
    let shirt=playerDetails.inUniform?'#111':'#fff';let sleeves=playerDetails.inUniform?'long':'short';let skin=playerDetails.gender==='Boy'?'#ffccaa':'#ffdbac';let hair=playerDetails.gender==='Boy'?'#4a3121':'#f6c944';let isShort=playerDetails.gender==='Girl';let acc=playerDetails.gender==='Girl'?{isGirl:true}:{};
    drawSprite(player.x,player.y,skin,shirt,sleeves,hair,player.dir,isShort,acc);
    
    if(gameEvents.isAfterHours) {
        if(['drive', 'shop', 'parts', 'breakroom', 'womens_locker_room', 'mens_locker_room', 'bodyshop', 'paintroom', 'street', 'gas_station', 'liquor_store', 'fast_food'].includes(currentMapKey)) {
            ctx.fillStyle = 'rgba(0,10,30,0.5)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
        }
    }
    
    if(transition.active){ctx.fillStyle=`rgba(0,0,0,${transition.alpha})`;ctx.fillRect(0,0,canvas.width,canvas.height);}
    if(flash.active){ctx.fillStyle=`rgba(255,255,255,${flash.alpha})`;ctx.fillRect(0,0,canvas.width,canvas.height);}
}