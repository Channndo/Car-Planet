/* Dealership tile collision & daily customer visibility */
function applyDealershipLayouts() {
let dl=maps.drive.layout, sl=maps.shop.layout, shl=maps.showroom.layout, pl=maps.parkinglot.layout;

dl[2][0]=8;dl[3][0]=8;dl[4][0]=8;dl[6][0]=8;dl[7][0]=8;dl[8][0]=8;dl[2][19]=8;dl[3][19]=8;dl[4][19]=8;dl[6][19]=8;dl[7][19]=8;dl[8][19]=8;dl[10][0]=9;
dl[11][3]=13;dl[11][7]=13;dl[11][11]=13;dl[11][15]=13;dl[0][8]=9;dl[0][9]=9;dl[0][10]=9;dl[0][11]=9;dl[0][16]=9;dl[0][18]=9;dl[14][2]=9;dl[14][18]=9;

sl[14][8]=9;sl[14][9]=9;sl[14][10]=9;sl[14][11]=9;sl[14][17]=9;sl[14][18]=9;sl[3][19]=9;sl[6][19]=9;sl[9][19]=9;sl[12][19]=9;sl[0][9]=8;sl[0][10]=8;sl[7][3]=12;sl[4][4]=3;sl[10][4]=3;sl[4][14]=3;sl[10][14]=3; 
sl[4][2]=11; sl[5][2]=20; sl[6][2]=20; sl[9][2]=26; sl[10][2]=20; sl[9][16]=27; sl[10][16]=20; sl[4][16]=28; sl[5][16]=20; 

let mlr = maps.mens_locker_room.layout;
mlr[0][9]=9; mlr[0][10]=9;
for(let y=1; y<=13; y++) { if(y !== 11 && y !== 12) mlr[y][10] = 25; } 
for(let x=1; x<=8; x++) mlr[1][x]=7; 
for(let y=2; y<=12; y++) { if(y !== 7) mlr[y][1]=7; } 
for(let x=2; x<=9; x++) mlr[13][x]=7; 
mlr[1][13]=21; mlr[1][14]=21; mlr[1][15]=21; 
mlr[3][18]=22; mlr[5][18]=22; mlr[7][18]=22; 
mlr[13][12]=23; mlr[13][13]=23; mlr[13][14]=23; mlr[13][15]=23; 
mlr[7][0]=9; 

let br = maps.breakroom.layout;
br[0][9]=9; br[0][10]=9;
br[1][2]=37; 
br[1][3]=38; br[1][4]=38; 
br[1][17]=40; 
br[6][5]=39; br[6][14]=39; br[10][9]=39; 

for(let y=1;y<14;y++)for(let x=1;x<19;x++)maps.parts.layout[y][x]=0; 
maps.parts.layout[7][0]=9; maps.parts.layout[12][0]=9; maps.parts.layout[14][9]=9; maps.parts.layout[14][10]=9; maps.parts.layout[0][9]=9; maps.parts.layout[0][10]=9;
for(let x=5; x<=12; x++) maps.parts.layout[10][x] = 31; 
for(let y=2; y<=5; y++) maps.parts.layout[y][4] = 33; 
maps.parts.layout[10][4] = 35; maps.parts.layout[3][3] = 32; maps.parts.layout[4][3] = 32; 
maps.parts.layout[13][4]=12; maps.parts.layout[11][11]=12; maps.parts.layout[5][3]=12; maps.parts.layout[8][3]=12;
for(let x=13; x<=18; x++) maps.parts.layout[5][x] = 1; 
for(let y=1; y<=5; y++) maps.parts.layout[y][13] = 1; 
maps.parts.layout[5][15] = 0; maps.parts.layout[3][16] = 34; 
for(let y=2; y<=6; y++) { maps.parts.layout[y][8]=29; maps.parts.layout[y][9]=29; }
maps.parts.layout[8][16] = 30;
maps.parts.layout[1][15]=43; maps.parts.layout[1][16]=43; maps.parts.layout[1][17]=43; 

let ol = maps.office.layout;
ol[14][9]=9; ol[14][10]=9; 
ol[0][9]=9; ol[0][10]=9;
ol[6][9]=34; ol[6][10]=34; 
ol[8][9]=12; ol[8][10]=12; 
ol[1][4]=36; ol[1][5]=36;

shl[0][2]=9;shl[0][15]=9;shl[14][9]=9;shl[14][10]=9;shl[12][0]=8;shl[13][0]=8;shl[12][19]=8;shl[13][19]=8;
shl[12][2]=13;shl[12][6]=13;shl[12][13]=13;shl[12][17]=13;shl[4][0]=9; shl[7][0]=9; 
for(let y=2;y<=9;y++)shl[y][15]=16; for(let x=15;x<=18;x++)shl[9][x]=16; shl[9][16]=0;shl[6][17]=13;
shl[4][4]=18;shl[4][5]=19;shl[7][4]=14;shl[7][5]=14;shl[6][3]=17; shl[4][10]=18;shl[4][11]=19;shl[7][10]=14;shl[7][11]=14; 

// New Bathrooms Layout
let sm = maps.showroom_mens.layout;
for(let y=1;y<14;y++){for(let x=1;x<19;x++){sm[y][x]=21;}}
sm[3][3]=1; sm[3][4]=1; sm[3][5]=1; sm[3][7]=1; sm[3][8]=1; sm[3][9]=1;
sm[1][6]=1; sm[2][6]=1; sm[3][6]=1;
sm[1][10]=1; sm[2][10]=1; sm[3][10]=1;
sm[2][4]=22; sm[2][8]=22;
sm[2][12]=41; sm[2][14]=41;
sm[12][4]=23; sm[12][5]=23; sm[12][6]=23;
sm[7][19]=9; 

let sw = maps.showroom_womens.layout;
for(let y=1;y<14;y++){for(let x=1;x<19;x++){sw[y][x]=21;}}
sw[3][3]=1; sw[3][4]=1; sw[3][5]=1; sw[3][7]=1; sw[3][8]=1; sw[3][9]=1; sw[3][11]=1; sw[3][12]=1; sw[3][13]=1; sw[3][15]=1; sw[3][16]=1; sw[3][17]=1;
sw[1][6]=1; sw[2][6]=1; sw[3][6]=1;
sw[1][10]=1; sw[2][10]=1; sw[3][10]=1;
sw[1][14]=1; sw[2][14]=1; sw[3][14]=1;
sw[2][4]=22; sw[2][8]=22; sw[2][12]=22; sw[2][16]=22;
sw[12][4]=23; sw[12][5]=23; sw[12][6]=23; sw[12][7]=23;
sw[7][19]=9; 

// Womens Locker Room Layout
let wlr = maps.womens_locker_room.layout;
wlr[0][9]=9; wlr[0][10]=9;
for(let y=1; y<=13; y++) { if(y !== 11 && y !== 12) wlr[y][10] = 25; } 
for(let x=1; x<=8; x++) wlr[1][x]=7; 
for(let y=2; y<=12; y++) { if(y !== 7) wlr[y][1]=7; } 
for(let x=2; x<=9; x++) wlr[13][x]=7; 
wlr[1][13]=21; wlr[1][14]=21; wlr[1][15]=21; wlr[1][16]=21; 
wlr[3][18]=22; wlr[5][18]=22; wlr[7][18]=22; wlr[9][18]=22; 
wlr[13][12]=23; wlr[13][13]=23; wlr[13][14]=23; wlr[13][15]=23;

// Paint Room Layout
for(let x=1; x<=18; x++) maps.paintroom.layout[1][x]=7; 
maps.paintroom.layout[7][0]=9; 

// Bodyshop Layout Update
maps.bodyshop.layout[7][0]=9;
maps.bodyshop.layout[0][9]=8; maps.bodyshop.layout[0][10]=8;
maps.bodyshop.layout[14][5]=9; maps.bodyshop.layout[14][6]=9;
maps.bodyshop.layout[14][9]=9; maps.bodyshop.layout[14][10]=9;
maps.bodyshop.layout[14][13]=9; maps.bodyshop.layout[14][14]=9;
maps.bodyshop.layout[2][19]=9; 

for(let y=0;y<15;y++){for(let x=0;x<20;x++){pl[y][x]=0;}} 
for(let y=3;y<=11;y++){for(let x=4;x<=15;x++){pl[y][x]=2;}}
pl[3][9]=8;pl[3][10]=8;pl[4][4]=8;pl[5][4]=9;pl[7][4]=8;pl[8][4]=9;pl[9][4]=9;pl[10][4]=8;pl[4][15]=8;pl[5][15]=9;pl[7][15]=8;pl[8][15]=9;pl[10][15]=8;pl[11][9]=9;pl[11][10]=9;
pl[3][14]=8; pl[3][15]=8; 

    if(playerDetails.inUniform){let dm=maps.drive.npcs.find(n=>n.id==='mike'); if(dm) dm.hidden=true; let om=maps.office.npcs.find(n=>n.id==='mike'); if(om) om.hidden=false;}
    if(questState.step>=5){let dc=maps.drive.npcs.find(n=>n.id==='customer_car'); if(dc) dc.hidden=true; let ac=maps.drive.npcs.find(n=>n.id==='angry_customer'); if(ac) ac.hidden=true; let sc=maps.shop.npcs.find(n=>n.id==='shop_car'); if(sc) sc.hidden=false;}
}

/* syncDriveDailyCustomers — see js/systems/customerSpawn.js */
