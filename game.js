const canvas=document.getElementById('gameCanvas'); const ctx=canvas.getContext('2d');
const pCanvas=document.getElementById('portrait-canvas'); const pCtx=pCanvas.getContext('2d');
const TILE_SIZE=16; const MAP_COLS=20; const MAP_ROWS=15;
const keys={w:false,a:false,s:false,d:false,space:false,enter:false,b:false};
let actionTriggered=false, gameState='TITLE', playerDetails={name:"CHANDLER",gender:"Boy",inUniform:false,rivalName:"KASEY",hasRunningShoes:false}, currentMapKey='drive';
let gameEvents={firstCustomerTriggered:false, currentDay:1, dailyWalkIn:false, dailyAptsCompleted:0, dailyWalkInDone:false, timeMinutes:420, tick:0, isAfterHours:false, carWaitingForRO:false};
let questState={active:false,step:0,talkedToMike:false,assignedTo:null,roNumber:600000};
let transition={active:false,alpha:0,state:'none',dest:null}, flash={active:false,alpha:0,state:'none'}, currentChoiceType='', activeDialogue=null, activeLine=0;

if(localStorage.getItem('serviceBaySave')) {
    try {
        const s = JSON.parse(localStorage.getItem('serviceBaySave'));
        if(s.playerDetails) playerDetails=s.playerDetails; if(s.currentMapKey) currentMapKey=s.currentMapKey;
        if(s.gameEvents) { 
            gameEvents=s.gameEvents; if(gameEvents.dailyAptsCompleted===undefined) gameEvents.dailyAptsCompleted = gameEvents.dailyAptDone ? 3 : 0; 
            if(gameEvents.timeMinutes===undefined) gameEvents.timeMinutes=420; if(gameEvents.tick===undefined) gameEvents.tick=0; 
            if(gameEvents.isAfterHours===undefined) gameEvents.isAfterHours=false; if(gameEvents.carWaitingForRO===undefined) gameEvents.carWaitingForRO=false;
        }
        if(s.questState) questState=s.questState;
        if(playerDetails.hasRunningShoes===undefined) playerDetails.hasRunningShoes=false;
        if(!gameEvents.currentDay) gameEvents.currentDay = 1;
        gameState='PLAYING'; document.getElementById('intro-screen').style.display='none'; document.getElementById('title-screen').style.display='none';
    } catch(e) { localStorage.removeItem('serviceBaySave'); }
}

const introScript=[{char:'RICK',text:"Hello there! Welcome to\nthe world of AUTOMOTIVE REPAIR!"},{char:'RICK',text:"My name is RICK SELLERS.\nI'm the FIXED OPS MANAGER."},{char:'RICK',text:"This world is inhabited by\ncreatures called... TECHNICIANS."},{char:'RICK',text:"Some advisors treat them\nas partners.\nOthers just yell at them."},{char:'RICK',text:"First, tell me a little\nabout yourself."},{type:'ACTION',action:'[SHOW_GENDER]'},{char:'RICK',text:"And what is your name?"},{type:'ACTION',action:'[SHOW_NAME]'},{char:'RICK',text:"Right! So your name is\n[PLAYER_NAME]!"},{char:'RICK',text:"The Service Manager's nephew\nis working here as a Lube Tech.\nHe is your rival."},{char:'RICK',text:"...Erm, what is his name again?"},{type:'ACTION',action:'[SHOW_RIVAL_NAME]'},{char:'RICK',text:"Ah, that's right!\nHis name is [RIVAL_NAME]!"},{char:'RICK',text:"[PLAYER_NAME]! Your dealership\nlegend is about to unfold!"},{char:'RICK',text:"A world of flat-rate nightmares\nawaits! Let's go!"},{type:'ACTION',action:'[START_GAME]'}];
let introIndex=0;

function startGameFromTitle(){if(gameState==='TITLE'){gameState='INTRO';document.getElementById('title-screen').style.display='none';document.getElementById('intro-screen').style.display='flex';dContainer.style.display='flex';playIntroLine();}}
function generateEmptyMap(){let m=[];for(let y=0;y<MAP_ROWS;y++){let r=[];for(let x=0;x<MAP_COLS;x++){r.push((y===0||y===MAP_ROWS-1||x===0||x===MAP_COLS-1)?1:0);}m.push(r);}return m;}

// --- MAP DATA LOCKED ---
const maps={
    drive:{bg:'#cccccc',layout:generateEmptyMap(),warps:[{tx:8,ty:0,to:'shop',px:8,py:13},{tx:9,ty:0,to:'shop',px:9,py:13},{tx:10,ty:0,to:'shop',px:10,py:13},{tx:11,ty:0,to:'shop',px:11,py:13},{tx:16,ty:0,to:'office',px:9,py:13},{tx:18,ty:0,to:'parts',px:10,py:13},{tx:2,ty:14,to:'showroom',px:2,py:1},{tx:18,ty:14,to:'showroom',px:15,py:1},{tx:0,ty:2,to:'parkinglot',px:3,py:4},{tx:0,ty:3,to:'parkinglot',px:3,py:4},{tx:0,ty:4,to:'parkinglot',px:3,py:5},{tx:0,ty:6,to:'parkinglot',px:3,py:7},{tx:0,ty:7,to:'parkinglot',px:3,py:7},{tx:0,ty:8,to:'parkinglot',px:3,py:8},{tx:0,ty:10,to:'parkinglot',px:3,py:10},{tx:19,ty:2,to:'parkinglot',px:16,py:4},{tx:19,ty:3,to:'parkinglot',px:16,py:4},{tx:19,ty:4,to:'parkinglot',px:16,py:5},{tx:19,ty:6,to:'parkinglot',px:16,py:7},{tx:19,ty:7,to:'parkinglot',px:16,py:7},{tx:19,ty:8,to:'parkinglot',px:16,py:8}],
    npcs:[{id:'mike',tx:6,ty:4,color:'#e8b898',shirt:'#2c5a8c',sleeves:'long',hair:'#111',name:'MIKE',charCode:'MIKE',dialogue:["Are you finally in uniform?\nGet back to the locker room!"]},{id:'whitney',tx:7,ty:11,color:'#c68642',shirt:'#111',sleeves:'long',hair:'#111',name:'WHITNEY',charCode:'WHITNEY',dialogue:["CSI is down this month.\nDon't mess up my numbers."],acc:{isGirl:true}},{id:'ryan',tx:11,ty:11,color:'#ffccaa',shirt:'#111',sleeves:'long',hair:null,name:'RYAN',charCode:'RYAN',dialogue:["I've been on hold with\nextended warranty for an hour."]},{id:'zack',tx:15,ty:11,color:'#ffdbac',shirt:'#111',sleeves:'long',hair:'#4a3121',name:'ZACK',charCode:'ZACK',dialogue:["Did the parts for that\nAltima come in yet?"]},{id:'desk',tx:3,ty:11,isObject:true,name:'YOUR DESK',charCode:'OBJ',dialogue:["Your assigned Advisor Desk."]},{id:'customer_car',tx:4,ty:3,isObject:true,charCode:'CAR',hidden:true,name:'BROKEN CAR',dialogue:["It smells like burnt clutch\nand bad decisions."]},{id:'angry_customer',tx:8,ty:3,color:'#ffccaa',shirt:'#cc2222',sleeves:'short',hair:'#222',name:'JOHN HUGHES',charCode:'CUSTOMER',hidden:true,dialogue:[]},
    {id:'zack_cust',tx:14,ty:12,color:'#ffccaa',shirt:'#22aa22',sleeves:'short',hair:'#444',name:'FRANK',charCode:'CUSTOMER',hidden:true,dialogue:["Bronson worked on this yesterday!","Now it's blowing smoke everywhere!"]},
    {id:'zack_car',tx:12,ty:12,isObject:true,charCode:'CAR',hidden:true,name:'SMOKING CAR',dialogue:["It smells terrible.","*Cough* *Cough*"]}]},
    shop:{bg:'#5a5a5a',layout:generateEmptyMap(),warps:[{tx:8,ty:14,to:'drive',px:8,py:1},{tx:9,ty:14,to:'drive',px:9,py:1},{tx:10,ty:14,to:'drive',px:10,py:1},{tx:11,ty:14,to:'drive',px:11,py:1},{tx:19,ty:3,to:'bodyshop',px:1,py:7},{tx:19,ty:6,to:'mens_locker_room',px:1,py:7},{tx:19,ty:9,to:'parts',px:1,py:7},{tx:19,ty:12,to:'parts',px:1,py:12},{tx:17,ty:14,to:'office',px:16,py:1},{tx:18,ty:14,to:'office',px:16,py:1},{tx:9,ty:0,to:'parkinglot',px:9,py:2},{tx:10,ty:0,to:'parkinglot',px:10,py:2}],
    npcs:[{id:'rival',tx:6,ty:10,color:'#ffccaa',shirt:'#111',sleeves:'short',hair:'#d4a017',name:'KASEY',charCode:'RIVAL',dialogue:["I'm taking a break.\nI only wrench for Mike\nor Ryan anyway."]},
    {id:'joe',tx:4,ty:6,color:'#ffdbac',shirt:'#111',sleeves:'short',hair:'#222',name:'JOE',charCode:'JOE',isShort:true,dialogue:["I'm a Senior Master Tech.\nI don't have time for basic ROs.", "And yeah, I bought the biggest\ntoolbox. Gotta compensate\nfor something, right?"]},
    {id:'vinnie',tx:15,ty:10,color:'#e8b898',shirt:'#111',sleeves:'short',hair:'#a06540',name:'VINNIE',charCode:'VINNIE',dialogue:["I can knock this out quick,\nbut I don't touch engine work."]},{id:'bronson',tx:15,ty:6,color:'#dcb',shirt:'#111',sleeves:'short',hair:'#cc5500',name:'BRONSON',charCode:'BRONSON',dialogue:["I can fix anything.\nIgnore those comeback numbers."]},{id:'shop_car',tx:13,ty:4,isObject:true,charCode:'CAR',hidden:true,name:'JOHN\'S 2020 EXPLORER',dialogue:["John Hughes' wife's 2020 Explorer.\nNeeds a new engine.\nIt's gonna be here a while."]},
    {id:'bri',tx:2,ty:2,x:2*TILE_SIZE,y:2*TILE_SIZE,isMoving:false,moveTimer:0,speed:1,nextMoveDelay:100,dir:'down',color:'#fff0f0',shirt:'#222',sleeves:'short',hair:'#cc0000',name:'BRI',charCode:'BRI',dialogue:["Ugh, my baby daddy is blowing up\nmy phone again.","Like, can't he see I'm trying\nto buff this clear coat?!","Damone thinks he's the only one\nwho can detail. As if."],acc:{isGirl:true}},
    {id:'b_toolbox',tx:2,ty:1,isObject:true,charCode:'TINY_BLUE_BOX',name:'BRI\'S TOOLBOX',dialogue:["It's a really tiny blue toolbox."]},
    {id:'damone',tx:18,ty:2,color:'#8d5524',shirt:'#111',sleeves:'long',hair:'#111',name:'DAMONE',charCode:'DAMONE',dir:'left',acc:{chain:true},dialogue:["Yo! I'm Damone. You got a Lincoln\nor an angry customer that needs a wash?", "Just page me, I'll knock it out in a jiffy.", "What you playin' on lately?\nI'm a gamer too."]},
    {id:'d_toolbox',tx:18,ty:1,isObject:true,charCode:'TINY_BLUE_BOX',name:'D\'S TOOLBOX',dialogue:["It's a really tiny blue toolbox."]}]},
    mens_locker_room:{bg:'#cccccc',layout:generateEmptyMap(),warps:[{tx:0,ty:7,to:'shop',px:18,py:6}],npcs:[
        {id:'locker',tx:3,ty:1,isObject:true,name:'YOUR LOCKER',charCode:'OBJ',dialogue:["It's your locker.\nChange into uniform?"]},
        {id:'stall_guy',tx:14,ty:1,isObject:false,color:'#ffccaa',shirt:'#fff',sleeves:'short',hair:'#222',name:'OCCUPIED STALL',charCode:'STALL_GUY',dialogue:["*Aggressive splashing*", "I'm gonna be a minute, man!\nFind another stall!"]}
    ]},
    womens_locker_room:{bg:'#cccccc',layout:generateEmptyMap(),warps:[{tx:9,ty:0,to:'bodyshop',px:9,py:13},{tx:10,ty:0,to:'bodyshop',px:10,py:13}],npcs:[
        {id:'womens_locker',tx:3,ty:1,isObject:true,name:'YOUR LOCKER',charCode:'OBJ',dialogue:["Women's locker room.","It smells much better in here."]}
    ]},
    breakroom:{bg:'#dddddd',layout:generateEmptyMap(),warps:[{tx:9,ty:0,to:'bodyshop',px:13,py:13}, {tx:10,ty:0,to:'bodyshop',px:14,py:13}],npcs:[]},
    parts:{bg:'#5a5a5a',layout:generateEmptyMap(),warps:[{tx:0,ty:7,to:'shop',px:18,py:9},{tx:0,ty:12,to:'shop',px:18,py:12},{tx:9,ty:14,to:'drive',px:18,py:1},{tx:10,ty:14,to:'drive',px:18,py:1}, {tx:9,ty:0,to:'bodyshop',px:5,py:13},{tx:10,ty:0,to:'bodyshop',px:6,py:13}],npcs:[
        {id:'ej',tx:7,ty:9,color:'#f1c27d',shirt:'#222',sleeves:'short',hair:'#111',name:'EJ',charCode:'EJ',dir:'down',dialogue:["Hey! Welcome to parts.\nI'll get that pulled for you\nright away!"]},
        {id:'little_mike',tx:11,ty:9,color:'#ffe0bd',shirt:'#111',sleeves:'short',hair:'#d95030',name:'LITTLE MIKE',charCode:'LITTLE_MIKE',dir:'down',isShort:true,acc:{fat:true},dialogue:["I'm the second best parts guy\non this counter.", "EJ is pretty good, but\nI know the catalog better."]},
        {id:'jake',tx:5,ty:5,color:'#ffdbac',shirt:'#111',sleeves:'short',hair:'#cc3300',name:'JAKE',charCode:'JAKE',dir:'left',acc:{beard:'#cc3300'},dialogue:["Adam, you entered the wrong\npart number AGAIN!", "I swear I'm surrounded by idiots."]},
        {id:'adam',tx:5,ty:8,color:'#ffdbac',shirt:'#888',sleeves:'short',hair:'#111',name:'ADAM',charCode:'ADAM',dir:'left',acc:{beard:'#111',glasses:true},dialogue:["I think I ordered a\nwiper blade instead of an alternator.", "Is that bad?"]},
        {id:'jerry',tx:16,ty:2,color:'#ffdbac',shirt:'#fff',sleeves:'long',hair:'#fff',name:'JERRY',charCode:'JERRY',dir:'down',acc:{beard:'#fff',glasses:true},dialogue:["I've run this department for 30 years.", "These advisors don't know a spark plug\nfrom a strut.", "Eric is a good kid. The rest\nof them? Useless.", "Have I shown you pictures\nof my son Kevin?"]},
        {id:'coolant_joe',tx:2,ty:3,x:2*TILE_SIZE,y:3*TILE_SIZE,isMoving:false,moveTimer:0,speed:1,nextMoveDelay:60,isDrinking:false,drinkTimer:0,dir:'down',name:'COOLANT JOE',charCode:'COOLANT_JOE',dialogue:["*Gulp gulp gulp*", "Dex-Cool hits different at 2 AM.", "I'm 40% ethylene glycol now."]}
    ]},
    office:{bg:'#5a5a5a',layout:generateEmptyMap(),warps:[{tx:9,ty:14,to:'drive',px:16,py:1},{tx:10,ty:14,to:'drive',px:16,py:1},{tx:9,ty:0,to:'shop',px:17,py:13},{tx:10,ty:0,to:'shop',px:18,py:13}],npcs:[
    {id:'rick_desk',tx:9,ty:6,isObject:true,name:'BOSS DESK',charCode:'OBJ',dialogue:["Mike's desk.\nIt's covered in spreadsheets."]},
    {id:'rick_desk2',tx:10,ty:6,isObject:true,name:'BOSS PC',charCode:'OBJ',dialogue:["Mike's computer.\nHe's checking your timesheets."]},
    {id:'trophy_case',tx:4,ty:1,isObject:true,name:'TROPHY CASE',charCode:'OBJ',dialogue:["Dealership of the Year!"]},
    {id:'trophy_case2',tx:5,ty:1,isObject:true,name:'TROPHY CASE',charCode:'OBJ',dialogue:["Top Service Department."]},
    {id:'mike',tx:10,ty:5,color:'#e8b898',shirt:'#2c5a8c',sleeves:'long',hair:'#111',name:'MIKE',charCode:'MIKE',hidden:true,dir:'down',dialogue:["What are you doing in here?\nGet back out on the drive!"]},
    {id:'office_ryan',tx:9,ty:7,color:'#ffccaa',shirt:'#111',sleeves:'long',hair:null,name:'RYAN',charCode:'RYAN',hidden:true,dir:'up',dialogue:["Mike is in a mood today."]},
    {id:'office_zack',tx:11,ty:7,color:'#ffdbac',shirt:'#111',sleeves:'long',hair:'#4a3121',name:'ZACK',charCode:'ZACK',hidden:true,dir:'up',dialogue:["I can't believe Bronson."]},
    {id:'office_whitney',tx:10,ty:8,color:'#c68642',shirt:'#111',sleeves:'long',hair:'#111',name:'WHITNEY',charCode:'WHITNEY',hidden:true,dir:'up',dialogue:["Meeting tomorrow? Ugh."],acc:{isGirl:true}}
    ]},
    showroom:{bg:'#fdfdfd',layout:generateEmptyMap(),warps:[{tx:2,ty:0,to:'drive',px:2,py:13},{tx:15,ty:0,to:'drive',px:18,py:13},{tx:9,ty:14,to:'parkinglot',px:9,py:12},{tx:10,ty:14,to:'parkinglot',px:10,py:12},{tx:0,ty:12,to:'parkinglot',px:3,py:9},{tx:0,ty:13,to:'parkinglot',px:3,py:9},{tx:19,ty:12,to:'parkinglot',px:16,py:9},{tx:19,ty:13,to:'parkinglot',px:16,py:9},
    {tx:0,ty:4,to:'showroom_mens',px:18,py:7}, {tx:0,ty:7,to:'showroom_womens',px:18,py:7}], 
    npcs:[
        {id:'mens_room',tx:0,ty:4,isObject:true,name:'MEN\'S ROOM',charCode:'OBJ',dialogue:["A very fancy Men's restroom.","The hand towels are actually cloth."]},
        {id:'womens_room',tx:0,ty:7,isObject:true,name:'WOMEN\'S ROOM',charCode:'OBJ',dialogue:["A high-end Women's restroom.","It smells like expensive perfume."]},
        {id:'dave',tx:2,ty:13,color:'#ffdbac',shirt:'#222',sleeves:'long',hair:'#cc3300',name:'DAVE',charCode:'DAVE',dir:'up',dialogue:["Hey buddy! I need this RO closed\nfive minutes ago!","I could sell ice to an eskimo.\nChop chop!"],acc:{glasses:true}},{id:'brad',tx:6,ty:13,color:'#ffccaa',shirt:'#ccc',sleeves:'long',hair:'#cc3300',name:'BRAD',charCode:'BRAD',dir:'up',dialogue:["Take your time, man. No rush.\nDave's at it again, huh?","Just breathe."],acc:{pants:'#c2b280'}},{id:'john',tx:13,ty:13,color:'#ffdbac',shirt:'#fff',sleeves:'long',hair:'#6b4c3a',name:'JOHN',charCode:'JOHN',dir:'up',dialogue:["Just trying to secure this deal\nso I can go roll.","You train jiu jitsu?\nIt's all about leverage."],acc:{glasses:true,beard:'#6b4c3a',vest:'#222'}},{id:'troy',tx:17,ty:13,color:'#e8b898',shirt:'#111',sleeves:'short',hair:null,name:'TROY',charCode:'TROY',dir:'up',dialogue:["Listen here, peon.\nGet my client's car done.","I only accept excellence."],acc:{glasses:true,beard:'#222'}},{id:'nick',tx:17,ty:5,color:'#ffdbac',shirt:'#888',sleeves:'long',hair:null,name:'NICK',charCode:'NICK',dir:'down',dialogue:["We need more units out the door.\nService better not blow my deals."],acc:{pants:'#111'}},{id:'navigator',tx:9,ty:9,isObject:true,charCode:'SUV_BLACK',hidden:false,name:'LINCOLN NAVIGATOR',dialogue:["2026 Lincoln Navigator.\nBlack on black.","The pinnacle of luxury."]}
    ]},
    showroom_mens:{bg:'#fdfdfd',layout:generateEmptyMap(),warps:[{tx:19,ty:7,to:'showroom',px:1,py:4}],npcs:[]},
    showroom_womens:{bg:'#fdfdfd',layout:generateEmptyMap(),warps:[{tx:19,ty:7,to:'showroom',px:1,py:7}],npcs:[]},
    bodyshop:{bg:'#5a5a5a',layout:generateEmptyMap(),warps:[
        {tx:0,ty:7,to:'shop',px:18,py:3},
        {tx:9,ty:0,to:'parkinglot',px:14,py:2},
        {tx:10,ty:0,to:'parkinglot',px:15,py:2},
        {tx:5,ty:14,to:'parts',px:9,py:1},
        {tx:6,ty:14,to:'parts',px:10,py:1},
        {tx:9,ty:14,to:'womens_locker_room',px:9,py:1},
        {tx:10,ty:14,to:'womens_locker_room',px:10,py:1},
        {tx:13,ty:14,to:'breakroom',px:9,py:1},
        {tx:14,ty:14,to:'breakroom',px:10,py:1},
        {tx:19,ty:2,to:'paintroom',px:1,py:7} 
    ],
    npcs:[{id:'bodytech',tx:10,ty:7,color:'#dcb',shirt:'#111',sleeves:'long',hair:'#111',name:'BODY TECH',charCode:'OBJ',dialogue:["(Sanding sounds drown\nout your voice)"]},
    {id:'wreck1', tx: 3, ty: 3, color: '#8b4513', isObject: true, charCode: 'WRECK_CAR', dialogue:["Rust bucket with a missing driver door."]},
    {id:'wreck2', tx: 10, ty: 2, color: '#2244cc', isObject: true, charCode: 'WRECK_CAR', dialogue:["Front fender crumpled like tin foil."]},
    {id:'wreck3', tx: 4, ty: 8, color: '#cc2222', isObject: true, charCode: 'WRECK_CAR', dialogue:["Smashed red coupe."]},
    {id:'wreck4', tx: 11, ty: 9, color: '#22cc22', isObject: true, charCode: 'WRECK_CAR', dialogue:["Totaled green sedan."]},
    {id:'wreck5', tx: 14, ty: 4, color: '#888888', isObject: true, charCode: 'WRECK_CAR', dialogue:["Silver frame waiting for parts."]},
    {id:'parts_pile', tx: 15, ty: 10, isObject: true, charCode: 'OBJ', name:'PARTS PILE', dialogue:["Doors, hoods, and tires scattered everywhere."]},
    {id: 'gus', tx: 5, ty: 10, color: '#ffdbac', shirt: '#111', sleeves: 'short', hair: '#d4a017', name: 'GUS', charCode: 'GUS', dialogue: ["You smell that? It's the scent\nof a job well done.", "I collect mismatched gloves.", "Damone is always so cool.\nHow does he do it?"]},
    {id: 'red_toolbox', tx: 1, ty: 3, color: '#cc2222', isObject: true, charCode: 'BIG_BOX', name: 'RED TOOLBOX', dialogue: ["A vibrant red toolbox."], acc: {isBigBox: true}},
    {id: 'orange_toolbox', tx: 1, ty: 11, color: '#f97316', isObject: true, charCode: 'BIG_BOX', name: 'ORANGE TOOLBOX', dialogue: ["A bright orange toolbox."], acc: {isBigBox: true}}
    ]},
    paintroom: {
        bg: '#cccccc', layout: generateEmptyMap(), warps: [{tx: 0, ty: 7, to: 'bodyshop', px: 18, py: 2}],
        npcs: [{id: 'paint_stan', tx: 10, ty: 7, color: '#e5e7eb', shirt: '#e5e7eb', sleeves: 'long', hair: null, name: 'STAN', charCode: 'PAINT_TECH', acc: {isPaintSuit: true}, dialogue: ["Shhh! I'm laying down the\nclear coat.", "The fumes in here are\nsomething else.", "Perfect finish, every time."]}]
    },
    parkinglot:{bg:'#111111',layout:generateEmptyMap(),warps:[
        {tx:9,ty:3,to:'shop',px:9,py:1},{tx:10,ty:3,to:'shop',px:10,py:1},
        {tx:14,ty:3,to:'bodyshop',px:9,py:1},{tx:15,ty:3,to:'bodyshop',px:10,py:1},
        {tx:4,ty:4,to:'drive',px:1,py:3},{tx:4,ty:5,to:'drive',px:1,py:4},{tx:4,ty:7,to:'drive',px:1,py:7},{tx:4,ty:8,to:'drive',px:1,py:8},{tx:4,ty:10,to:'drive',px:1,py:10},
        {tx:15,ty:4,to:'drive',px:18,py:3},{tx:15,ty:5,to:'drive',px:18,py:4},{tx:15,ty:7,to:'drive',px:18,py:7},{tx:15,ty:8,to:'drive',px:18,py:8},
        {tx:9,ty:11,to:'showroom',px:9,py:13},{tx:10,ty:11,to:'showroom',px:10,py:13},
        {tx:4,ty:9,to:'showroom',px:1,py:12},{tx:15,ty:9,to:'showroom',px:18,py:12}
    ],npcs:[]}
};

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
for(let y=2; y<=9; y++) maps.parts.layout[y][4] = 33; 
maps.parts.layout[10][4] = 35; maps.parts.layout[5][4] = 32; maps.parts.layout[8][4] = 32; 
maps.parts.layout[11][7]=12; maps.parts.layout[11][11]=12; maps.parts.layout[5][3]=12; maps.parts.layout[8][3]=12;
for(let x=13; x<=18; x++) maps.parts.layout[5][x] = 1; 
for(let y=1; y<=5; y++) maps.parts.layout[y][13] = 1; 
maps.parts.layout[5][15] = 0; maps.parts.layout[3][16] = 34; 
for(let y=2; y<=8; y++) { maps.parts.layout[y][8]=29; maps.parts.layout[y][9]=29; }
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

if(questState.step >= 8 && !gameEvents.isAfterHours) {
    let cust = maps.drive.npcs.find(n => n.id === 'angry_customer');
    let car = maps.drive.npcs.find(n => n.id === 'customer_car');
    let sc = maps.shop.npcs.find(n=>n.id==='shop_car');
    if(sc) sc.hidden = false; 
    if (gameEvents.dailyAptsCompleted < 3) {
        let t = gameEvents.dailyAptsCompleted===0?"morning":gameEvents.dailyAptsCompleted===1?"mid-day":"afternoon";
        if(cust) { cust.hidden = false; cust.name = "APPOINTMENT"; cust.dialogue = ["I'm here for my "+t+"\nappointment.", "Are you going to check me in?"]; }
        if(car) { car.hidden = false; car.name = "CLIENT CAR"; car.dialogue = ["Ready for routine\nmaintenance."]; }
    } else if (gameEvents.dailyWalkIn && !gameEvents.dailyWalkInDone) {
        if(cust) { cust.hidden = false; cust.name = "WALK-IN"; cust.dialogue = ["I don't have an appointment,\ncan you squeeze me in?"]; }
        if(car) { car.hidden = false; car.name = "WALK-IN CAR"; car.dialogue = ["Needs a diagnostic."]; }
    } else { if(cust) cust.hidden = true; if(car) car.hidden = true; }
}

let savedPlayer=null; try{if(localStorage.getItem('serviceBaySave')) savedPlayer=JSON.parse(localStorage.getItem('serviceBaySave')).player;}catch(e){}
const player=savedPlayer||{tx:9,ty:8,x:9*TILE_SIZE,y:8*TILE_SIZE,dir:'down',isMoving:false,moveTimer:0,speed:2};
const dContainer=document.getElementById('dialogue-container'), dName=document.getElementById('dialogue-name'), dText=document.getElementById('dialogue-text'), cBox=document.getElementById('choice-buttons'), arrow=document.getElementById('diag-arrow');

function triggerPAAnnouncement(){
    activeDialogue=["[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."];
    activeLine=0; dName.innerText="SYSTEM"; dText.innerText=activeDialogue[0];
    drawPortrait('NONE'); dContainer.style.display='flex';
}

function pR(x,y,w,h,c){pCtx.fillStyle=c;pCtx.fillRect(x,y,w,h);}
function drawPortrait(c) {
    pCtx.clearRect(0,0,64,64); pR(0,0,64,64,'#6d8fa8');
    if(c==='RICK'){pR(16,48,32,16,'#222');pCtx.fillStyle='#fff';pCtx.beginPath();pCtx.moveTo(32,48);pCtx.lineTo(26,64);pCtx.lineTo(38,64);pCtx.fill();pR(31,52,2,12,'#cc0000');pR(22,18,20,26,'#e8b898');pR(26,28,2,2,'#111');pR(36,28,2,2,'#111');pR(18,16,6,14,'#8a5a44');pR(40,16,6,14,'#8a5a44');pR(22,14,20,4,'#8a5a44');pCtx.strokeStyle='#222';pCtx.lineWidth=1;pCtx.strokeRect(24,26,6,5);pCtx.strokeRect(34,26,6,5);pCtx.beginPath();pCtx.moveTo(30,28);pCtx.lineTo(34,28);pCtx.stroke();pR(29,38,6,1,'#111');}
    else if(c==='MIKE'){pR(16,48,32,16,'#2c5a8c');pCtx.fillStyle='#fff';pCtx.beginPath();pCtx.moveTo(32,48);pCtx.lineTo(28,56);pCtx.lineTo(36,56);pCtx.fill();pR(31,56,2,8,'#999');pR(22,22,20,24,'#e8b898');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,6,'#111');pR(22,40,20,6,'#111');pR(20,36,4,10,'#111');pR(40,36,4,10,'#111');pCtx.strokeStyle='#222';pCtx.lineWidth=1;pCtx.strokeRect(24,30,6,5);pCtx.strokeRect(34,30,6,5);pCtx.beginPath();pCtx.moveTo(30,32);pCtx.lineTo(34,32);pCtx.stroke();}
    else if(c==='WHITNEY'){pR(18,48,28,16,'#111');pR(22,22,20,24,'#c68642');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(18,16,28,8,'#111');pR(16,24,6,24,'#111');pR(42,24,6,24,'#111');pR(28,42,8,2,'#fff');}
    else if(c==='RYAN'){pR(16,48,32,16,'#111');pR(22,18,20,28,'#ffccaa');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,40,24,10,'#6b4c3a');pR(18,36,4,10,'#6b4c3a');pR(42,36,4,10,'#6b4c3a');}
    else if(c==='ZACK'){pR(18,48,28,16,'#111');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(22,16,20,6,'#4a3121');pR(20,22,4,6,'#4a3121');pR(40,22,4,6,'#4a3121');pR(24,40,16,4,'rgba(74,49,33,0.5)');}
    else if(c==='RIVAL'){pR(18,48,28,16,'#111');pR(22,22,20,24,'#ffccaa');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,14,24,12,'#d4a017');pR(29,40,6,1,'#d4a017');}
    else if(c==='BRONSON'){pR(16,48,32,16,'#111');pR(22,22,20,24,'#dcb');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#cc5500');pR(18,20,4,10,'#cc5500');pR(42,20,4,10,'#cc5500');pR(24,42,16,4,'#cc5500');}
    else if(c==='VINNIE'){pR(18,48,28,16,'#111');pR(22,22,20,24,'#e8b898');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#a06540');pR(20,38,24,8,'#a06540');pR(18,32,4,14,'#a06540');pR(42,32,4,14,'#a06540');}
    else if(c==='JOE'){pR(18,48,28,16,'#111');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#222');}
    else if(c==='COOLANT_JOE'){ pR(12,48,40,16,'#1e40af'); pR(20,20,24,24,'#ffdbac'); pR(20,16,24,6,'#1a1a1a'); pR(18,20,4,10,'#1a1a1a'); pR(42,20,4,10,'#1a1a1a'); pR(20,38,24,10,'#1a1a1a'); pR(22,40,4,4,'#94a3b8'); pR(38,40,4,4,'#94a3b8'); pR(26,30,2,2,'#111'); pR(36,30,2,2,'#111'); pR(42,40,16,24,'#fb923c'); pR(40,38,20,4,'#eee'); pR(48,30,4,8,'#33aa33'); }
    else if(c==='PARTS'||c==='JAKE'){pR(18,48,28,16,'#111');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,14,24,10,'#cc3300');pR(20,38,24,10,'#cc3300');}
    else if(c==='ADAM'){pR(18,48,28,16,'#888');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,6,'#111');pR(22,38,20,6,'#111');pR(24,30,6,4,'rgba(255,255,255,0.4)');pR(34,30,6,4,'rgba(255,255,255,0.4)');}
    else if(c==='EJ'){pR(16,48,32,16,'#111');pR(22,22,20,24,'#f1c27d');pR(26,30,2,2,'#111');pR(36,30,2,2,'#111');pR(18,16,28,6,'#111');}
    else if(c==='LITTLE_MIKE'){pR(12,48,40,16,'#111');pR(20,20,24,24,'#ffe0bd');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,6,'#d95030');}
    else if(c==='JERRY'){pR(16,48,32,16,'#fff');pR(22,22,20,24,'#ffdbac');pR(26,30,2,2,'#111');pR(36,30,2,2,'#111');pR(20,16,24,6,'#fff');pR(18,20,4,10,'#fff');pR(42,20,4,10,'#fff');pR(22,36,20,10,'#fff');pR(24,28,6,4,'rgba(255,255,255,0.6)');pR(34,28,6,4,'rgba(255,255,255,0.6)');pR(26,40,12,4,'#fff');}
    else if(c==='DAMONE'){pR(12,48,40,16,'#111');pR(20,20,24,24,'#8d5524');pR(18,16,28,10,'#111');pR(26,30,2,2,'#111');pR(36,30,2,2,'#111');pR(14,24,6,18,'#111');pR(44,24,6,18,'#111');pR(28,42,8,2,'#ffd700');}
    else if(c==='STALL_GUY'){pR(18,48,28,16,'#fff');pR(22,22,20,24,'#ffccaa');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#222');}
    else if(c==='NICK'){pR(16,48,32,16,'#111');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#888');pR(18,20,4,10,'#888');pR(42,20,4,10,'#888');}
    else if(c==='DAVE'){pR(16,48,32,16,'#111');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,14,24,8,'#cc3300');pR(20,16,24,8,'#222');pR(18,20,4,10,'#222');pR(42,20,4,10,'#222');pR(24,30,6,4,'#fff');pR(34,30,6,4,'#fff');}
    else if(c==='BRAD'){pR(16,48,32,16,'#c2b280');pR(22,22,20,24,'#ffccaa');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,14,24,8,'#cc3300');pR(20,16,24,8,'#ccc');pR(18,20,4,10,'#ccc');pR(42,20,4,10,'#ccc');}
    else if(c==='JOHN'){pR(16,48,32,16,'#fff');pR(20,48,24,16,'#222');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,14,24,8,'#6b4c3a');pR(22,38,20,8,'#6b4c3a');pR(20,16,24,8,'#fff');pR(18,20,4,10,'#fff');pR(42,20,4,10,'#fff');pR(20,16,24,8,'#222');pR(24,30,6,4,'rgba(255,255,255,0.4)');pR(34,30,6,4,'rgba(255,255,255,0.4)');}
    else if(c==='TROY'){pR(16,48,32,16,'#111');pR(22,22,20,24,'#e8b898');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(22,38,20,8,'#222');pR(20,16,24,8,'#111');pR(18,20,4,6,'#111');pR(42,20,4,6,'#111');pR(24,30,6,4,'rgba(255,255,255,0.4)');pR(34,30,6,4,'rgba(255,255,255,0.4)');}
    else if(c==='CUSTOMER'||c==='APPOINTMENT'||c==='WALK-IN'){pR(18,48,28,16,'#cc2222');pR(22,22,20,24,'#ffccaa');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#222');pCtx.beginPath();pCtx.moveTo(24,28);pCtx.lineTo(30,30);pCtx.stroke();pCtx.beginPath();pCtx.moveTo(40,28);pCtx.lineTo(34,30);pCtx.stroke();pR(29,42,6,4,'#222');}
    else if(c==='PLAYER'){let skin=playerDetails.gender==='Boy'?'#ffccaa':'#ffdbac';let hair=playerDetails.gender==='Boy'?'#4a3121':'#f6c944';pR(18,48,28,16,playerDetails.inUniform?'#111':'#fff');pR(22,22,20,24,skin);pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');if(playerDetails.gender==='Boy'){pR(20,16,24,8,hair);pR(18,20,4,10,hair);}else{pR(18,16,28,10,hair);pR(18,26,6,18,hair);pR(40,26,6,18,hair);}}
    else if(c==='GUS'){ pR(16,48,32,16,'#111'); pR(22,18,20,26,'#ffdbac'); pR(26,28,2,2,'#111');pR(36,28,2,2,'#111'); pR(29,38,6,1,'#111'); pR(18,16,6,14,'#d4a017');pR(40,16,6,14,'#d4a017');pR(22,14,20,4,'#d4a017'); }
    else if(c==='PAINT_TECH'){ pR(16,48,32,16,'#e5e7eb'); pR(22,18,20,26,'#ffdbac'); pCtx.strokeStyle='#111';pCtx.lineWidth=1;pCtx.strokeRect(24,26,6,5);pCtx.strokeRect(34,26,6,5);pCtx.beginPath();pCtx.moveTo(30,28);pCtx.lineTo(34,28);pCtx.stroke(); pR(29,38,6,1,'#111'); }
    else {pR(0,0,64,64,'#111');}
}

function resetChoices() { cBox.innerHTML = '<button class="choice-btn" onclick="makeChoice(\'YES\', event)">YES</button><button class="choice-btn" onclick="makeChoice(\'NO\', event)">NO</button>'; }

function checkChoiceTrigger(){
    let txt = activeDialogue[activeLine];
    if(txt==="[CHOICE_MIKE_YESNO]"){currentChoiceType='MIKE';dText.innerText="Did you talk to Mike\nabout this ticket?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_CHECKIN_YESNO]"){currentChoiceType='CHECKIN';dText.innerText="Check vehicle in?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_END_SHIFT]"){currentChoiceType='END_SHIFT';dText.innerText="End shift and advance to next day?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_CHECKIN_DAILY]"){currentChoiceType='CHECKIN_DAILY';dText.innerText="Check in the scheduled appointment?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_CHECKIN_WALKIN]"){currentChoiceType='CHECKIN_WALKIN';dText.innerText="Check in the unexpected walk-in?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_SAVE_GAME]"){currentChoiceType='SAVE_GAME';dText.innerText="Would you like to save the game?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_PC_MAIN]"){
        currentChoiceType='PC_MAIN'; dText.innerText="Select an option:";
        
        let canCheckIn = (questState.step === 2 || gameEvents.carWaitingForRO);
        let menuHTML = '';
        if(canCheckIn) {
            menuHTML += '<button class="choice-btn" style="color:#22aa22;" onclick="makeChoice(\'DO_CHECKIN\', event)">CHECK IN</button>';
        } else {
            menuHTML += '<button class="choice-btn" style="color:#777; pointer-events:none;" onclick="event.stopPropagation();">CHECK IN</button>';
        }
        menuHTML += '<button class="choice-btn" onclick="makeChoice(\'TIME_CLOCK\', event)">TIME CLOCK</button><button class="choice-btn" onclick="makeChoice(\'OPEN_ROS\', event)">OPEN ROs</button><button class="choice-btn" onclick="makeChoice(\'CLOSED_ROS\', event)">CLOSED ROs</button><button class="choice-btn" onclick="makeChoice(\'EXIT\', event)">EXIT</button>';
        cBox.innerHTML = menuHTML;
        cBox.style.display='flex'; arrow.style.display='none';
    }
}

function makeChoice(val,e){
    e.stopPropagation(); cBox.style.display='none'; arrow.style.display='block';
    
    if(currentChoiceType==='PC_MAIN'){
        resetChoices();
        if(val==='EXIT'){ activeDialogue=["Logged off."]; activeLine=0; dText.innerText=activeDialogue[0]; } 
        else if(val==='OPEN_ROS'){ activeDialogue=["You have 3 Open ROs.\nAll waiting on parts."]; activeLine=0; dText.innerText=activeDialogue[0]; } 
        else if(val==='CLOSED_ROS'){ activeDialogue=["0 Closed ROs.\nDave is going to yell at you."]; activeLine=0; dText.innerText=activeDialogue[0]; } 
        else if(val==='TIME_CLOCK'){
            if(questState.step>=8 || gameEvents.timeMinutes >= 1080) {
                activeDialogue=["End your shift and clock out?","[CHOICE_END_SHIFT]"];
                activeLine=0; dText.innerText=activeDialogue[0];
                checkChoiceTrigger(); 
            } else { activeDialogue=["Your shift isn't over yet!"]; activeLine=0; dText.innerText=activeDialogue[0]; }
        }
        else if(val==='DO_CHECKIN') {
             if(questState.step===2){
                 questState.step=3; questState.roNumber++;
                 activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!","Take it to Mike to dispatch."];
             } else if(gameEvents.carWaitingForRO==='daily'){
                 gameEvents.carWaitingForRO=false; gameEvents.dailyAptsCompleted++; questState.roNumber++;
                 let cust=maps.drive.npcs.find(n=>n.id==='angry_customer');let car=maps.drive.npcs.find(n=>n.id==='customer_car');
                 if(gameEvents.dailyAptsCompleted<3){
                     let nApt=gameEvents.dailyAptsCompleted===1?"mid-day":"afternoon";
                     activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nYour "+nApt+" appointment\nhas arrived.","[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."];
                     if(cust){cust.name="APPOINTMENT";cust.dialogue=["I'm here for my "+nApt+"\nappointment."];}
                 }else if(gameEvents.dailyWalkIn){
                     activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nWait, another car just pulled up.\nIt's a walk-in!","[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."];
                     if(cust){cust.name="WALK-IN";cust.dialogue=["Can you squeeze me in?"];}if(car){car.name="WALK-IN CAR";car.dialogue=["Needs a diagnostic."];}
                 }else{
                     activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nThat's it for today.\nEnd your shift at your computer."];
                     if(cust)cust.hidden=true;if(car)car.hidden=true;
                 }
             } else if(gameEvents.carWaitingForRO==='walkin'){
                 gameEvents.carWaitingForRO=false; gameEvents.dailyWalkInDone=true; questState.roNumber++;
                 let cust=maps.drive.npcs.find(n=>n.id==='angry_customer');let car=maps.drive.npcs.find(n=>n.id==='customer_car');
                 if(cust)cust.hidden=true;if(car)car.hidden=true;
                 activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nThe drive is empty.","Time to clock out at your computer."];
             }
             activeLine=0; dText.innerText=activeDialogue[0];
        }
        return;
    }
    
    resetChoices();
    if(currentChoiceType==='CHECKIN'){if(val==='NO'){activeDialogue=["You backed away from the vehicle."];activeLine=0;dText.innerText=activeDialogue[0];}if(val==='YES'){questState.step=2;activeDialogue=["Vehicle checked in.\nGo to your computer to write the RO."];activeLine=0;dText.innerText=activeDialogue[0];}}
    else if(currentChoiceType==='MIKE'){if(val==='NO'){activeDialogue=["I'm not working on that until\nyou talk to Mike."];activeLine=0;dText.innerText=activeDialogue[0];}if(val==='YES'){if(!questState.talkedToMike){activeDialogue=["Don't lie to me.\nI didn't hear him page me."];activeLine=0;dText.innerText=activeDialogue[0];}else{if(questState.assignedTo===dName.innerText){activeDialogue=["Mike sent you? Fine, pull it\ninto my bay.","Hope there's no comebacks\non this one..."];activeLine=0;dText.innerText=activeDialogue[0];questState.step=4;}else{activeDialogue=["Mike didn't assign that to me.\nKick rocks."];activeLine=0;dText.innerText=activeDialogue[0];}}}}
    else if(currentChoiceType==='END_SHIFT'){
        if(val==='NO'){activeDialogue=["You backed away from the terminal."];activeLine=0;dText.innerText=activeDialogue[0];}
        if(val==='YES'){
            gameEvents.currentDay=(gameEvents.currentDay||1)+1;gameEvents.dailyWalkIn=Math.random()<0.3;gameEvents.dailyAptsCompleted=0;gameEvents.dailyWalkInDone=false;gameEvents.timeMinutes=420;gameEvents.tick=0;
            gameEvents.isAfterHours = false; gameEvents.meeting = false; gameEvents.zackComeback = false; gameEvents.lightsOut = false; gameEvents.carWaitingForRO = false; questState.step=8;
            Object.values(maps).forEach(m => { m.npcs.forEach(n => {
                n.hidden = false;
                if(n.id==='customer_car' || n.id==='angry_customer' || n.id==='shop_car') n.hidden=true;
                if(n.id==='mike' && m===maps.office) n.hidden=false; if(n.id==='mike' && m===maps.drive) n.hidden=true;
                if(n.id==='zack_cust' || n.id==='zack_car') n.hidden=true; if(n.id.startsWith('office_')) n.hidden=true;
            });});
            let cust=maps.drive.npcs.find(n=>n.id==='angry_customer');let car=maps.drive.npcs.find(n=>n.id==='customer_car');let sc=maps.shop.npcs.find(n=>n.id==='shop_car');
            if(cust){cust.hidden=false;cust.name="APPOINTMENT";cust.dialogue=["I'm here for my morning\nservice."];}if(car){car.hidden=false;car.name="CLIENT CAR";car.dialogue=["Ready for routine\nmaintenance."];}if(sc)sc.hidden=false;
            triggerFlash();activeDialogue=gameEvents.dailyWalkIn?["Day "+gameEvents.currentDay+" begins.\nYou have 3 appointments.","Expect a walk-in later.","[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."]:["Day "+gameEvents.currentDay+" begins.\nYou have 3 appointments.","[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."];
            activeLine=0;dText.innerText=activeDialogue[0];dName.innerText="SYSTEM";drawPortrait('NONE');
        }
    }
    else if(currentChoiceType==='CHECKIN_DAILY'){if(val==='NO'){activeDialogue=["You ignored the vehicle."];activeLine=0;dText.innerText=activeDialogue[0];}if(val==='YES'){gameEvents.carWaitingForRO='daily';activeDialogue=["Vehicle checked in.\nGo to your computer to write the RO."];activeLine=0;dText.innerText=activeDialogue[0];}}
    else if(currentChoiceType==='CHECKIN_WALKIN'){if(val==='NO'){activeDialogue=["You ignored the vehicle."];activeLine=0;dText.innerText=activeDialogue[0];}if(val==='YES'){gameEvents.carWaitingForRO='walkin';activeDialogue=["Vehicle checked in.\nGo to your computer to write the RO."];activeLine=0;dText.innerText=activeDialogue[0];}}
    else if(currentChoiceType==='SAVE_GAME'){if(val==='NO'){activeDialogue=["Save cancelled."];activeLine=0;dText.innerText=activeDialogue[0];}if(val==='YES'){const data={player,playerDetails,currentMapKey,gameEvents,questState};localStorage.setItem('serviceBaySave',JSON.stringify(data));activeDialogue=["Saving...\nDon't turn off the power.",playerDetails.name+" saved the game!"];activeLine=0;dText.innerText=activeDialogue[0];}}
}

function triggerFlash(){gameState='FLASH';flash.active=true;flash.alpha=0;flash.state='fade_out';}
function playIntroLine(){
    let step=introScript[introIndex];if(!step)return;
    if(step.type==='ACTION'){
        dContainer.style.display='none';
        if(step.action==='[SHOW_GENDER]')document.getElementById('choice-box').style.display='flex';
        if(step.action==='[SHOW_NAME]'){document.getElementById('name-box').style.display='flex';document.getElementById('player-name-input').focus();}
        if(step.action==='[SHOW_RIVAL_NAME]'){document.getElementById('rival-name-box').style.display='flex';document.getElementById('rival-name-input').focus();}
        if(step.action==='[START_GAME]'){document.getElementById('intro-screen').style.display='none';gameState='PLAYING';activeDialogue=["You're late.\nGo to the locker room in the shop.\nGet your uniform on."];activeLine=0;dName.innerText="MIKE";dText.innerText=activeDialogue[0];drawPortrait('MIKE');dContainer.style.display='flex';}
    }else{
        let line=step.text.replace(/\[PLAYER_NAME\]/g,playerDetails.name).replace(/\[RIVAL_NAME\]/g,playerDetails.rivalName);
        dName.innerText=step.char==='PLAYER'?playerDetails.name:"RICK SELLERS";dText.innerText=line;drawPortrait(step.char);
    }
}
function selectGender(g){playerDetails.gender=g;document.getElementById('choice-box').style.display='none';dContainer.style.display='flex';introIndex++;playIntroLine();}
function confirmName(){if(introScript[introIndex].action!=='[SHOW_NAME]')return;let n=document.getElementById('player-name-input').value.toUpperCase();if(n.trim()==='')n='CHANDLER';playerDetails.name=n;document.getElementById('name-box').style.display='none';dContainer.style.display='flex';introIndex++;playIntroLine();}
function confirmRivalName(){if(introScript[introIndex].action!=='[SHOW_RIVAL_NAME]')return;let n=document.getElementById('rival-name-input').value.toUpperCase();if(n.trim()==='')n='KASEY';playerDetails.rivalName=n;const rivalObj=maps.shop.npcs.find(npc=>npc.id==='rival');if(rivalObj){rivalObj.name=playerDetails.rivalName;rivalObj.dialogue=[`Whatever, ${playerDetails.name}.\nI only wrench for Mike or Ryan.`];}document.getElementById('rival-name-box').style.display='none';dContainer.style.display='flex';introIndex++;playIntroLine();}
function advanceDialogue(){
    if(cBox.style.display==='flex')return;
    if(gameState==='INTRO'){
        if(introScript[introIndex]&&introScript[introIndex].type==='ACTION')return;
        introIndex++; if(introIndex<introScript.length) playIntroLine();
    }else if(activeDialogue){
        activeLine++;
        if(activeLine>=activeDialogue.length){
            if(gameEvents.pendingMeetingTeleport) {
                gameEvents.pendingMeetingTeleport = false;
                gameState = 'TRANSITION'; transition.active = true; transition.alpha = 0; transition.state = 'fade_out';
                transition.dest = {to: 'office', px: 9, py: 8, isMeeting: true};
                dContainer.style.display='none'; activeDialogue=null;
                return;
            }
            if(dName.innerText==='YOUR LOCKER'&&!playerDetails.inUniform){
                playerDetails.inUniform=true;
                let dm=maps.drive.npcs.find(n=>n.id==='mike');if(dm)dm.hidden=true;
                let om=maps.office.npcs.find(n=>n.id==='mike');if(om)om.hidden=false;
                activeDialogue=["You put on the black Advisor Uniform.\nYour shift has officially begun."];activeLine=0;dText.innerText=activeDialogue[0];drawPortrait('PLAYER');return;
            }
            if(questState.step===6&&dName.innerText==='MIKE'){
                questState.step=7; playerDetails.hasRunningShoes=true;
                activeDialogue=["You received the Non-Slip Running Shoes!\nHold 'B' (or Shift) while moving to run.","(Tutorial Complete. Use your locker\nin the breakroom to end your shift.)"];activeLine=0;dName.innerText="SYSTEM";dText.innerText=activeDialogue[0];drawPortrait('NONE');return;
            }
            if(gameState==='CUTSCENE'){gameState='PLAYING';gameEvents.firstCustomerTriggered=true;questState.active=true;questState.step=1;}
            if(questState.step===4&&dName.innerText==='BRONSON'){questState.step=5;triggerFlash();}
            dContainer.style.display='none';activeDialogue=null;
        }else{dText.innerText=activeDialogue[activeLine];checkChoiceTrigger();}
    }
}

function interact(){if(gameState==='TITLE'){startGameFromTitle();return;}if(gameState==='INTRO'||activeDialogue||gameState==='TRANSITION'||gameState==='CUTSCENE'||gameState==='FLASH'){advanceDialogue();return;}let tx=player.tx;let ty=player.ty;if(player.dir==='up')ty--;if(player.dir==='down')ty++;if(player.dir==='left')tx--;if(player.dir==='right')tx++;const npc=maps[currentMapKey].npcs.find(n=>{if(n.hidden)return false;if(n.charCode==='CAR'||n.charCode==='SUV_BLACK'||n.charCode==='WRECK_CAR'||n.charCode==='BIG_BOX')return(tx>=n.tx&&tx<=n.tx+2&&ty>=n.ty&&ty<=n.ty+1);return n.tx===tx&&n.ty===ty;});if(npc){dContainer.style.display='flex';dName.innerText=npc.name;if(npc.id==='locker' || npc.id==='womens_locker'){activeDialogue=["It's your locker.","It smells like stale cologne."];}else if(npc.id==='desk'){if(questState.step===5){activeDialogue=["You have a new email from MIKE:\n\"Come into my office.\""];questState.step=6;}else{activeDialogue=["Car Planet OS\nWhat would you like to do?","[CHOICE_PC_MAIN]"];}}else if(questState.active&&questState.step>=1&&questState.step<=4){if(questState.step===1&&npc.id==='customer_car'){activeDialogue=["[CHOICE_CHECKIN_YESNO]"];}else if(questState.step===2&&npc.id==='desk'){activeDialogue=["Writing Repair Order...\nRO #"+questState.roNumber+" printed!","Take it to Mike to dispatch."];questState.roNumber++;questState.step=3;}else if(questState.step>=3&&npc.id==='mike'){activeDialogue=["An engine knocking?\nSounds heavy.","Vinnie won't touch engine work.\nGive it to Bronson."];questState.talkedToMike=true;questState.assignedTo='BRONSON';}else if(questState.step>=3&&['rival','joe','vinnie','bronson'].includes(npc.id)){activeDialogue=["[CHOICE_MIKE_YESNO]"];}else if(npc.id==='angry_customer'){activeDialogue=["What are you doing?!\nI thought you were supposed\nto be getting my car fixed!"];}else{activeDialogue=npc.dialogue;}}else if(questState.active&&questState.step>=5&&questState.step<8){if(questState.step===5&&npc.id==='desk'){activeDialogue=["You have a new email from MIKE:\n\"Come into my office.\""];questState.step=6;}else if(questState.step===6&&npc.id==='mike'){activeDialogue=["Nice work getting that\nout to Bronson.","You're gonna want to keep\nan eye on this ticket.","This guy can either be your\nbest friend or your worst enemy.","By the way, I saw the way\nyou were moving out there.","Gonna have to pick it up.","I got this pair of non-slip\nrunning shoes for you.", "Your next appointment\nisn't until noon.", "Go find something to do."];}else{activeDialogue=npc.dialogue;}}else if(questState.active&&questState.step>=8){if(npc.id==='customer_car'){if(gameEvents.dailyAptsCompleted<3){activeDialogue=["[CHOICE_CHECKIN_DAILY]"];}else if(gameEvents.dailyWalkIn&&!gameEvents.dailyWalkInDone){activeDialogue=["[CHOICE_CHECKIN_WALKIN]"];}else{activeDialogue=["The drive is clear."];}}else if(npc.id==='angry_customer'){if(gameEvents.dailyAptsCompleted<3){let t=gameEvents.dailyAptsCompleted===0?"morning":gameEvents.dailyAptsCompleted===1?"mid-day":"afternoon";activeDialogue=["I'm here for my "+t+" appointment.\nAre you going to check me in?"];}else if(gameEvents.dailyWalkIn&&!gameEvents.dailyWalkInDone){activeDialogue=["I don't have an appointment,\ncan you squeeze me in?"];}else{activeDialogue=["Thanks for the help!"];}}else if(npc.id==='mike'){activeDialogue=["Keep the drive moving, Chandler.\nDay "+gameEvents.currentDay+" is busy."];}else if(npc.id==='desk'){activeDialogue=["RO System active.\nCurrent RO: #"+questState.roNumber];}else{activeDialogue=npc.dialogue;}}else{activeDialogue=npc.dialogue;}activeLine=0;dText.innerText=activeDialogue[0];drawPortrait(npc.charCode);checkChoiceTrigger();if(!npc.isObject){npc.dir=player.dir==='up'?'down':player.dir==='down'?'up':player.dir==='left'?'right':'left';}}}
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

function isSolid(tx,ty){if(tx<0||tx>=MAP_COLS||ty<0||ty>=MAP_ROWS)return true;const tile=maps[currentMapKey].layout[ty][tx];if([1,2,3,4,5,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45].includes(tile))return true;if(maps[currentMapKey].npcs.some(n=>{if(n.hidden)return false;if(n.charCode==='CAR'||n.charCode==='SUV_BLACK'||n.charCode==='WRECK_CAR')return(tx>=n.tx&&tx<=n.tx+2&&ty>=n.ty&&ty<=n.ty+1);if(n.charCode==='BIG_BOX')return(tx===n.tx&&(ty===n.ty||ty===n.ty+1));return!n.isObject&&n.tx===tx&&n.ty===ty;}))return true;return false;}

function triggerCutscene(customerObj){gameState='CUTSCENE';customerObj.hidden=false;player.dir='down';customerObj.dir='up';let carObj=maps.drive.npcs.find(n=>n.id==='customer_car');if(carObj)carObj.hidden=false;activeDialogue=["Hey! Advisor! Over here!\nMy car sounds like a\nblender full of rocks!","I need this looked at right now.\nAnd don't try to upsell me!"];activeLine=0;dName.innerText=customerObj.name;dText.innerText=activeDialogue[0];drawPortrait(customerObj.charCode);dContainer.style.display='flex';}
function toggleStartMenu(){if(gameState==='MENU'){document.getElementById('start-menu').style.display='none';gameState='PLAYING';}else if(gameState==='PLAYING'){let m=gameEvents.timeMinutes,h=Math.floor(m/60),ampm=h>=12?'PM':'AM';h=h%12;if(h===0)h=12;let mins=m%60;let timeStr=h+':'+(mins<10?'0':'')+mins+' '+ampm;document.getElementById('menu-header').innerText='DAY '+gameEvents.currentDay+'\n'+timeStr;document.getElementById('start-menu').style.display='block';gameState='MENU';}}
function saveGame(){toggleStartMenu();activeDialogue=["Would you like to save the game?","[CHOICE_SAVE_GAME]"];activeLine=0;dName.innerText="SYSTEM";dText.innerText=activeDialogue[0];drawPortrait('NONE');dContainer.style.display='flex';}

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

function update(){
    if(gameState==='MENU')return;if(gameState==='TITLE'||gameState==='INTRO'||activeDialogue||gameState==='CUTSCENE')return;
    let joe = (maps && maps[currentMapKey] && maps[currentMapKey].npcs) ? maps[currentMapKey].npcs.find(n => n.id === 'coolant_joe') : null;
    if(joe && !joe.hidden) updateWanderer(joe);
    let bri = (maps && maps[currentMapKey] && maps[currentMapKey].npcs) ? maps[currentMapKey].npcs.find(n => n.id === 'bri') : null;
    if(bri && !bri.hidden) updateWanderer(bri);
    
    if(gameState==='PLAYING'){
        gameEvents.tick++;
        if(gameEvents.tick>=60){gameEvents.tick=0;if(gameEvents.timeMinutes<1440)gameEvents.timeMinutes++;}
        
        if(gameEvents.currentDay===1&&questState.step===7&&gameEvents.timeMinutes>=720){
            questState.step=8;gameEvents.dailyAptsCompleted=2;gameEvents.dailyWalkIn=false;let cust=maps.drive.npcs.find(n=>n.id==='angry_customer');let car=maps.drive.npcs.find(n=>n.id==='customer_car');if(cust){cust.hidden=false;cust.name="APPOINTMENT";cust.dialogue=["I'm here for my afternoon\nappointment.", "Are you going to check me in?"];}if(car){car.hidden=false;car.name="CLIENT CAR";car.dialogue=["Ready for routine\nmaintenance."];}triggerPAAnnouncement();
        }
        
        if(gameEvents.timeMinutes === 900 && !gameEvents.zackComeback) {
            gameEvents.zackComeback = true;
            let zCust = maps.drive.npcs.find(n=>n.id==='zack_cust'); let zCar = maps.drive.npcs.find(n=>n.id==='zack_car');
            if(zCust) zCust.hidden = false; if(zCar) zCar.hidden = false;
            activeDialogue=["[P.A. SYSTEM]\nZack, you have a comeback\nwaiting on the drive."];
            activeLine=0; dName.innerText="SYSTEM"; dText.innerText=activeDialogue[0];
            drawPortrait('NONE'); dContainer.style.display='flex';
        }
        
        if(gameEvents.timeMinutes === 1050 && !gameEvents.meeting) {
            gameEvents.meeting = true;
            activeDialogue=["[P.A. SYSTEM]\nAll service advisors report\nto Mike's office immediately."];
            activeLine=0; dName.innerText="SYSTEM"; dText.innerText=activeDialogue[0];
            drawPortrait('NONE'); dContainer.style.display='flex';
            gameEvents.pendingMeetingTeleport = true;
        }
        
        if(gameEvents.timeMinutes === 1080 && !gameEvents.lightsOut) {
            gameEvents.lightsOut = true; gameEvents.isAfterHours = true;
            Object.values(maps).forEach(m => {
                m.npcs.forEach(n => {
                    if(n.id !== 'coolant_joe' && n.id !== 'dave' && !n.isObject) { n.hidden = true; }
                });
            });
        }
    }
    
    if(gameState==='FLASH'){
        if(flash.state==='fade_out'){
            flash.alpha+=0.1;if(flash.alpha>=1){
                flash.alpha=1;flash.state='fade_in';
                let dc=maps.drive.npcs.find(n=>n.id==='customer_car');if(dc&&questState.step<8)dc.hidden=true;
                let ac=maps.drive.npcs.find(n=>n.id==='angry_customer');if(ac&&questState.step<8)ac.hidden=true;
                let sc=maps.shop.npcs.find(n=>n.id==='shop_car');if(sc&&questState.step<8)sc.hidden=false;
            }
        }else if(flash.state==='fade_in'){
            flash.alpha-=0.1;if(flash.alpha<=0){flash.alpha=0;flash.active=false;gameState='PLAYING';}
        }
        return;
    }
    if(gameState==='TRANSITION'){
        if(transition.state==='fade_out'){
            transition.alpha+=0.05;if(transition.alpha>=1){
                transition.alpha=1;transition.state='fade_in';currentMapKey=transition.dest.to;player.tx=transition.dest.px;player.ty=transition.dest.py;player.x=player.tx*TILE_SIZE;player.y=player.ty*TILE_SIZE;
            }
        }else if(transition.state==='fade_in'){
            transition.alpha-=0.05;if(transition.alpha<=0){
                transition.alpha=0;transition.active=false;gameState='PLAYING';
                if(currentMapKey==='drive'&&playerDetails.inUniform&&!gameEvents.firstCustomerTriggered){
                    let customer=maps.drive.npcs.find(n=>n.id==='angry_customer');if(customer)triggerCutscene(customer);
                }
                if(transition.dest && transition.dest.isMeeting) {
                    let oryan = maps.office.npcs.find(n=>n.id==='office_ryan'); let ozack = maps.office.npcs.find(n=>n.id==='office_zack'); let owhit = maps.office.npcs.find(n=>n.id==='office_whitney');
                    if(oryan) oryan.hidden = false; if(ozack) ozack.hidden = false; if(owhit) owhit.hidden = false;
                    player.dir = 'up';
                    setTimeout(()=>{
                        activeDialogue=["Listen up, team.", "CSI is slipping and Bronson's comebacks\nare through the roof.", "We're having a mandatory meeting\ntomorrow at 7:00 AM sharp.", "Don't be late. Back to work."];
                        activeLine=0; dName.innerText="MIKE"; dText.innerText=activeDialogue[0];
                        drawPortrait('MIKE'); dContainer.style.display='flex';
                    }, 200);
                }
            }
        }
        return;
    }
    
    if(!player.isMoving){
        let dx=0;let dy=0;if(keys.w){dy=-1;player.dir='up';}else if(keys.s){dy=1;player.dir='down';}else if(keys.a&&!keys.enter){dx=-1;player.dir='left';}else if(keys.d){dx=1;player.dir='right';}
        if(dx!==0||dy!==0){if(!isSolid(player.tx+dx,player.ty+dy)){player.tx+=dx;player.ty+=dy;player.isMoving=true;player.moveTimer=TILE_SIZE;player.speed=(playerDetails.hasRunningShoes&&keys.b)?4:2;}}
    }else{
        player.moveTimer-=player.speed;if(player.dir==='up')player.y-=player.speed;if(player.dir==='down')player.y+=player.speed;if(player.dir==='left')player.x-=player.speed;if(player.dir==='right')player.x+=player.speed;
        if(player.moveTimer<=0){player.isMoving=false;player.x=player.tx*TILE_SIZE;player.y=player.ty*TILE_SIZE;const warp=maps[currentMapKey].warps.find(w=>w.tx===player.tx&&w.ty===player.ty);if(warp)triggerWarp(warp);}
    }
}

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
        if(['drive', 'shop', 'parts', 'breakroom', 'womens_locker_room', 'mens_locker_room', 'bodyshop', 'paintroom'].includes(currentMapKey)) {
            ctx.fillStyle = 'rgba(0,10,30,0.5)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
        }
    }
    
    if(transition.active){ctx.fillStyle=`rgba(0,0,0,${transition.alpha})`;ctx.fillRect(0,0,canvas.width,canvas.height);}
    if(flash.active){ctx.fillStyle=`rgba(255,255,255,${flash.alpha})`;ctx.fillRect(0,0,canvas.width,canvas.height);}
}

function loop(){update();draw();requestAnimationFrame(loop);}
window.addEventListener('keydown',e=>{if(document.activeElement.tagName==='INPUT')return;let k=e.key.toLowerCase();if(k==='arrowup')k='w';if(k==='arrowdown')k='s';if(k==='arrowleft')k='a';if(k==='arrowright')k='d';if(k==='p'&&gameState!=='INTRO'&&gameState!=='TITLE')toggleStartMenu();if(k==='shift'||k==='b')k='b';if(keys.hasOwnProperty(k))keys[k]=true;});
window.addEventListener('keyup',e=>{if(document.activeElement.tagName==='INPUT')return;let k=e.key.toLowerCase();if(k==='arrowup')k='w';if(k==='arrowdown')k='s';if(k==='arrowleft')k='a';if(k==='arrowright')k='d';if(k==='shift'||k==='b')k='b';if(keys.hasOwnProperty(k))keys[k]=false;if((e.key==='Enter'||e.key===' ')&&!actionTriggered){actionTriggered=true;interact();setTimeout(()=>{actionTriggered=false;},100);}});
const bindTouchDir=(id,k)=>{const btn=document.getElementById(id);btn.addEventListener('touchstart',e=>{e.preventDefault();keys[k]=true;});btn.addEventListener('touchend',e=>{e.preventDefault();keys[k]=false;});};
bindTouchDir('btn-up','w');bindTouchDir('btn-down','s');bindTouchDir('btn-left','a');bindTouchDir('btn-right','d');
document.getElementById('btn-a').addEventListener('touchstart',e=>{e.preventDefault();if(!actionTriggered){actionTriggered=true;interact();}});
document.getElementById('btn-a').addEventListener('touchend',e=>{e.preventDefault();actionTriggered=false;});
document.getElementById('btn-b').addEventListener('touchstart',e=>{e.preventDefault();keys['b']=true;});
document.getElementById('btn-b').addEventListener('touchend',e=>{e.preventDefault();keys['b']=false;});
document.getElementById('btn-start').addEventListener('touchstart',e=>{e.preventDefault();toggleStartMenu();});
loop();
