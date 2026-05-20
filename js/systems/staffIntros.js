/* First-meet intros after Ryan's walk-around beat (step 7+) */

const SHOP_INTRO_EXEMPT = { damone: true, bri: true };

const STAFF_INTRO_SKIP_MAPS = { drive: true };

function ensureMetStaffIds() {
    if (!gameEvents.metStaffIds) gameEvents.metStaffIds = [];
}

function isStaffIntroTourActive() {
    return !!gameEvents.staffIntroTourActive
        && !!gameEvents.ryanTourComplete
        && questState.step >= 7;
}

function hasMetStaff(npcId) {
    ensureMetStaffIds();
    return gameEvents.metStaffIds.indexOf(npcId) !== -1;
}

function markStaffMet(npcId) {
    ensureMetStaffIds();
    if (gameEvents.metStaffIds.indexOf(npcId) === -1) {
        gameEvents.metStaffIds.push(npcId);
    }
}

function getStaffIntroLines(npc) {
    if (!npc || !npc.id) return null;
    const n = playerDetails.name || 'CHANDLER';
    const rival = playerDetails.rivalName || 'KASEY';

    const lines = {
        rival: [
            rival + ': Oh. You must be ' + n + '.',
            rival + ": I'm " + rival + ". Mike's nephew.",
            rival + ": Try not to get in my way\non the floor."
        ],
        joe: [
            "JOE: You're the new advisor?",
            "JOE: I'm Joe. Senior Master Tech.",
            "JOE: Basic ROs don't touch my bay.\nGot it?"
        ],
        vinnie: [
            "VINNIE: Hey — you must be " + n + ".",
            "VINNIE: I'm Vinnie. Quick jobs only.",
            "VINNIE: No engine work. Don't\nargue with me about it."
        ],
        bronson: [
            "BRONSON: New face on the drive?",
            "BRONSON: Bronson. I fix what\nothers walk away from.",
            "BRONSON: Those comeback numbers\nare rumors anyway."
        ],
        ej: [
            "EJ: Welcome to parts!",
            "EJ: I'm EJ — I'll pull your\nparts fast if you ask nice."
        ],
        little_mike: [
            "LITTLE MIKE: You the new advisor?",
            "LITTLE MIKE: Little Mike. Second\nbest counterman here.",
            "LITTLE MIKE: ...Which still makes me\nbetter than Adam."
        ],
        jake: [
            "JAKE: Who are you?",
            "JAKE: Jake. I run the back of\nthis counter.",
            "JAKE: If the label's wrong,\nblame Adam. Always Adam."
        ],
        adam: [
            "ADAM: Hi! Are you lost?",
            "ADAM: I'm Adam. I order parts.",
            "ADAM: Sometimes I order the\nwrong parts. It happens!"
        ],
        jerry: [
            "JERRY: Another advisor, huh.",
            "JERRY: Jerry. Thirty years in\nthis parts department.",
            "JERRY: Have I told you about\nmy son Kevin?"
        ],
        coolant_joe: [
            "COOLANT JOE: *Gulp*",
            "COOLANT JOE: New advisor? Cool.",
            "COOLANT JOE: I'm Coolant Joe.\nDon't drink the green stuff."
        ],
        gus: [
            "GUS: Hey there.",
            "GUS: Gus. Body side of the shop.",
            "GUS: Damone's the cool one.\nI'm just thorough."
        ],
        paint_stan: [
            "STAN: Shhh — clear coat drying.",
            "STAN: Stan. Paint room.",
            "STAN: Perfect finish. Every time.\nNow please step back."
        ],
        dave: [
            "DAVE: Hey buddy!",
            "DAVE: Dave. Sales floor.",
            "DAVE: I need ROs closed five\nminutes ago. Chop chop!"
        ],
        brad: [
            "BRAD: Oh, hey. New advisor?",
            "BRAD: I'm Brad. Sales.",
            "BRAD: Take your time. Dave's\nalways yelling about something."
        ],
        john: [
            "JOHN: You train jiu jitsu?",
            "JOHN: I'm John. Sales.",
            "JOHN: Everything's leverage —\ncars, deals, life."
        ],
        troy: [
            "TROY: Who sent you in here?",
            "TROY: Troy. Sales.",
            "TROY: I only accept excellence.\nDon't forget that."
        ],
        nick: [
            "NICK: Service can't slow down\nmy deals.",
            "NICK: Nick. Sales manager.",
            "NICK: Keep the drive moving."
        ],
        office_ryan: [
            "RYAN: Oh — you're out exploring.",
            "RYAN: Desk is on the drive if\nyou need me."
        ],
        office_zack: [
            "ZACK: Hey. You must be " + n + ".",
            "ZACK: Zack. Another advisor.",
            "ZACK: Bronson's numbers are\nkilling my week."
        ],
        office_whitney: [
            "WHITNEY: You're the new hire?",
            "WHITNEY: Whitney. CSI is my\nreligion. Don't tank it."
        ],
        stall_guy: [
            "STALL GUY: Occupied!",
            "STALL GUY: ...Fine. New guy?",
            "STALL GUY: Find another stall."
        ]
    };

    return lines[npc.id] || null;
}

function resolveStaffIntroDialogue(npc) {
    if (!isStaffIntroTourActive()) return false;
    if (!npc || npc.isObject || npc.hidden) return false;
    if (STAFF_INTRO_SKIP_MAPS[currentMapKey]) return false;
    if (currentMapKey === 'shop' && SHOP_INTRO_EXEMPT[npc.id]) return false;
    if (npc.id === 'ryan' || npc.id === 'office_ryan') return false;
    if (npc.charCode === 'CUSTOMER' || npc.id.indexOf('customer') !== -1) return false;
    if (npc.id.indexOf('zack_cust') !== -1 || npc.id === 'angry_customer') return false;
    if (hasMetStaff(npc.id)) return false;

    const intro = getStaffIntroLines(npc);
    if (!intro || !intro.length) return false;

    markStaffMet(npc.id);
    activeDialogue = intro.slice();
    dName.innerText = npc.name || npc.id.toUpperCase();
    return true;
}

function beginStaffIntroTour() {
    gameEvents.staffIntroTourActive = true;
    ensureMetStaffIds();
}

window.resolveStaffIntroDialogue = resolveStaffIntroDialogue;
window.beginStaffIntroTour = beginStaffIntroTour;
