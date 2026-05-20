function refreshTitleScreen(){
    const cont=document.getElementById('title-continue');
    if(cont) cont.style.display=hasSaveFile()?'block':'none';
}
function beginIntro(){
    gameState='INTRO';
    document.getElementById('title-screen').style.display='none';
    document.getElementById('intro-screen').style.display='flex';
    dContainer.style.display='flex';
    playIntroLine();
}
function continueGameFromTitle(e){
    if(e) e.stopPropagation();
    if(gameState!=='TITLE') return;
    if(!loadGameFromSave()){refreshTitleScreen();return;}
    initPlayer(true);
    initWorldAfterLoad();
    maybeResumeDay2MeetingOnLoad();
}
function startNewGameFromTitle(e){
    if(e) e.stopPropagation();
    if(gameState!=='TITLE') return;
    if(hasSaveFile()){
        document.getElementById('title-screen').style.display='none';
        gameState='PLAYING';
        activeDialogue=["There is already a saved game.","Starting a new game will erase it. OK?","[CHOICE_NEW_GAME_OVERWRITE]"];
        activeLine=0;
        dName.innerText='SYSTEM';
        dText.innerText=activeDialogue[0];
        drawPortrait('NONE');
        dContainer.style.display='flex';
        checkChoiceTrigger();
        return;
    }
    resetGameStateForNewGame();
    initPlayer(false);
    initWorldAfterLoad();
    beginIntro();
}
function triggerPAAnnouncement(){
    if(typeof notifyDriveCustomerPresent==='function')notifyDriveCustomerPresent('pa');
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
    else if(c==='FRED_NANDERS'){let cust=maps.drive&&maps.drive.npcs?maps.drive.npcs.find(n=>n.id==='angry_customer'):null;let skin=cust?cust.color:'#c68642';let shirt=cust?cust.shirt:'#3d3d3d';let hair=cust?cust.hair:'#3d2817';pR(18,48,28,16,shirt);pR(22,22,20,24,skin);pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,hair);pR(18,20,4,8,'rgba(60,45,30,0.55)');pR(42,20,4,8,'rgba(60,45,30,0.55)');pR(20,26,10,6,'rgba(80,55,30,0.45)');pR(34,38,8,4,'rgba(70,50,25,0.5)');pR(24,40,16,3,'rgba(50,35,20,0.65)');}
    else if(c==='BRI'){pR(18,48,28,16,'#222');pR(22,22,20,24,'#fff0f0');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#cc0000');pR(16,24,6,20,'#cc0000');pR(42,24,6,20,'#cc0000');pR(28,42,8,2,'#fff');}
    else if(c==='PLAYER'){let skin=playerDetails.gender==='Boy'?'#ffccaa':'#ffdbac';let hair=playerDetails.gender==='Boy'?'#4a3121':'#f6c944';pR(18,48,28,16,playerDetails.inUniform?'#111':'#fff');pR(22,22,20,24,skin);pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');if(playerDetails.gender==='Boy'){pR(20,16,24,8,hair);pR(18,20,4,10,hair);}else{pR(18,16,28,10,hair);pR(18,26,6,18,hair);pR(40,26,6,18,hair);}}
    else if(c==='GUS'){ pR(16,48,32,16,'#111'); pR(22,18,20,26,'#ffdbac'); pR(26,28,2,2,'#111');pR(36,28,2,2,'#111'); pR(29,38,6,1,'#111'); pR(18,16,6,14,'#d4a017');pR(40,16,6,14,'#d4a017');pR(22,14,20,4,'#d4a017'); }
    else if(c==='PAINT_TECH'){ pR(16,48,32,16,'#e5e7eb'); pR(22,18,20,26,'#ffdbac'); pCtx.strokeStyle='#111';pCtx.lineWidth=1;pCtx.strokeRect(24,26,6,5);pCtx.strokeRect(34,26,6,5);pCtx.beginPath();pCtx.moveTo(30,28);pCtx.lineTo(34,28);pCtx.stroke(); pR(29,38,6,1,'#111'); }
    else if(c==='PETE'||c==='TY'){pR(18,48,28,16,'#dc2626');pR(22,22,20,24,'#ffdbac');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#333');}
    else if(c==='RITA'){pR(18,48,28,16,'#4c1d95');pR(22,22,20,24,'#e5c4a8');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#222');pR(24,30,6,4,'rgba(255,255,255,0.4)');pR(34,30,6,4,'rgba(255,255,255,0.4)');}
    else if(c==='CUST'){pR(18,48,28,16,'#1e3a8a');pR(22,22,20,24,'#dcb');pR(26,32,2,2,'#111');pR(36,32,2,2,'#111');pR(20,16,24,8,'#555');}
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
    else if(txt==="[CHOICE_PROBATION_FIRED]"){currentChoiceType='PROBATION_FIRED';dText.innerText="Your employment has ended.\nReturn to title screen?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_RESET_GAME]"){currentChoiceType='RESET_GAME';dText.innerText="Erase all save data\nand start over?";cBox.style.display='flex';arrow.style.display='none';}
    else if(txt==="[CHOICE_NEW_GAME_OVERWRITE]"){currentChoiceType='NEW_GAME_OVERWRITE';dText.innerText="Erase the saved game\nand start a new one?";cBox.style.display='flex';arrow.style.display='none';}
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
                 recordProbationRO();
                 if(gameEvents.dailyAptsCompleted<3){
                     let nApt=gameEvents.dailyAptsCompleted===1?"mid-day":"afternoon";
                     activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nYour "+nApt+" appointment\nhas arrived.","[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."];
                     spawnCurrentDriveCustomer();
                 }else if(gameEvents.dailyWalkIn&&!gameEvents.dailyWalkInDone){
                     activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nWait, another car just pulled up.\nIt's a walk-in!","[P.A. SYSTEM]\n"+playerDetails.name+" to the service drive,\nguest is waiting."];
                     spawnCurrentDriveCustomer();
                 }else{
                     activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nThat's it for today.\nEnd your shift at your computer."];
                     hideDriveCustomerSlots();
                 }
             } else if(gameEvents.carWaitingForRO==='walkin'){
                 gameEvents.carWaitingForRO=false; gameEvents.dailyWalkInDone=true; questState.roNumber++;
                 recordProbationRO();
                 hideDriveCustomerSlots();
                 activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!\nThe drive is empty.","Time to clock out at your computer."];
             } else if(gameEvents.carWaitingForRO==='fred_story'){
                 gameEvents.carWaitingForRO=false;
                 questState.roNumber++;
                 if(typeof setFredPhase==='function')setFredPhase('need_mike');
                 activeDialogue=["Writing Repair Order...","RO #"+questState.roNumber+" printed!","Take it to Mike for dispatch."];
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
            let debriefLines=null;
            if(probation.active&&probation.outcome!=='fired'&&probation.outcome!=='passed'){
                debriefLines=processProbationEndOfShift();
            }
            if(probation.finalReviewComplete){
                triggerFlash();
                activeDialogue=debriefLines||buildFinalReviewDialogue(probation.outcome==='passed');
                activeLine=0;dText.innerText=activeDialogue[0];dName.innerText="SYSTEM";drawPortrait('NONE');
                return;
            }
            if(probation.outcome==='fired'){
                triggerFlash();
                activeDialogue=debriefLines||["MIKE: \"You're done here.\"","[CHOICE_PROBATION_FIRED]"];
                activeLine=0;dText.innerText=activeDialogue[0];dName.innerText="MIKE";drawPortrait('MIKE');
                return;
            }
            if(shouldRunDay2Meeting()){
                applyEndOfShiftDayRollover();
                day2MeetingPhase='idle';
                gameEvents.pendingDay2Meeting=true;
                triggerFlash();
                activeDialogue=null;
                dContainer.style.display='none';
                return;
            }
            applyEndOfShiftDayRollover();
            resetDriveCustomersForNewDay();
            triggerFlash();
            if(debriefLines){
                activeDialogue=debriefLines.concat(buildDayStartLinesWithStory());
            }else{
                activeDialogue=buildDayStartLinesWithStory();
            }
            activeLine=0;dText.innerText=activeDialogue[0];dName.innerText="SYSTEM";drawPortrait('NONE');
        }
    }
    else if(currentChoiceType==='PROBATION_FIRED'){
        if(val==='YES'){
            localStorage.removeItem(SAVE_KEY);
            resetGameStateForNewGame();
            initPlayer(false);
            initWorldAfterLoad();
            returnToTitleScreen();
        }else{
            activeDialogue=["You remain on the lot.\nBut you're not on the schedule."];
            activeLine=0;dText.innerText=activeDialogue[0];
        }
    }
    else if(currentChoiceType==='NEW_GAME_OVERWRITE'){
        if(val==='YES'){
            localStorage.removeItem(SAVE_KEY);
            refreshTitleScreen();
            resetGameStateForNewGame();
            initPlayer(false);
            initWorldAfterLoad();
            beginIntro();
        }else{
            gameState='TITLE';
            activeDialogue=null;
            dContainer.style.display='none';
            document.getElementById('title-screen').style.display='flex';
            refreshTitleScreen();
        }
    }
    else if(currentChoiceType==='RESET_GAME'){
        if(val==='YES'){resetGameToTitle();}
        else{activeDialogue=["Reset cancelled."];activeLine=0;dText.innerText=activeDialogue[0];}
    }
    else if(currentChoiceType==='CHECKIN_DAILY'){
        if(val==='NO'){activeDialogue=["You ignored the vehicle."];activeLine=0;dText.innerText=activeDialogue[0];if(probation.active)adjustCSI(-2);}
        if(val==='YES'){
            if(typeof isFredAppointmentActive==='function'&&isFredAppointmentActive()&&typeof onFredCheckInConfirmed==='function'){
                onFredCheckInConfirmed();
            }else{
                gameEvents.carWaitingForRO='daily';
                activeDialogue=["Vehicle checked in.\nGo to your computer to write the RO."];
                activeLine=0;dText.innerText=activeDialogue[0];
            }
        }
    }
    else if(currentChoiceType==='CHECKIN_WALKIN'){
        if(val==='NO'){activeDialogue=["You turned away the walk-in."];activeLine=0;dText.innerText=activeDialogue[0];if(probation.active){adjustCSI(-5);addWarning('Refused walk-in guest.');}}
        if(val==='YES'){gameEvents.carWaitingForRO='walkin';activeDialogue=["Vehicle checked in.\nGo to your computer to write the RO."];activeLine=0;dText.innerText=activeDialogue[0];}
    }
    else if(currentChoiceType==='SAVE_GAME'){if(val==='NO'){activeDialogue=["Save cancelled."];activeLine=0;dText.innerText=activeDialogue[0];}if(val==='YES'){persistGame();activeDialogue=["Saving...\nDon't turn off the power.",playerDetails.name+" saved the game!"];activeLine=0;dText.innerText=activeDialogue[0];}}
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
function confirmRivalName(){if(introScript[introIndex].action!=='[SHOW_RIVAL_NAME]')return;let n=document.getElementById('rival-name-input').value.toUpperCase();if(n.trim()==='')n='KASEY';playerDetails.rivalName=n;const rivalObj=maps.shop.npcs.find(npc=>npc.id==='rival');if(rivalObj){rivalObj.name=playerDetails.rivalName;rivalObj.dialogue=[`Whatever, ${playerDetails.name}.\nI only wrench for Mike or Ryan.`];}if(typeof syncAutoworldRivalName==='function')syncAutoworldRivalName();document.getElementById('rival-name-box').style.display='none';dContainer.style.display='flex';introIndex++;playIntroLine();}
function advanceDialogue(){
    if(cBox.style.display==='flex')return;
    if(gameState==='STORY'&&typeof advanceCinematicDialogue==='function'){
        if(advanceCinematicDialogue())return;
    }
    if(gameState==='INTRO'){
        if(introScript[introIndex]&&introScript[introIndex].type==='ACTION')return;
        introIndex++; if(introIndex<introScript.length) playIntroLine();
    }else if(activeDialogue){
        if(gameEvents.inDay2Meeting&&day2MeetingPhase==='pa'){
            activeLine++;
            if(activeLine>=activeDialogue.length){teleportToOfficeForDay2Meeting();}
            return;
        }
        if(gameEvents.inDay2Meeting&&day2MeetingPhase==='office'){
            if(advanceDay2OfficeDialogue())return;
            completeDay2MeetingAndReleaseToDrive();
            return;
        }
        activeLine++;
        while(activeLine<activeDialogue.length&&(activeDialogue[activeLine]==='[STORY_EVENT_END]'||activeDialogue[activeLine]==='[ACTION_FINAL_PROBATION_REVIEW]')){
            if(activeDialogue[activeLine]==='[STORY_EVENT_END]'){completeStoryEvent();activeLine++;}
            if(activeLine<activeDialogue.length&&activeDialogue[activeLine]==='[ACTION_FINAL_PROBATION_REVIEW]'){
                evaluateFinalProbation();
                activeDialogue=buildFinalReviewDialogue(probation.outcome==='passed');
                activeLine=0;
                dText.innerText=activeDialogue[0];
                dName.innerText="SYSTEM";
                drawPortrait('NONE');
                checkChoiceTrigger();
                return;
            }
        }
        if(activeLine>=activeDialogue.length){
            if(typeof onRyanDialogueFinished==='function'&&onRyanDialogueFinished()){dContainer.style.display='none';activeDialogue=null;return;}
            if(gameEvents.activeStoryEvent){completeStoryEvent();}
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
            if((questState.step===6&&dName.innerText==='MIKE')||gameEvents._mikeOfficeShoesTalk){
                gameEvents._mikeOfficeShoesTalk=false;
                questState.step=7; playerDetails.hasRunningShoes=true;
                gameEvents.pendingRyanTour=true;
                gameEvents.pendingRyanDriveArrival=true;
                if(typeof armRyanWalkAroundAfterMikeOffice==='function')armRyanWalkAroundAfterMikeOffice();
                if (typeof playMusicJingle === 'function') playMusicJingle('fanfare');
                activeDialogue=[
                    "You received the Non-Slip Running Shoes!\nHold 'B' (or Shift) while moving to run.",
                    "MIKE: By the way, don't tell anyone\nI told you to run in here.",
                    "MIKE: I don't need OSHA up in here.",
                    "(Look around the shop, parts, and drive\nbefore noon.)"
                ];
                activeLine=0;dName.innerText="SYSTEM";dText.innerText=activeDialogue[0];drawPortrait('NONE');return;
            }
            if(gameEvents.inWhitneyCheckInTutorial){
                gameEvents.inWhitneyCheckInTutorial=false;
                completeWhitneyCheckInTutorial();
                dContainer.style.display='none';activeDialogue=null;
                return;
            }
            if(gameState==='CUTSCENE'){
                gameState='PLAYING';
                gameEvents.firstCustomerTriggered=true;
                questState.active=true;
                questState.step=1;
                if(typeof beginWhitneyApproachCinematic==='function')beginWhitneyApproachCinematic();
                else startWhitneyCheckInTutorial();
                return;
            }
            if(questState.step===4&&dName.innerText==='BRONSON'){questState.step=5;gameEvents.pendingMikeOfficePage=true;if(typeof dispatchVehicleToShopWithFlash==='function')dispatchVehicleToShopWithFlash();else triggerFlash();}
            if(completeMikeOfficePageIfNeeded()){
                dContainer.style.display='none';
                activeDialogue=null;
                return;
            }
            dContainer.style.display='none';activeDialogue=null;
        }else{
            dText.innerText=activeDialogue[activeLine];
            applyDialogueSpeakerPortrait(activeDialogue[activeLine]);
            checkChoiceTrigger();
        }
    }
}

window.refreshTitleScreen = refreshTitleScreen;
window.beginIntro = beginIntro;
window.continueGameFromTitle = continueGameFromTitle;
window.startNewGameFromTitle = startNewGameFromTitle;
window.triggerPAAnnouncement = triggerPAAnnouncement;
window.drawPortrait = drawPortrait;
window.resetChoices = resetChoices;
window.checkChoiceTrigger = checkChoiceTrigger;
window.makeChoice = makeChoice;
window.triggerFlash = triggerFlash;
window.playIntroLine = playIntroLine;
window.selectGender = selectGender;
window.confirmName = confirmName;
window.confirmRivalName = confirmRivalName;
window.advanceDialogue = advanceDialogue;