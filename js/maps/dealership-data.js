/* Dealership map definitions — layout unchanged */
// --- MAP DATA LOCKED ---
const dealershipMaps = {
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
